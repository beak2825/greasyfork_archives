// ==UserScript==
// @exclude      *
// @author       Yours Truly
// @version      1.2.1

// ==UserLibrary==
// @name         AO3Boxicons
// @description  Reusable library that initialized the boxicons css and serves functions to turn stats and menus into icons
// @license      MIT

// ==/UserScript==

// ==/UserLibrary==

/**
 *
 * @param {Object} settings
 * @param {String} settings.boxiconsVersion Used version of https://boxicons.com/
 * @param {Boolean} settings.iconifyStats   Flag that indicates if the AO3 work stat names should be turned into icons
 * @param {Object} settings.statsSettings   Individual settings for stat icons
 *                                          that typically consist of { iconClass: string, solid: boolean, tooltip: string }
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
 * @param {Object} settings.statsSettings.kudos2HitsOptions
 * @param {Object} settings.statsSettings.timeToReadOptions
 * @param {Object} settings.statsSettings.dateWorkPublishedOptions
 * @param {Object} settings.statsSettings.dateWorkUpdateOptions
 * @param {Object} settings.statsSettings.dateWorkCompleteOptions
 * @param {Object} settings.iconifyUserNav  Flag that indicates if the AO3 user navigation should be turned into icons
 * @param {Object} settings.userNavSettings Individual settings for user nav icons
 *                                          that typically consist of { iconClass: string, solid: boolean, tooltip: string, addTooltip: boolean }
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
  const settings = {
    boxiconsVersion: "2.1.4",
  };
  mergeSettings(settings, customSettings);

  /**
   * Initialises boxicons.com css and adds a small css to add some space between icon and stats count.
   */
  function initBoxicons() {
    // load boxicon style
    const boxicons = document.createElement("link");
    boxicons.setAttribute("href", `https://unpkg.com/boxicons@${settings?.boxiconsVersion}/css/boxicons.min.css`);
    boxicons.setAttribute("rel", "stylesheet");
    document.head.appendChild(boxicons);

    // css that adds margin for icons
    const boxiconsCSS = document.createElement("style");
    boxiconsCSS.setAttribute("type", "text/css");
    boxiconsCSS.innerHTML = `
        i.bx {
          margin-right: .3em;
        }`;
    document.head.appendChild(boxiconsCSS);
  }

  /**
   * Creates a new element with the icon class added to the classList.
   *
   * @param {Object} options
   * @param {String} options.iconClass    Name of the boxicons class to use. (The "bx(s)" prefix can be omitted)
   * @param {String} options.tooltip      Adds an optional tooltip to the element.
   *                                      Only if `addTooltip = true`.
   * @param {Boolean} options.addTooltip  Indicates if a tooltip should be added to the element.
   *                                      `tooltip` needs to be present in `options`.
   * @param {Boolean} options.solid       Indicates if the icon should be of the "solid" variant.
   *                                      Will be ignored if `iconClass` has "bx(s)" prefix.
   * @returns <i> Element with the neccessary classes for a boxicons icon.
   */
  function getNewIconElement(options = {}) {
    const i = document.createElement("i");
    i.classList.add("bx");
    if (options?.addTooltip && options?.tooltip) i.setAttribute("title", options.tooltip);

    if (/^bxs?-/i.test(options.iconClass)) {
      // check if the icon class has the bx(s) prefix and simply set it, ignoring any settings for solid
      i.classList.add(options.iconClass);
    } else {
      // else, add the fittings prefix
      i.classList.add(options?.solid ? "bxs-" + options.iconClass : "bx-" + options.iconClass);
    }
    return i;
  }

  /**
   * Prepends the given boxicons class to the given element.
   * Note: If the element is an <i> tag, nothing will happen, as we assume that the <i> is already an icon.
   *
   * @param {HTMLElement} element      Parent element that the icon class should be prepended to.
   * @param {Object} options
   * @param {String} options.iconClass Name of the boxicons class to use. (The "bx(s)" prefix can be omitted)
   * @param {String} options.tooltip   Adds a tooltip to the element
   * @param {Boolean} options.solid    Indicates if the icon should be of the "solid" variant.
   *                                   Will be ignored if iconClass has "bx(s)" prefix.
   */
  function setIcon(element, options = {}) {
    if (element.tagName !== "I") element.prepend(getNewIconElement(options));
    if (options?.tooltip) element.setAttribute("title", options.tooltip);
  }

  /**
   * Iterates through all elements that apply to the given querySelector and adds an element with the given icon class to it.
   *
   * @param {String} querySelector     CSS selector for the elements to find and iconify.
   * @param {Object} options
   * @param {String} options.iconClass Name of the boxicons class to use. (The "bx(s)" prefix can be omitted)
   * @param {String} options.tooltip   Adds a tooltip to the element
   * @param {Boolean} options.solid    Indicates if the icon should be of the "solid" variant.
   *                                   Will be ignored if iconClass has "bx(s)" prefix.
   */
  function findElementsAndSetIcon(querySelector, options = {}) {
    const els = document.querySelectorAll(querySelector);
    els.forEach((el) => (el.firstChild.nodeType === Node.ELEMENT_NODE ? setIcon(el.firstChild, options) : setIcon(el, options)));
  }

  /**
   * Adds an CSS that will hide the stats titles and prepends an icon to all stats.
   */
  function iconifyStats() {
    const WordsTotal = "dl.statistics dd.words";
    const WordsWork = "dl.stats dd.words";
    const WordsSeries = ".series.meta.group dl.stats>dd:nth-of-type(1)";
    const ChaptersWork = "dl.stats dd.chapters";
    const CollectionsWork = "dl.stats dd.collections";
    const CommentsWork = "dl.stats dd.comments";
    const KudosTotal = "dl.statistics dd.kudos";
    const KudosWork = "dl.stats dd.kudos";
    const BookmarksTotal = "dl.statistics dd.bookmarks";
    const BookmarksWork = "dl.stats dd.bookmarks";
    const BookmarksSeries = ".series.meta.group dl.stats>dd:nth-of-type(4)";
    const BookmarksCollection = "li.collection dl.stats dd a[href$=bookmarks]";
    const HitsTotal = "dl.statistics dd.hits";
    const HitsWork = "dl.stats dd.hits";
    const SubscribersTotal = "dl.statistics dd[class=subscriptions]";
    const SubscribersWork = "dl.stats dd.subscriptions";
    const ChallengesCollection = "li.collection dl.stats dd a[href$=collections]";
    const FandomsCollection = "li.collection dl.stats dd a[href$=fandoms]";
    const RequestsCollection = "li.collection dl.stats dd a[href$=requests]";
    const AuthorSubscribers = "dl.statistics dd.user.subscriptions";
    const CommentThreads = "dl.statistics dd.comment.thread";
    const WorksCollection = "li.collection dl.stats dd a[href$=works]";
    const WorksSeries = ".series.meta.group dl.stats>dd:nth-of-type(2)";
    const SeriesComplete = ".series.meta.group dl.stats>dd:nth-of-type(3)";
    const Kudos2HitsWork = "dl.stats dd.kudos-hits-ratio";
    const ReadingTimeWork = "dl.stats dd.reading-time";
    const DatePublishedWork = "dl.work dl.stats dd.published";
    const DateStatusTitle = "dl.work dl.stats dt.status";
    const DateStatusWork = "dl.work dl.stats dd.status";

    const localSettings = {
      wordCountOptions: { tooltip: "Word Count", iconClass: "pen", solid: true },
      chaptersOptions: { tooltip: "Chapters", iconClass: "food-menu" },
      collectionsOptions: { tooltip: "Collections", iconClass: "collection", solid: true },
      commentsOptions: { tooltip: "Comments", iconClass: "chat", solid: true },
      kudosOptions: { tooltip: "Kudos", iconClass: "heart", solid: true },
      bookmarksOptions: { tooltip: "Bookmarks", iconClass: "bookmarks", solid: true },
      hitsOptions: { tooltip: "Hits", iconClass: "show-alt" },
      workSubsOptions: { tooltip: "Subscriptions", iconClass: "bell", solid: true },
      authorSubsOptions: { tooltip: "User Subscriptions", iconClass: "bell-ring", solid: true },
      commentThreadsOptions: { tooltip: "Comment Threads", iconClass: "conversation", solid: true },
      challengesOptions: { tooltip: "Challenges/Subcollections", iconClass: "collection", solid: false },
      fandomsOptions: { tooltip: "Fandoms", iconClass: "crown", solid: true },
      requestsOptions: { tooltip: "Prompts", iconClass: "invader", solid: true },
      workCountOptions: { tooltip: "Work Count", iconClass: "library" },
      seriesCompleteOptions: { tooltip: "Series Complete", iconClass: "flag-checkered", solid: true },
      kudos2HitsOptions: { tooltip: "Kudos to Hits", iconClass: "hot", solid: true },
      timeToReadOptions: { tooltip: "Time to Read", iconClass: "hourglass", solid: true },
      dateWorkPublishedOptions: { tooltip: "Published", iconClass: "calendar-plus" },
      dateWorkUpdateOptions: { tooltip: "Updated", iconClass: "calendar-edit" },
      dateWorkCompleteOptions: { tooltip: "Completed", iconClass: "calendar-check" },
    };
    // merge incoming settings into local settings (overwrite)
    mergeSettings(localSettings, settings?.statsSettings);

    // css to hide stats titles
    const statsCSS = document.createElement("style");
    statsCSS.setAttribute("type", "text/css");
    statsCSS.innerHTML = `
        dl.stats dt {
          display: none !important;
        }`;
    document.head.appendChild(statsCSS);

    findElementsAndSetIcon(`${WordsTotal}, ${WordsWork}, ${WordsSeries}`, localSettings.wordCountOptions);
    findElementsAndSetIcon(ChaptersWork, localSettings.chaptersOptions);
    findElementsAndSetIcon(CollectionsWork, localSettings.collectionsOptions);
    findElementsAndSetIcon(CommentsWork, localSettings.commentsOptions);
    findElementsAndSetIcon(`${KudosTotal}, ${KudosWork}`, localSettings.kudosOptions);
    findElementsAndSetIcon(`${BookmarksTotal}, ${BookmarksWork}, ${BookmarksCollection}, ${BookmarksSeries}`, localSettings.bookmarksOptions);
    findElementsAndSetIcon(`${HitsTotal}, ${HitsWork}`, localSettings.hitsOptions);
    findElementsAndSetIcon(`${SubscribersTotal}, ${SubscribersWork}`, localSettings.workSubsOptions);
    findElementsAndSetIcon(AuthorSubscribers, localSettings.authorSubsOptions);
    findElementsAndSetIcon(CommentThreads, localSettings.commentThreadsOptions);
    findElementsAndSetIcon(ChallengesCollection, localSettings.challengesOptions);
    findElementsAndSetIcon(FandomsCollection, localSettings.fandomsOptions);
    findElementsAndSetIcon(RequestsCollection, localSettings.requestsOptions);
    findElementsAndSetIcon(`${WorksCollection}, ${WorksSeries}`, localSettings.workCountOptions);
    findElementsAndSetIcon(SeriesComplete, localSettings.seriesCompleteOptions);

    // AO3E elements
    findElementsAndSetIcon(Kudos2HitsWork, localSettings.kudos2HitsOptions);
    findElementsAndSetIcon(ReadingTimeWork, localSettings.timeToReadOptions);

    // calendar icons at works page
    findElementsAndSetIcon(DatePublishedWork, localSettings.dateWorkPublishedOptions);
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
      accountOptions: { tooltip: "User Area", addTooltip: true, iconClass: "user-circle", solid: true },
      postNewOptions: { tooltip: "New Work", addTooltip: true, iconClass: "book-add", solid: true },
      logoutOptions: { tooltip: "Logout", addTooltip: true, iconClass: "log-out" },
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
     
      ${LogoutUserNav} i.bx {
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

  initBoxicons();

  if (settings?.iconifyStats) iconifyStats();
  if (settings?.iconifyUserNav) iconifyUserNav();
}
