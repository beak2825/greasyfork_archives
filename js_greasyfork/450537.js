// ==UserScript==
// @name                 jandan github view
// @namespace            http://tampermonkey.net/
// @version              0.1
// @description          煎蛋整体样式更改为 github
// @author               鈴宮華緋
// @include              /https?:\/\/jandan\.net/
// @require              http://code.jquery.com/jquery-latest.js
// @license              MIT
// @resource github_view http://www.xduu.top/test/github_view.css
// @grant                GM_addStyle
// @grant                GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/450537/jandan%20github%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/450537/jandan%20github%20view.meta.js
// ==/UserScript==

(function() {
  // GM_addStyle(GM_getResourceText("github_view"));
  // GM_addStyle(GM_getResourceText("iconfont"));
  console.log(location);
  const pull_requests_link = '';
  const issues_link = '';
  const marketplace_link = '';
  const explore_link = '';

  const body = $('body');

  // 顶部导航
  const header = $(
    '<header class="github-view-header">\
      <div class="github-view-header-item">\
        <a class="github-view-head-link">\
          <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="github-view-icon">\
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>\
          </svg>\
        </a>\
      </div>\
      <div class="github-view-header-item github-view-header-item-full">\
        <div class="github-view-head-search">\
          <form class="github-view-search-form">\
            <label>\
              <input placeholder="Search or jump to...">\
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true" class="github-view-header-search-key-slash">\
                <path fill="none" stroke="#979A9C" opacity=".4" d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"></path><path fill="#979A9C" d="M11.8 6L8 15.1h-.9L10.8 6h1z"></path>\
              </svg>\
            </label>\
          </form>\
        </div>\
        <nav class="github-view-global-nav">\
          <a class="github-view-global-nav-item github-view-head-link">Pull requests</a>\
          <a class="github-view-global-nav-item github-view-head-link">Issues</a>\
          <a class="github-view-global-nav-item github-view-head-link">Marketplace</a>\
          <a class="github-view-global-nav-item github-view-head-link">Explore</a>\
        </nav>\
      </div>\
      <div class="github-view-header-item github-view-cursor-pointer">\
        <a class="github-view-head-link">\
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
            <path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z"></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path>\
          </svg>\
        </a>\
      </div>\
      <div class="github-view-header-item github-view-cursor-pointer github-view-head-link">\
        <detail class="github-view-detail">\
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
            <path fill-rule="evenodd" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>\
          </svg>\
          <span class="github-view-dropdown-caret"></span>\
        </detail>\
      </div>\
      <div class="github-view-header-item github-view-cursor-pointer github-view-head-link">\
        <detail class="github-view-detail">\
          <img class="github-view-avatar github-view-circle" width="20" height="20" src="./img/suzumiya.png"/>\
          <span class="github-view-dropdown-caret"></span>\
        </detail>\
      </div>\
    </header>'
  );
  body.append(header);

  let appMain = null;
  let appTop = null;
  let appContainer = null;
  let appLeftSide = null;
  let appMiddle = null;
  let appRightSide = null;
  
  appMain = $('<div></div>');

  body.append(appMain);

  appTop = $(
    '<div class="github-view-app-top">\
      <div class="github-view-container-xl github-view-app-top-container">\
        <div class="github-view-layout">\
          <div class="github-view-layout-sidebar"></div>\
          <div class="github-view-layout-main">\
            <nav class="github-view-layout-nav">\
              <a class="github-view-layout-nav-item github-view-layout-nav-item-current">\
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
                  <path fill-rule="evenodd" d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z"></path>\
                </svg>\
                Overview\
              </a>\
              <a class="github-view-layout-nav-item" >\
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
                  <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>\
                </svg>\
                Repositories\
                <span class="github-view-counter">6</span>\
              </a>\
              <a class="github-view-layout-nav-item" >\
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
                  <path fill-rule="evenodd" d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v3.585a.746.746 0 010 .83v8.085A1.75 1.75 0 0114.25 16H6.309a.748.748 0 01-1.118 0H1.75A1.75 1.75 0 010 14.25V6.165a.746.746 0 010-.83V1.75zM1.5 6.5v7.75c0 .138.112.25.25.25H5v-8H1.5zM5 5H1.5V1.75a.25.25 0 01.25-.25H5V5zm1.5 1.5v8h7.75a.25.25 0 00.25-.25V6.5h-8zm8-1.5h-8V1.5h7.75a.25.25 0 01.25.25V5z"></path>\
                </svg>\
                Projects\
              </a>\
              <a class="github-view-layout-nav-item" >\
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
                  <path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z"></path>\
                </svg>\
                Packages\
              </a>\
              <a class="github-view-layout-nav-item" >\
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="github-view-icon">\
                  <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>\
                </svg>\
                Stars\
                <span class="github-view-counter">3</span>\
              </a>\
            </nav>\
          </div>\
        </div>\
      </div>\
    </div>'
  );
  
  appMain.append(appTop);

  appTop.find('.github-view-layout-nav-item').click((event) => {
    let target = event.target;
    appTop.find('.github-view-layout-nav-item').removeClass('github-view-layout-nav-item-current');
    $(target).addClass('github-view-layout-nav-item-current');
  });
})();