// ==UserScript==
// @name         GGn lucianjp - Gallery Search
// @namespace    https://greasyfork.org/
// @version      1.3.0
// @description  Display the search into a cover gallery
// @author       lucianjp
// @icon         https://gazellegames.net/favicon.ico
// @match        https://gazellegames.net/torrents.php
// @match        https://gazellegames.net/torrents.php?*
// @exclude      /[?&](id|groupid)=/
// @exclude      /[?&]action=(notify|delete_notify)/
// @exclude      /[?&]type=(seeding|uploaded|leeching|snatched|snatched_not_seeding|extlink|downloaded|hitnrun|viewseed)/
// @run-at       document-start
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @require      https://update.greasyfork.org/scripts/476017/1357292/userscripts-core-library.js
// @noframes
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/471448/GGn%20lucianjp%20-%20Gallery%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/471448/GGn%20lucianjp%20-%20Gallery%20Search.meta.js
// ==/UserScript==

const defaultConfig = {
  apikey: "",
  enabled: false,
  cache: false,
  categoryIcons: [undefined, "cats_applications", "cats_ebooks", "cats_ost"],
  platformIcons: {},
};
 
const style = `
  .gallery-hidden{
    display: none !important;
  }
 
  #gallery-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
    grid-gap: 8px 2px;
    justify-items: center;
  }
  gallery-item {
    width: 186px;
    /*margin-bottom: 26px;*/
    position: relative;
  }
  .gallery-item-title {
    padding: 5px;
    text-overflow: ellipsis;
    line-height: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.12);
  }
 
 .gallery-item-title .gallery-item-platformicon
  {
    display:inline-block;
    background-size: contain;
    width:15px;
    height: 15px;
    vertical-align: middle;
    background-repeat: no-repeat;
  }
 
  .gallery-item-grouplink {
    display: block;
    text-align: center;
    overflow:hidden;
    position:relative;
  }
 
  .gallery-item-image {
    max-width: 186px;
    max-height: 300px;
    vertical-align: middle;
  }
 
  .lazy{
    opacity: 0;
    transition: opacity 0.3s;
    top:0;
    left:0;
    position:absolute;
  }
 
  .lazy.lazy-loaded {
      opacity: 1;
      position:initial;
  }
 
  .blur-image {
    background-image: url('data:image/bmp;base64,Qk1aBAAAAAAAADYAAAAoAAAABAAAAAMAAAABABgAAAAAACQAAAATCwAAEwsAAAAAAAAAAAAASGNaZndwgY+CbH9xXW1afHxti5KGeIh6VWhDfGdCa3FpUXNp');
    background-size: cover;
    background-position: center;
    filter:blur(1px);
    width:186px;
    height:270px;
  }
  .blur-image.lazy-loaded{
    display:none;
  }
 
  #gallery-header {
    margin-bottom: 10px;
    padding: 4px;
  }
  #gallery-header > a {
    cursor: pointer;
    float:right;
    margin-left: 5px;
  }
`;
 
const cache = new UserJsCore.Cache({ storeName: "coverCache" });
 
