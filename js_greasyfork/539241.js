// ==UserScript==
// @exclude      *
// @author       Yours Truly
// @version      1.0.1

// ==UserLibrary==
// @name         AO3LucideIcons
// @description  Reusable library that initialized lucide icons and serves functions to turn stats and menus into icons
// @license      MIT

// ==/UserScript==

// ==/UserLibrary==

/**
 *
 * @param {Object} settings
 * @param {Boolean} settings.iconifyStats   Flag that indicates if the AO3 work stat names should be turned into icons
 * @param {Object} settings.statsSettings   Individual settings for stat icons
 *                                          that typically consist of { icon: string, solid: boolean, tooltip: string }
 * @param {Object} settings.statsSettings.wordCountOptions
 * @param {Object} settings.statsSettings.chaptersOptions
 * @param {Object} settings.statsSettings.collectionsOptions
 * @param {Object} settings.statsSettings.commentsOptions
 * @param {Object} settings.statsSettings.kudosOptions
 * @param {Object} settings.statsSettings.bookmarksOptions
 * @param {Object} settings.statsSettings.hitsOptions
 * @param {Object} settings.statsSettings.workSubsOptions
 * @param {Object} settings.statsSettings.authorSubsOptions
 * @param {Object} settings.statsSettings.commentThreadsOptions
 * @param {Object} settings.statsSettings.challengesOptions
 * @param {Object} settings.statsSettings.fandomsOptions
 * @param {Object} settings.statsSettings.requestOptions
 * @param {Object} settings.statsSettings.workCountOptions
 * @param {Object} settings.statsSettings.seriesCompleteOptions
 * @param {Object} settings.statsSettings.charactersOptions
 * @param {Object} settings.statsSettings.relationshipsOptions
 * @param {Object} settings.statsSettings.additionalTagsOptions
 * @param {Object} settings.statsSettings.kudos2HitsOptions
 * @param {Object} settings.statsSettings.timeToReadOptions
 * @param {Object} settings.statsSettings.dateWorkPublishedOptions
 * @param {Object} settings.statsSettings.dateWorkUpdateOptions
 * @param {Object} settings.statsSettings.dateWorkCompleteOptions
 * @param {Object} settings.iconifyUserNav  Flag that indicates if the AO3 user navigation should be turned into icons
 * @param {Object} settings.userNavSettings Individual settings for user nav icons
 *                                          that typically consist of { icon: string, solid: boolean, tooltip: string, addTooltip: boolean }
 * @param {Object} settings.accountOptions
 * @param {Object} settings.postNewOptions
 * @param {Object} settings.logoutOptions
 *
 */
