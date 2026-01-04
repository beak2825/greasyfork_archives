// ==UserScript==
// @name        显示 Github 仓库大小
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     0.0.5
// @author      bling-yshs
// @description 一个简单的油猴脚本，可以显示当前 Github 仓库的大小（暂不支持私人仓库）
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @license     MIT
// @homepageURL https://greasyfork.org/zh-CN/scripts/493368-%E6%98%BE%E7%A4%BA-github-%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F
// @downloadURL https://update.greasyfork.org/scripts/493368/%E6%98%BE%E7%A4%BA%20Github%20%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493368/%E6%98%BE%E7%A4%BA%20Github%20%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

// 开源地址：https://github.com/bling-yshs/show-github-repo-size-script，欢迎反馈

async function main() {
  const repoSize = await getRepoSize();
  if (repoSize === 0) {
    return;
  }
  // 并且保留两位小数
  const mbSize = (repoSize / 1024).toFixed(2);
  // 获取class为"UnderlineNav-body list-style-none"的ul元素
  const ul = document.querySelector('ul.UnderlineNav-body.list-style-none');
  // 定义要添加的HTML文本
  const liHtml = `<li data-view-component="true" class="d-inline-flex">
  <a id="settings-tab" data-tab-item="i8settings-tab" data-selected-links="code_review_limits codespaces_repository_settings collaborators custom_tabs hooks integration_installations interaction_limits issue_template_editor key_links_settings notifications repo_announcements repo_branch_settings repo_keys_settings repo_pages_settings repo_rule_insights repo_rulesets repo_rules_bypass_requests repo_protected_tags_settings repo_settings reported_content repo_custom_properties repository_actions_settings repository_actions_settings_add_new_runner repository_actions_settings_general repository_actions_settings_runners repository_actions_settings_runner_details repository_environments role_details secrets secrets_settings_actions secrets_settings_codespaces secrets_settings_dependabot security_analysis security_products /bling-yshs/Actions-ImmortalWrt/settings" data-pjax="#repo-content-pjax-container" data-turbo-frame="repo-content-turbo-frame" data-analytics-event="{&quot;category&quot;:&quot;Underline navbar&quot;,&quot;action&quot;:&quot;Click tab&quot;,&quot;label&quot;:&quot;Settings&quot;,&quot;target&quot;:&quot;UNDERLINE_NAV.TAB&quot;}" data-view-component="true" class="UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item">
  
<svg t="1713967465043" class="octicon octicon-graph UnderlineNav-octicon d-none d-sm-inline" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23658" width="16" height="16"><path d="M511.850044 0.299912C229.332813 0.299912 0.299912 107.568486 0 239.929708v544.140584c0 132.461193 229.132871 239.929708 511.850044 239.929708s511.850044-107.468515 511.850044-239.929708V239.929708C1023.400176 107.568486 794.367275 0.299912 511.850044 0.299912zM167.950796 895.737577c-22.093527 0-39.988285-17.894757-39.988285-39.988285s17.894757-39.988285 39.988285-39.988284 39.988285 17.894757 39.988284 39.988284-17.894757 39.988285-39.988284 39.988285z m791.768036-188.644733c-17.894757 11.496632-37.489017 22.193498-58.782778 32.190569-104.969247 49.18559-243.228742 76.277653-389.08601 76.277653s-284.116763-27.092063-389.08601-76.277653c-21.293762-9.997071-40.888021-20.693937-58.782779-32.190569v-79.176804c87.274431 73.778385 255.125256 123.66377 447.868789 123.663771s360.594357-49.885385 447.868788-123.663771v79.176804zM127.962511 583.828956c0-22.093527 17.894757-39.988285 39.988285-39.988284s39.988285 17.894757 39.988284 39.988284-17.894757 39.988285-39.988284 39.988285-39.988285-17.894757-39.988285-39.988285z m831.756321-148.156594c-17.894757 11.496632-37.489017 22.193498-58.782778 32.190569-104.969247 49.18559-243.228742 76.277653-389.08601 76.277653S227.733281 517.048521 122.764034 467.862931c-21.293762-9.997071-40.888021-20.693937-58.782779-32.190569v-79.176804c87.274431 73.778385 255.125256 123.66377 447.868789 123.66377s360.594357-49.885385 447.868788-123.66377v79.176804z" p-id="23659" fill="#636c76"></path></svg>
        <span data-content="Settings">${mbSize}MB</span>
          <span id="settings-repo-tab-count" data-pjax-replace="" data-turbo-replace="" title="Not available" data-view-component="true" class="Counter"></span>
</a></li>`;
  
  // 直接将HTML文本添加到ul的末尾
  ul.insertAdjacentHTML('beforeend', liHtml);
  
}


async function getRepoSize() {
  // 获取当前页面的URL，保存为currentUrl
  const currentUrl = window.location.href;
  // 正则提取
  const regex = /github\.com\/([^\/]+\/[^\/]+)/;
  const match = currentUrl.match(regex);
  let usernameAndRepo = '';
  if (match) {
    usernameAndRepo = match[1];
  }
  if (!usernameAndRepo) {
    return 0;
  }
  console.log(`当前存储库：${usernameAndRepo}`)
  // 发送请求到，例如：https://api.github.com/repos/bling-yshs/ys-image-host
  let response;
  response = await fetch(`https://api.github.com/repos/${usernameAndRepo}`);
  let data = await response.json();
  let size = data.size;
  if (!size) {
    return 0;
  }
  return size;
}

main()