(async () => {
  const config = await UserJsCore.Config.init(defaultConfig);
 
  class Icons {
    static #_icons = config.get("platformIcons");
    static #_iconfetched = false;
 
    static #fetch() {
      document
        .querySelectorAll("#torrent_table .cats_col>div[title]")
        .forEach((element) => {
          const title = element.title;
          if (element.classList.length > 0)
            Icons.#_icons[title] = element.classList[0];
        });
 
      config.set("platformIcons", Icons.#_icons);
      Icons.#_iconfetched = true;
    }
 
    static get(category, platform) {
      const lookup = Icons.#_icons[platform];
      if (lookup) return lookup;
      if (platform && !Icons.#_iconfetched) {
        Icons.#fetch();
        return Icons.get(category, platform);
      }
      return config.get("categoryIcons")[category - 1];
    }
  }
 
  class API {
    #mapper = {
      groups(objects) {
        return Object.values(objects).flatMap((obj) => {
          if (obj.ID !== undefined) {
            return {
              id: obj.ID,
              name: unescapeHTML(obj.Name),
              year: obj.Year,
              image:
                (obj.WikiImage ?? "") ||
                `${window.location.origin}/static/common/noartwork/games.png`,
              platform: obj.Artists?.[0]?.name,
              category: obj.categoryid,
            };
          }
          return [];
        });
      },
    };
 
    constructor() {
      if (!config.get("apikey")) {
        UserJsCore.ready(this.apiKeyInput);
      }
    }
 
    apiKeyInput() {
      noty({
        text: 'GGn Gallery Search APIKey (no permissions) <input id="apikey" type="text">',
        buttons: [
          {
            addClass: "btn btn-primary",
            text: "Ok",
            onClick: function ($noty) {
              const enteredKey = $noty.$bar.find("input#apikey").val();
              if(enteredKey.length > 6){
                config.set("apikey", enteredKey);
                config.set("enabled", true);
                $noty.close();
                noty({ text: "GGn Gallery Ready", type: "success" });
                gallery.render();
                gallery.init();
                gallery.update();
              }
              else{
                noty({
                  type: "error",
                  text: "Please enter a full API-Key.",
                });
              }
              
            },
          },
          {
            addClass: "btn btn-danger",
            text: "Cancel",
            onClick: function ($noty) {
              $noty.close();
            },
          },
        ],
      });
    }
 
    #callAPI(endpoint) {
      const that = this;
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open("GET", endpoint);
        req.setRequestHeader("X-API-Key", config.get("apikey"));
 
        req.onload = function () {
          if (this.status >= 200 && this.status < 300)
            resolve(this.responseText);
          else if (this.status == 401) {
            noty({
              type: "error",
              text: "Unauthorized GGn Gallery APIKey (torrents)",
            });
            config.set("apikey", null);
            config.set("enabled", false);
            that.apiKeyInput();
          } else if (this.status >= 500 && this.status < 600) {
            reject("There was an error calling the API.\nPlease report a bug.");
          }
        };
 
        req.onerror = function (a) {
          reject("There was an error calling the API.\nPlease report a bug.");
        };
 
        req.send(null);
      });
    }
 
    async search(searchString) {
      const responseText = await this.#callAPI(
        `api.php?request=search&search_type=torrents${
          searchString ? "&" + searchString : ""
        }`
      );
      const regex = /\s*['"](\d+)['"]\s*:/g;
      const modifiedString = responseText.replace(regex, (match, digits) => {
        return match.replace(digits, `key${digits}`);
      });
 
      const apiresult = JSON.parse(modifiedString)?.response;
      const groupData = this.#mapper.groups(apiresult);
 
      return groupData;
    }
  }
  const api = new API();
 
  class GalleryItemRenderer {
    constructor() {
      this.template = document.createElement("template");
 
      const groupDiv = document.createDocumentFragment();
 
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("gallery-item-title");
 
      const platformLink = document.createElement("a");
      platformLink.classList.add("gallery-item-platformlink");
 
      const platformIcon = document.createElement("div");
      platformIcon.classList.add("gallery-item-platformicon");
 
      const hyphen = document.createElement("span");
      hyphen.textContent = " - ";
 
      const nameLink = document.createElement("a");
      nameLink.classList.add("gallery-item-groupname");
 
      const imageLink = document.createElement("a");
      imageLink.classList.add("gallery-item-grouplink");
 
      const lazyImage = document.createElement("img");
      lazyImage.classList.add("lazy", "gallery-item-image");
      lazyImage.referrerPolicy = "no-referrer";
 
      const blur = document.createElement("div");
      blur.classList.add("blur-image");
 
      platformLink.appendChild(platformIcon);
      titleDiv.appendChild(platformLink);
      titleDiv.appendChild(hyphen);
      titleDiv.appendChild(nameLink);
      groupDiv.appendChild(titleDiv);
      imageLink.appendChild(blur);
      imageLink.appendChild(lazyImage);
      groupDiv.appendChild(imageLink);
 
      this.template.content.appendChild(groupDiv);
 
      this.lazyLoadObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              const imageElement = entry.target;
              const src = imageElement.dataset.src;
              if (config.get("cache")) {
                try {
                  imageElement.src =
                    (await cache.getImage(src)) ??
                    (await cache.putImage(src, src));
                } catch {
                  imageElement.src = "/static/common/noimage.png";
                }
              } else {
                imageElement.src = src;
              }
 
              imageElement.onload = () => {
                const blurhashElement = imageElement.previousElementSibling;
                blurhashElement.classList.add("lazy-loaded");
                imageElement.classList.add("lazy-loaded");
                observer.unobserve(imageElement);
              };
            }
          });
        },
        {
          root: null,
          rootMargin: "310px 0px",
        }
      );
    }
 
    render(parent, data) {
      const element = this.template.content.cloneNode(true);
 
      const icon = Icons.get(data.categoryId, data.platformName);
      const $platform = element.querySelector(".gallery-item-platformlink");
 
      if (icon) {
        const $icon = element.querySelector(".gallery-item-platformicon");
        $icon.classList.add(icon);
        $icon.title = data.platformName;
      } else if (data.platformName) {
        $platform.textContent = data.platformName;
      }
 
      if (data.platformName) $platform.href = data.platformLink;
 
      const $name = element.querySelector(".gallery-item-groupname");
      $name.textContent = data.groupName;
      $name.href = data.groupLink;
      $name.title = `${data.groupName} (${data.groupYear})`;
 
      const $imageLink = element.querySelector(".gallery-item-grouplink");
      $imageLink.href = $name.href;
      $imageLink.title = $name.title;
 
      const $image = element.querySelector(".gallery-item-image");
      $image.dataset.src = data.image;
 
      this.lazyLoadObserver.observe($image);
 
      parent.replaceChildren(element);
    }
  }
  const galleryItemRenderer = new GalleryItemRenderer();
 
  class GalleryItem extends HTMLElement {
    constructor() {
      super();
      this._rendererDelegate = galleryItemRenderer;
    }
 
    static get observedAttributes() {
      return ["groupName", "groupYear", "groupId", "image", "platformName", "categoryId"];
    }

    get groupYear() {
      return this.getAttribute("groupYear");
    }

    set groupYear(value) {
      this.setAttribute("groupYear", value);
    }
 
    get groupName() {
      return this.getAttribute("groupName");
    }
 
    set groupName(value) {
      this.setAttribute("groupName", value);
    }
 
    get groupId() {
      return this.getAttribute("groupId");
    }
 
    set groupId(value) {
      this._groupLink = `torrents.php?id=${value}`;
      this.setAttribute("groupId", value);
    }
 
    get groupLink() {
      return this._groupLink;
    }
 
    get image() {
      return this.getAttribute("image");
    }
 
    set image(value) {
      this.setAttribute("image", value);
    }
 
    get platformName() {
      return this.getAttribute("platformName");
    }
 
    set platformName(value) {
      if (this.platformName || value) {
        this._platformLink = `artist.php?artistname=${encodeURIComponent(
          value
        )}`;
        this.setAttribute("platformName", value);
      }
    }
 
    get platformLink() {
      return this._platformLink;
    }
 
    get categoryId() {
      return this.getAttribute("categoryId");
    }
 
    set categoryId(value) {
      this.setAttribute("categoryId", value);
    }
 
    attributeChangedCallback(name, oldValue, newValue) {
      this.isRenderPending = true;
      // Queue a microtask to handle rendering
      Promise.resolve().then(() => this.handleRender());
    }
 
    render() {
      this._rendererDelegate.render(this /*.shadowRoot*/, {
        groupName: this.groupName,
        groupYear: this.groupYear,
        groupLink: this.groupLink,
        platformName: this.platformName,
        platformLink: this.platformLink,
        image: this.image,
        categoryId: this.categoryId,
      });
 
      this.isRenderPending = false;
    }
 
    handleRender() {
      if (this.isRenderPending) {
        this.render();
      }
    }
 
    connectedCallback() {
      this.render();
    }
  }
  customElements.define("gallery-item", GalleryItem);
 
  class Gallery {
    constructor() {
      this.loaded = false;
      this.groupsDataIndex = 0;
      this.lastCallTime = 0;
      this.isNextCallScheduled = false;
      this.$gallery = document.createElement("div");
      this.$gallery.id = "gallery";
 
      if (config.get("apikey")) this.render();
 
      this.pageElementsPromise = this.observePageElements();
      this.cachePromise = config.get("cache")
        ? cache.init()
        : Promise.resolve(true);
 
      if (config.get("enabled"))
        Promise.all([this.init(), this.pageElementsPromise]).then(() => {
          this.update();
        });
    }
 
    get isInfiniteScroll() {
      return config.get("infiniteScroll");
    }
    set isInfiniteScroll(value) {
      config.set("infiniteScroll", value);
    }
 
    get isEnabled() {
      return config.get("enabled");
    }
    set isEnabled(value) {
      config.set("enabled", value);
    }
 
    observePageElements() {
      return new Promise((resolve, reject) => {
        this.pageElements = new UserJsCore.ObservableCollection();
 
        this.pageElements
          .add(
            "results",
            new UserJsCore.Observable(
              () => document.querySelector("div#torrentbrowse .submit>span"),
              ($node) =>
                $node.tagName === "SPAN" &&
                $node.matches("div#torrentbrowse .submit>span")
            )
          )
          .then(($node) => {
            this.resultsCount = ~~$node.textContent?.replace(/\D/g, "");
          });
 
        this.pageElements
          .add(
            "head",
            new UserJsCore.Observable(
              () => document.getElementsByTagName("head")[0],
              ($node) => $node.tagName === "HEAD"
            )
          )
          .then(($node) => {
            const $style = document.createElement("style");
            $style.setAttribute("type", "text/css");
            $style.textContent = style;
            $node.appendChild($style);
          });
 
        this.pageElements
          .add(
            "table",
            new UserJsCore.Observable(
              () => document.getElementById("torrent_table"),
              ($node) =>
                $node.tagName === "TABLE" && $node.id === "torrent_table"
            )
          )
          .then(($node) => {
            if (this.isEnabled) hide($node);
            resolve();
          });
 
        this.pageElements
          .add(
            "pager-top",
            new UserJsCore.Observable(
              () => document.getElementsByClassName("linkbox")?.[0],
              ($node) =>
                $node.tagName === "DIV" &&
                $node.className.indexOf("linkbox") !== -1 &&
                $node.previousElementSibling.id !== "torrent_table"
            )
          )
          .then(($node) => {
            if (this.isEnabled && this.isInfiniteScroll) hide($node);
 
            $node.after(this.$gallery);
          });
 
        this.pageElements
          .add(
            "pager-bottom",
            new UserJsCore.Observable(
              () => document.getElementsByClassName("linkbox")?.[1],
              ($node) => {
                if (
                  $node.tagName === "DIV" &&
                  $node.className.indexOf("linkbox") !== -1
                )
                  if ($node.previousElementSibling.id === "torrent_table")
                    return true;
                return false;
              }
            )
          )
          .then(($node) => {
            if (this.isEnabled && this.isInfiniteScroll) hide($node);
          });
 
        this.pageElements
          .add(
            "header",
            new UserJsCore.Observable(
              () => document.getElementById("torrent_table")?.rows[0].cells[0],
              ($node) =>
                $node.tagName === "TR" &&
                $node.className.indexOf("colhead") !== -1
            )
          )
          .then(($node) => {
            const headerStyles = window.getComputedStyle($node);
            config.set(
              "headerStyles",
              Array.from(headerStyles).reduce((cssString, styleName) => {
                if (styleName.startsWith("background")) {
                  return `${cssString}${styleName}: ${headerStyles.getPropertyValue(
                    styleName
                  )};\n`;
                }
                return cssString;
              }, "")
            );
 
            if (this.$headerStyles)
              this.$headerStyles.textContent = `
            #gallery-header, .gallery-item-title{
              ${config.get("headerStyles")}
            }
          `;
          });
 
        this.pageElements.add(
          "filter",
          new UserJsCore.Observable(
            () => document.getElementsByName("filter")?.[0],
            ($node) => $node.tagName === "FORM" && $node.name === "filter"
          )
        );
 
        UserJsCore.observe(this.pageElements, false);
      });
    }
 
    async init() {
      if (this.loaded) {
        return;
      }
 
      this.params = new URLSearchParams(window.location.search);
      const getFilters = () =>
        Object.fromEntries(
          new FormData(this.pageElements.get("filter").currentValue)
        );
      this.currentPage = +(this.params.get("page") ?? 1);
 
      if (
        this.params.size === 0 ||
        (this.params.size === 1 && this.params.has("page"))
      ) {
        if (!config.get("defaultFilter")) {
          await this.pageElementsPromise;
          if (
            this.pageElements
              .get("filter")
              .currentValue.querySelector("input[name=cleardefault]")
          ) {
            config.set("defaultFilter", getFilters());
          }
        }
 
        const defaultParams = new URLSearchParams(
          config.get("defaultFilter") || {}
        );
        if (this.params.has("page"))
          defaultParams.append("page", this.params.get("page"));
 
        this.params = defaultParams;
      }
 
      this.getNextGroupsData()
        .then(async (result) => {
          await this.cachePromise;
          this.addItems(result);
          if (window.location.search)
            this.pageElements
              .get("pager-top")
              .currentValue.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
        })
        .finally(() => this.#noDataHandler());
 
      this.pageElementsPromise.then(() => {
        this.pageElements
          .get("filter")
          .currentValue.querySelector("input[name=setdefault]")
          ?.addEventListener("click", () => {
            config.set("defaultFilter", getFilters());
          });
 
        this.pageElements
          .get("filter")
          .currentValue.querySelector("input[name=cleardefault]")
          ?.addEventListener("click", () => {
            config.set("defaultFilter", {});
          });
      });
 
      document.addEventListener("keydown", (event) => {
        if (this.isInfiniteScroll || !this.isEnabled) return;
 
        if (
          event.code === "ArrowLeft" &&
          !["INPUT", "SELECT"].includes(document.activeElement?.tagName)
        ) {
          if (this.currentPage > 1) {
            this.params.set("page", this.currentPage - 1);
            window.location.search = this.params.toString();
          }
        }
 
        if (
          event.code === "ArrowRight" &&
          !["INPUT", "SELECT"].includes(document.activeElement?.tagName)
        ) {
          this.params.set("page", this.currentPage + 1);
          window.location.search = this.params.toString();
        }
      });
 
      this.loaded = true;
    }
 
    render() {
      const galleryHeader = document.createElement("div");
      galleryHeader.id = "gallery-header";
 
      const galleryTitle = document.createElement("strong");
      galleryTitle.textContent = "Gallery";
 
      const galleryToggle = document.createElement("a");
      galleryToggle.textContent = "[Toggle]";
      galleryToggle.addEventListener("click", () => {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
          this.init().then(() => {
            this.update();
          });
        } else {
          this.update();
        }
      });
 
      this.galleryScroll = document.createElement("a");
      this.galleryScroll.addEventListener("click", () => {
        this.isInfiniteScroll = !this.isInfiniteScroll;
        this.update();
      });
 
      this.galleryClearCache = document.createElement("a");
      this.galleryClearCache.textContent = "[Clear Cache]";
      this.galleryClearCache.addEventListener("click", async () => {
        if (confirm("Are you sure you want to clear the cover cache?")) {
          await cache.clear();
          alert(
            `The Cache has been cleared\n{ indexdb: '${cache.name}', objectStore: '${cache.storeName}' }`
          );
        }
      });
 
      this.galleryCache = document.createElement("a");
      this.galleryCache.addEventListener("click", async () => {
        const newCacheValue = !config.get("cache");
        config.set("cache", newCacheValue);
        if (newCacheValue) await cache.init();
        this.update();
      });
 
      this.infiniteScroll = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              //console.log("intersecting");
              if (this.isInfiniteScroll) {
                const currentTime = Date.now();
                const timeSinceLastCall = currentTime - this.lastCallTime;
 
                if (timeSinceLastCall >= 2000) {
                  this.lastCallTime = currentTime;
                  this.getNextGroupsData()
                    .then((result) => this.addItems(result))
                    .finally(() => this.#noDataHandler());
                } else if (!this.isNextCallScheduled) {
                  this.isNextCallScheduled = true;
 
                  const timeToWait = 2000 - timeSinceLastCall;
 
                  setTimeout(async () => {
                    this.lastCallTime = Date.now();
                    this.getNextGroupsData()
                      .then((result) => this.addItems(result))
                      .finally(() => this.#noDataHandler());
                    this.isNextCallScheduled = false;
                  }, timeToWait);
                }
              }
            }
          });
        },
        { root: null, rootMargin: `600px 0px` }
      );
 
      this.galleryContainer = document.createElement("div");
      this.galleryContainer.id = "gallery-container";
 
      this.$headerStyles = document.createElement("style");
      this.$headerStyles.textContent = `
      #gallery-header, .gallery-item-title{
        ${config.get("headerStyles")}
      }
    `;
 
      if (!this.isEnabled) {
        hide(this.galleryScroll);
        hide(this.galleryClearCache);
        hide(this.galleryCache);
        hide(this.galleryContainer);
      }
      galleryHeader.append(
        galleryTitle,
        galleryToggle,
        this.galleryScroll,
        this.galleryClearCache,
        this.galleryCache
      );
      this.$gallery.append(
        this.$headerStyles,
        galleryHeader,
        this.galleryContainer
      );
    }
 
    async getNextGroupsData() {
      const searchParams = new URLSearchParams(this.params);
      if (this.groupsDataIndex > 0)
        searchParams.set("page", this.currentPage + this.groupsDataIndex);
      this.groupsDataIndex++;
 
      const result = await api.search(searchParams.toString());
      return result;
    }
 
    #noDataHandler() {
      if (this.resultsCount > 0 && !this.galleryContainer.hasChildNodes()) {
        this.galleryContainer.appendChild(
          document.createTextNode("Gallery : Error in API")
        );
        show(this.pageElements.get("table").currentValue);
      }
    }
 
    addItems(groupsData) {
      this.infiniteScroll.disconnect();
      if (groupsData.length == 0) return;
 
      const fragment = document.createDocumentFragment();
      const galleryItems = groupsData.map((groupData) => {
        const galleryItem = document.createElement("gallery-item");
        galleryItem.groupName = groupData.name;
        galleryItem.groupYear = groupData.year;
        galleryItem.image = groupData.image;
        galleryItem.platformName = groupData.platform;
        galleryItem.groupId = groupData.id;
        galleryItem.categoryId = groupData.category;
        return galleryItem;
      });
 
      const lastitem = galleryItems[galleryItems.length - 1];
      fragment.append(...galleryItems);
      this.galleryContainer.appendChild(fragment);
      this.infiniteScroll.observe(lastitem);
    }
 
    update() {
      if (this.isEnabled) {
        hide(this.pageElements.get("table").currentValue);
        show(this.galleryContainer);
 
        if (this.isInfiniteScroll) {
          this.galleryScroll.textContent = "[Pager]";
          hide(this.pageElements.get("pager-top").currentValue);
          hide(this.pageElements.get("pager-bottom").currentValue);
        } else {
          this.galleryScroll.textContent = "[Infinite Scroll]";
          show(this.pageElements.get("pager-top").currentValue);
          show(this.pageElements.get("pager-bottom").currentValue);
        }
        show(this.galleryScroll);
 
        show(this.galleryCache);
        if (config.get("cache")) {
          this.galleryCache.textContent = "[Disable Cache]";
          show(this.galleryClearCache);
        } else {
          this.galleryCache.textContent = "[Enable Cache]";
          hide(this.galleryClearCache);
        }
      } else {
        show(this.pageElements.get("table").currentValue);
        show(this.pageElements.get("pager-top").currentValue);
        show(this.pageElements.get("pager-bottom").currentValue);
        hide(this.galleryContainer);
        hide(this.galleryScroll);
        hide(this.galleryCache);
        hide(this.galleryClearCache);
      }
    }
  }
  const gallery = new Gallery();
})();
 
function show(element) {
  if (element) element.classList.remove("gallery-hidden");
}
 
function hide(element) {
  if (element) element.classList.add("gallery-hidden");
}
 
function unescapeHTML(escapedString) {
  return new DOMParser().parseFromString(escapedString, "text/html")
    .documentElement.textContent;
}
