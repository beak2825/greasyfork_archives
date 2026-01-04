// ==UserScript==
// @name         Github加速clone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Github 加速 clone
// @author       d1y
// @match        https://github.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415947/Github%E5%8A%A0%E9%80%9Fclone.user.js
// @updateURL https://update.greasyfork.org/scripts/415947/Github%E5%8A%A0%E9%80%9Fclone.meta.js
// ==/UserScript==

(function () {

  /**
   * 非盈利性质机构提供
   * 
   * https://fastgit.org
   * 
   * https://github.com/FastGitORG
   */
  const fastgithub_url = "https://hub.fastgit.org";

  /*
   * 淘宝提供的镜像服务
   *
   * https://github.com/cnpm
   */
  let cnpmjs_url = "https://github.com.cnpmjs.org";

  // url
  let url = window.location.href;
  let url_data = url.split("/");
  let github_auth_name = url_data[3];
  let git_name = url_data[4];

  ;(function () {
    addCloneButton();
    addSiteButton();
  })()

  /**
   * 添加镜像站点按钮
   */
  function addSiteButton() {
    const title = "淘宝镜像"
    let template = `
<details class="get-repo-select-menu js-get-repo-select-menu  position-relative details-overlay details-reset">
    <summary class="btn ml-2 btn-primary">
        <a href="${cnpmjs_url}/${github_auth_name}/${git_name}" style="color:#fff;">${title}</a>
    </summary>  
</details>
`;
    $(".file-navigation").append(template);
  }

  /**
   * 添加克隆按钮
   */
  function addCloneButton() {
    let template = `<span class="d-flex">
<details class="get-repo-select-menu js-get-repo-select-menu  position-relative details-overlay details-reset">
    <summary class="btn ml-2 btn-primary">
        加速
        <span class="dropdown-caret"></span>
    </summary>
    <div class="position-relative">
        <div class="get-repo-modal dropdown-menu dropdown-menu-sw pb-0 js-toggler-container js-get-repo-modal p-3" style="width:352px;">
            <div class="get-repo-modal-options">
                <div class="clone-options https-clone-options">
                    <h4 class="mb-1">
                        使用HTTPS克隆
                        <a class="muted-link" href="https://docs.github.com/cn/github/using-git/which-remote-url-should-i-use" target="_blank" title="Which remote URL should I use?">
                            <svg class="octicon octicon-question" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
                                <path fill-rule="evenodd" d="M6 10h2v2H6v-2zm4-3.5C10 8.64 8 9 8 9H6c0-.55.45-1 1-1h.5c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5V7H4c0-1.5 1.5-3 3-3s3 1 3 2.5zM7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"></path>
                            </svg>
                        </a>
                    </h4>
                    <p class="mb-2 get-repo-decription-text">
                        CNPMJS.ORG加速通道
                    </p>
                    <div class="input-group mb-2">
                        <input type="text" class="form-control input-monospace input-sm" data-autoselect="" value="${cnpmjs_url}/${github_auth_name}/${git_name}.git" readonly="">
                        <div class="input-group-button">
                            <clipboard-copy value="${cnpmjs_url}/${github_auth_name}/${git_name}.git" class="btn btn-sm" tabindex="0" role="button"><svg class="octicon octicon-clippy" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>
                                </svg>
                            </clipboard-copy>
                        </div>
                    </div>
                    <p class="mb-2 get-repo-decription-text">
                        <a href="https://fastgit.org" target="_blank">FastGit.ORG</a>加速通道
                    </p>
                    <div class="input-group mb-2">
                        <input type="text" class="form-control input-monospace input-sm" data-autoselect="" value="${fastgithub_url}/${github_auth_name}/${git_name}.git" readonly="">
                        <div class="input-group-button">
                            <clipboard-copy value="${fastgithub_url}/${github_auth_name}/${git_name}.git" class="btn btn-sm" tabindex="0" role="button"><svg class="octicon octicon-clippy" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>
                                </svg>
                            </clipboard-copy>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</details>
</span>`;
    $(".file-navigation").append(template);
  }

})();