function IconifyAO3(customSettings = {}) {
  /**
   * Merges the second object into the first
   * If a value is in `a` but not in `b`, the value stays like it is.
   * If a value is in `b` but not in `a`, it gets copied over.
   * If a value is in both `a` and `b`, the value of `b` takes preference.
   *
   * @param {Object} a original settings
   * @param {Object} b user settings overwrite
   * @param {*} c used for temp storage, don't worry about it
   */
  function mergeSettings(a, b, c) {
    for (c in b) b.hasOwnProperty(c) && ((typeof a[c])[0] == "o" ? m(a[c], b[c]) : (a[c] = b[c]));
  }

  // set global settings and overwrite with incoming settings
  const settings = {};
  mergeSettings(settings, customSettings);

  /**
   * Initialises lucide.dev
   */
  function initLucide() {
    lucide.createIcons();
    const lucideCSS = document.createElement("style");
    lucideCSS.setAttribute("type", "text/css");
    lucideCSS.innerHTML = `
        .lucide {
          width: 1em;
          height: 1em;
          margin-right: .3em;
        }
          
        .lucide-icon {
          vertical-align: middle;
        }`;
    document.head.appendChild(lucideCSS);
  }

  /**
   * Creates a new element with the icon class added to the classList.
   *
   * @param {Object} options
   * @param {String} options.icon  Name of the icon to use.
   * @returns <i> Element with the neccessary classes for a boxicons icon.
   */
  function getNewIconElement(options = {}) {
    const i = document.createElement("i");
    const wrapper = document.createElement("span");

    i.setAttribute("data-lucide", options.icon);
    wrapper.appendChild(i);
    wrapper.classList.add("lucide-icon");

    return wrapper;
  }

  /**
   * Prepends the given boxicons class to the given element.
   * Note: If the element is an <i> tag, nothing will happen, as we assume that the <i> is already an icon.
   *
   * @param {HTMLElement} element         Parent element that the icon class should be prepended to.
   * @param {Object} options
   * @param {String} options.icon         Name of the icon to use
   * @param {String} options.tooltip      Adds a tooltip to the element
   * @param {Boolean} options.addTooltip  Indicates if a tooltip should be added to the element.
   *                                      `tooltip` needs to be present in `options`.
   */
  function setIcon(element, options = {}) {
    if (element.tagName !== "I") element.prepend(getNewIconElement(options));
    if (options?.addTooltip && options?.tooltip) element.setAttribute("title", options.tooltip);
  }

  /**
   * Iterates through all elements that apply to the given querySelector and adds an element with the given icon class to it.
   *
   * @param {String} querySelector        CSS selector for the elements to find and iconify.
   * @param {Object} options
   * @param {String} options.icon         Name of the icon to use.
   * @param {String} options.tooltip      Adds a tooltip to the element.
   * @param {Boolean} options.addTooltip  Indicates if a tooltip should be added to the element.
   *                                      `tooltip` needs to be present in `options`.
   */
  function findElementsAndSetIcon(querySelector, options = {}) {
    const els = document.querySelectorAll(querySelector);
    els.forEach((el) => (el.firstChild.nodeType === Node.ELEMENT_NODE ? setIcon(el.firstChild, options) : setIcon(el, options)));
  }

  /**
   * Adds an CSS that will hide the stats titles and prepends an icon to all stats.
   */
  function iconifyStats() {
    const StatsTotalWords = "dl.statistics dd.words";
    const StatsTotalHits = "dl.statistics dd.hits";
    const StatsTotalKudos = "dl.statistics dd.kudos";
    const StatsTotalBookmarks = "dl.statistics dd.bookmarks";
    const StatsTotalCommentThreads = "dl.statistics dd.comment.thread";
    const StatsTotalSubscribersWorks = "dl.statistics dd[class=subscriptions]";
    const StatsTotalSubscribersAuthor = "dl.statistics dd.user.subscriptions";

    const Language = "dl.stats dd.language,.work.meta.group dd.language";
    const Words = "dl.stats dd.words";
    const Chapters = "dl.stats dd.chapters";
    const Hits = "dl.stats dd.hits";
    const Kudos = "dl.stats dd.kudos";
    const Comments = "dl.stats dd.comments";
    const Bookmarks = "dl.stats dd.bookmarks";
    const WorkSeries = ".work.blurb.group ul.series>li,.work.meta.group dd.series";
    const Collections = "dl.stats dd.collections,.work.meta.group dd.collections";
    const Subscribers = "dl.stats dd.subscriptions";
    const Kudos2Hits = "dl.stats dd.kudos-hits-ratio";
    const ReadingTime = "dl.stats dd.reading-time";
    const DatePublished = "dl.stats dd.published";

    const SeriesComplete = ".series.group dl.stats>dd:last-of-type";

    const Works = "dl.stats dd.works";
    const Fandoms = "dl.stats dd.fandoms";
    const Requests = "dl.stats dd.prompts";

    const TagSetFandoms = ".tagset.group > dl.stats > dd:nth-of-type(1)";
    const TagSetCharacters = ".tagset.group > dl.stats > dd:nth-of-type(2)";
    const TagSetRelationship = ".tagset.group > dl.stats > dd:nth-of-type(3)";
    const TagSetAdditional = ".tagset.group > dl.stats > dd:nth-of-type(4)";

    const DateStatusTitle = "dl.work dl.stats dt.status";
    const DateStatusWork = "dl.work dl.stats dd.status";

    const localSettings = {
      languageOptions: { tooltip: "Language", addTooltip: true, icon: "languages" },
      wordCountOptions: { tooltip: "Word Count", addTooltip: true, icon: "pencil-line" },
      chaptersOptions: { tooltip: "Chapters", addTooltip: true, icon: "book-open-text" },
      seriesOptions: { tooltip: "Series", addTooltip: true, icon: "component" },
      collectionsOptions: { tooltip: "Collections", addTooltip: true, icon: "gallery-vertical-end" },
      commentsOptions: { tooltip: "Comments", addTooltip: true, icon: "message-square" },
      kudosOptions: { tooltip: "Kudos", addTooltip: true, icon: "sparkles" },
      bookmarksOptions: { tooltip: "Bookmarks", addTooltip: true, icon: "bookmark" },
      hitsOptions: { tooltip: "Hits", addTooltip: true, icon: "eye" },
      workSubsOptions: { tooltip: "Subscriptions", addTooltip: true, icon: "mail-check" },
      authorSubsOptions: { tooltip: "User Subscriptions", addTooltip: true, icon: "user-round-check" },
      commentThreadsOptions: { tooltip: "Comment Threads", addTooltip: true, icon: "messages-square" },
      challengesOptions: { tooltip: "Challenges/Subcollections", addTooltip: true, icon: "swords" },
      fandomsOptions: { tooltip: "Fandoms", addTooltip: true, icon: "land-plot" },
      requestsOptions: { tooltip: "Prompts", addTooltip: true, icon: "cake-slice" },
      workCountOptions: { tooltip: "Work Count", addTooltip: true, icon: "library" },
      seriesCompleteOptions: { tooltip: "Series Complete", addTooltip: true, icon: "circle-check-big" },
      kudos2HitsOptions: { tooltip: "Kudos to Hits", addTooltip: true, icon: "flame" },
      timeToReadOptions: { tooltip: "Time to Read", addTooltip: true, icon: "hourglass" },
      dateWorkPublishedOptions: { tooltip: "Published", addTooltip: true, icon: "calendar-plus" },
      dateWorkUpdateOptions: { tooltip: "Updated", addTooltip: true, icon: "calendar-clock" },
      dateWorkCompleteOptions: { tooltip: "Completed", addTooltip: true, icon: "calendar-check-2" },
      charactersOptions: { tooltip: "Characters", addTooltip: true, icon: "smile" },
      relationshipsOptions: { tooltip: "Relationships", addTooltip: true, icon: "rose" },
      additionalTagsOptions: { tooltip: "Additional Tags", addTooltip: true, icon: "tags" },
    };
    // merge incoming settings into local settings (overwrite)
    mergeSettings(localSettings, settings?.statsSettings);

    // css to hide stats titles
    const statsCSS = document.createElement("style");
    statsCSS.setAttribute("type", "text/css");
    statsCSS.innerHTML = `
        .statistics.meta.group dt, dl.stats dt {
          display: none;
        }`;
    document.head.appendChild(statsCSS);

    findElementsAndSetIcon(Language, localSettings.languageOptions);
    findElementsAndSetIcon(`${StatsTotalWords}, ${Words}`, localSettings.wordCountOptions);
    findElementsAndSetIcon(Chapters, localSettings.chaptersOptions);
    findElementsAndSetIcon(WorkSeries, localSettings.seriesOptions);
    findElementsAndSetIcon(Collections, localSettings.collectionsOptions);
    findElementsAndSetIcon(Comments, localSettings.commentsOptions);
    findElementsAndSetIcon(`${StatsTotalKudos}, ${Kudos}`, localSettings.kudosOptions);
    findElementsAndSetIcon(`${StatsTotalBookmarks}, ${Bookmarks}`, localSettings.bookmarksOptions);
    findElementsAndSetIcon(`${StatsTotalHits}, ${Hits}`, localSettings.hitsOptions);
    findElementsAndSetIcon(`${StatsTotalSubscribersWorks}, ${Subscribers}`, localSettings.workSubsOptions);
    findElementsAndSetIcon(StatsTotalSubscribersAuthor, localSettings.authorSubsOptions);
    findElementsAndSetIcon(StatsTotalCommentThreads, localSettings.commentThreadsOptions);
    // findElementsAndSetIcon(CollectionChallenges, localSettings.challengesOptions);
    findElementsAndSetIcon(`${Fandoms}, ${TagSetFandoms}`, localSettings.fandomsOptions);
    findElementsAndSetIcon(Requests, localSettings.requestsOptions);
    findElementsAndSetIcon(Works, localSettings.workCountOptions);
    findElementsAndSetIcon(SeriesComplete, localSettings.seriesCompleteOptions);
    findElementsAndSetIcon(TagSetCharacters, localSettings.charactersOptions);
    findElementsAndSetIcon(TagSetRelationship, localSettings.relationshipsOptions);
    findElementsAndSetIcon(TagSetAdditional, localSettings.additionalTagsOptions);

    // AO3E elements
    findElementsAndSetIcon(Kudos2Hits, localSettings.kudos2HitsOptions);
    findElementsAndSetIcon(ReadingTime, localSettings.timeToReadOptions);

    // calendar icons at works page
    findElementsAndSetIcon(DatePublished, localSettings.dateWorkPublishedOptions);
    const workStatus = document.querySelector(DateStatusTitle);
    if (workStatus && workStatus.innerHTML.startsWith("Updated")) {
      setIcon(document.querySelector(DateStatusWork), localSettings.dateWorkUpdateOptions);
    } else if (workStatus && workStatus.innerHTML.startsWith("Completed")) {
      setIcon(document.querySelector(DateStatusWork), localSettings.dateWorkCompleteOptions);
    }
  }

  /**
   * Replaces the "Hi, {user}!", "Post" and "Log out" text at the top of the page with icons.
   */
  function iconifyUserNav() {
    const localSettings = {
      accountOptions: { tooltip: "User Area", addTooltip: true, icon: "circle-user-round" },
      postNewOptions: { tooltip: "New Work", addTooltip: true, icon: "book-plus" },
      logoutOptions: { tooltip: "Logout", addTooltip: true, icon: "log-out" },
    };
    // merge incoming settings into local settings (overwrite)
    mergeSettings(localSettings, settings?.userNavSettings);

    const AccountUserNav = "#header a.dropdown-toggle[href*='/users/']";
    const PostUserNav = "#header a.dropdown-toggle[href*='/works/new']";
    const LogoutUserNav = "#header a[href*='/users/logout']";

    // add css for user navigation icons
    const userNavCss = document.createElement("style");
    userNavCss.setAttribute("type", "text/css");
    userNavCss.innerHTML = `
      ${LogoutUserNav},
      ${AccountUserNav},
      ${PostUserNav} {
        /* font size needs to be higher to make icons the right size */
        font-size: 1.25rem;
        /* left and right padding for a slightly bigger hover hitbox */
        padding: 0 .3rem;
      }
     
      ${LogoutUserNav} .lucide {
        /* overwrite the right margin for logout icon */
        margin-right: 0;
        /* add left margin instead to add more space to user actions */
        margin-left: .3em;
      }`;
    document.head.appendChild(userNavCss);

    // replace text with icons
    document.querySelector(AccountUserNav).replaceChildren(getNewIconElement(localSettings.accountOptions));
    document.querySelector(PostUserNav).replaceChildren(getNewIconElement(localSettings.postNewOptions));
    document.querySelector(LogoutUserNav).replaceChildren(getNewIconElement(localSettings.logoutOptions));
  }

  if (settings?.iconifyStats) iconifyStats();
  if (settings?.iconifyUserNav) iconifyUserNav();
  initLucide();
}