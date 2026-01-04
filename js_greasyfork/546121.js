// ==UserScript==
// @name         Bangumi 社区月刊组件[测试]
// @version      1.2.3
// @description  在小组话题/条目讨论/日志/目录页右侧添加推荐面板；在首页右侧显示「Bangumi社区月刊」卡片
// @author       zin
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @connect      raw.githubusercontent.com
// @license      MIT
// @namespace https://greasyfork.org/users/1386262
// @downloadURL https://update.greasyfork.org/scripts/546121/Bangumi%20%E7%A4%BE%E5%8C%BA%E6%9C%88%E5%88%8A%E7%BB%84%E4%BB%B6%5B%E6%B5%8B%E8%AF%95%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/546121/Bangumi%20%E7%A4%BE%E5%8C%BA%E6%9C%88%E5%88%8A%E7%BB%84%E4%BB%B6%5B%E6%B5%8B%E8%AF%95%5D.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const JSON_URL = 'https://raw.githubusercontent.com/zintop/bangumi_monthly/main/bangumi_monthly_1.json';
  let COVER_IMG = '', COVER_THUMB = '', ISSUE_TITLE = '', ISSUE_VOL = '', ISSUE_URL_CHAHUA = '', ISSUE_URL_YUEKAN = '', RECOMMEND_LOG_ID = '';

  // 获取设置项的值
  const getSetting = (name, defaultValue) => {
    const value = localStorage.getItem(`bangumi_monthly_${name}`);
    return value !== null ? value === 'true' : defaultValue;
  };

  // 保存设置项的值
  const setSetting = (name, value) => {
    localStorage.setItem(`bangumi_monthly_${name}`, value);
  };

  // 初始化设置
  let homeCardEnabled = getSetting('homeCardEnabled', true);
  let recommendPanelEnabled = getSetting('recommendPanelEnabled', true);

  try {
    const res = await fetch(JSON_URL);
    const data = await res.json();
    ({ coverImg: COVER_IMG = '', coverThumb: COVER_THUMB = '', issueTitle: ISSUE_TITLE = '', issueVol: ISSUE_VOL = '', issueUrlChahua: ISSUE_URL_CHAHUA = '', issueUrlYuekan: ISSUE_URL_YUEKAN = '', recommendLogId: RECOMMEND_LOG_ID = '' } = data);
  } catch (err) {
    console.error('无法加载 Bangumi 月刊 JSON:', err);
    return;
  }

  const injectStyles = () => {
    const styles = `
      #monthly-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.15);z-index:9999;justify-content:center;align-items:center;backdrop-filter:blur(8px);animation:fadeIn .3s}
      #monthly-modal.active{display:flex}
      #monthly-modal .modal-content{position:relative;border-radius:20px;padding:8px;background:rgba(255,255,255,0.02);backdrop-filter:blur(25px);max-width:90%;max-height:90%;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.35);animation:slideUp .35s}
      #monthly-modal .inner-frame{border-radius:16px;border:6px solid rgba(255,255,255,0.12);padding:4px;background:rgba(255,255,255,0.02);display:flex;justify-content:center;align-items:center}
      #monthly-modal .inner-frame img{border-radius:12px;max-width:100%;max-height:80vh;object-fit:contain}
      #monthly-modal .footer{padding:10px 12px;text-align:center;font-size:1em;color:#e0e0e0;font-weight:700}
      #monthly-modal .footer a{color:#a0d8ff;text-decoration:none;margin:0 6px;transition:color .2s,text-shadow .2s}
      #monthly-modal .footer a:hover{color:#66bfff;text-shadow:0 0 4px rgba(0,0,0,.5)}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

      #bangumi-recommend-panel {
        margin-top: 15px;
      }
      #bangumi-recommend-panel .SidePanel {
        padding: 10px;
      }
      #bangumi-recommend-panel h2 {
        margin-bottom: 10px;
        font-size: 13px;
        font-weight: 400;
        line-height: 1.5;
        text-align: left;
      }
      #bangumi-recommend-panel h2 a {
        text-decoration: none;
      }
      #bangumi-recommend-panel h2 a:hover {
        color: #f09199;
      }
      #bangumi-recommend-panel textarea {
        width: 100%;
        min-height: 80px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
        box-sizing: border-box;
        margin-bottom: 8px;
      }
      #bangumi-recommend-panel button {
        width: 100%;
        padding: 8px 0;
        background-color: #f09199;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      #bangumi-recommend-panel button:hover {
        background-color: #e07179;
      }
    `;
    document.head.appendChild(Object.assign(document.createElement("style"), { textContent: styles }));
  };

  const injectCard = () => {
    if (window.location.pathname !== "/" || !homeCardEnabled) return;
    setTimeout(() => {
      const info = { id: "bangumi_monthly", title: "Bangumi 社区月刊", desc: `${ISSUE_TITLE} ${ISSUE_VOL}`, banner_url: COVER_THUMB || COVER_IMG, url: "javascript:void(0)" };
      const html = `<div class="featuredItems"><div id="${info.id}" class="appItem" style="background-image:linear-gradient(to right,rgba(0,0,0,.6),transparent 60%),url('${info.banner_url}');background-size:cover"><a href="${info.url}"><p class="title">${info.title}</p><p>${info.desc}</p></a></div></div>`;
      $("#columnHomeB .featuredItems").length ? $("#columnHomeB .featuredItems").first().after(html) : $("#columnHomeB").prepend(html);

      const modalHTML = `
        <div id="monthly-modal">
          <div class="modal-content">
            <div class="inner-frame"><img src="${COVER_IMG}" alt="社区月刊封面" /></div>
            <div class="footer">
              月刊上新 点击直达:
              <a href="${ISSUE_URL_CHAHUA}" target="_blank">靠谱人生茶话会</a> |
              <a href="${ISSUE_URL_YUEKAN}" target="_blank">Bangumi社区月刊</a>
            </div>
          </div>
        </div>`;
      document.body.insertAdjacentHTML("beforeend", modalHTML);

      const banner = document.getElementById("bangumi_monthly");
      const modal = document.getElementById("monthly-modal");
      banner.addEventListener("click", () => modal.classList.add("active"));
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });
    }, 0);
  };

  const path = location.pathname, BASE_URL = location.hostname;
  const shouldShowRecommendPanel = () => RECOMMEND_LOG_ID && recommendPanelEnabled && (/^\/group\/topic\/\d+$/.test(path) || /^\/blog\/\d+$/.test(path) || /^\/subject\/topic\/\d+$/.test(path) || /^\/index\/\d+$/.test(path));
  const getPostIdFromUrl = () => path.split('/').pop();

  const getAuthorInfo = () => {
    if (document.querySelector('.postTopic')) {
      const userLink = document.querySelector('.postTopic .inner strong a');
      return { id: document.querySelector('.postTopic').getAttribute('data-item-user') || userLink?.href?.split('/').pop() || '用户', name: userLink?.textContent.trim() || '用户' };
    }
    if (path.startsWith('/blog/')) {
      const authorLink = document.querySelector('#pageHeader h1 a[href^="/user/"], .blog_info a[href^="/user/"]');
      return { id: authorLink?.href.split('/').pop() || '用户', name: authorLink?.textContent.trim() || '用户' };
    }
    if (path.startsWith('/index/')) {
      const authorLink = document.querySelector('a.l.bve-processed[href^="/user/"]');
      return { id: authorLink?.href.split('/').pop() || '用户', name: authorLink?.textContent.trim() || '用户' };
    }
    return { id: '用户', name: '用户' };
  };

  const getSubjectInfo = () => {
    const subjectLink = document.querySelector('#subject_inner_info > a.avatar[href^="/subject/"]');
    return { id: subjectLink?.href.split('/')[4] || null, name: subjectLink?.title || subjectLink?.textContent.trim() || null };
  };

  const getBlogFormData = async (blogId) => {
    const response = await fetch(`https://${BASE_URL}/blog/${blogId}`);
    if (!response.ok) throw new Error('无法获取日志');
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const formhash = doc.querySelector('input[name="formhash"]')?.value;
    const lastview = doc.querySelector('input[name="lastview"]')?.value;
    if (!formhash || !lastview) throw new Error('找不到日志信息');
    return { formhash, lastview };
  };

  const submitComment = async (blogId, formData, content) => {
    const response = await fetch(`https://${BASE_URL}/blog/entry/${blogId}/new_reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ formhash: formData.formhash, lastview: formData.lastview, content, submit: '加上去' }),
    });
    return response.ok || response.status === 302;
  };

  const handleRecommend = async (recommendReason = '') => {
    try {
      if (!RECOMMEND_LOG_ID) return alert('推荐日志ID未配置');
      const isBlog = path.startsWith('/blog/'), isSubjectTopic = path.startsWith('/subject/topic/'), isIndex = path.startsWith('/index/'), postId = getPostIdFromUrl(), authorInfo = getAuthorInfo(), formData = await getBlogFormData(RECOMMEND_LOG_ID);
      let postUrl = location.href, postTitle, bbcode;

      if (isBlog) {
        postTitle = (document.querySelector('#pageHeader h1')?.innerHTML.split('<br>')[1] || document.title).trim();
        bbcode = `[url=https://${BASE_URL}/blog/${postId}]${postTitle}[/url]\n[日志]  ${authorInfo.name}([url=https://${BASE_URL}/user/${authorInfo.id}]${authorInfo.id}[/url])`;
      } else if (isSubjectTopic) {
        postTitle = document.querySelector('#header h1')?.textContent.trim() || document.title.replace(' - Bangumi', '');
        const subjectInfo = getSubjectInfo();
        bbcode = `[url=https://${BASE_URL}/subject/topic/${postId}]${postTitle}[/url]\n${subjectInfo.id ? `[[url=https://${BASE_URL}/subject/${subjectInfo.id}]${subjectInfo.name}[/url]]   ` : ''}${authorInfo.name}([url=https://${BASE_URL}/user/${authorInfo.id}]${authorInfo.id}[/url])`;
      } else if (isIndex) {
        postTitle = document.querySelector('#pageHeader h1')?.textContent.trim() || document.title.replace(' - Bangumi', '');
        bbcode = `[url=https://${BASE_URL}/index/${postId}]${postTitle}[/url]\n[目录]  ${authorInfo.name}([url=https://${BASE_URL}/user/${authorInfo.id}]${authorInfo.id}[/url])`;
      } else {
        postTitle = document.title.replace(' - Bangumi', '');
        const groupName = document.querySelector('#pageHeader h1 a')?.textContent.trim() || '未知小组';
        bbcode = `[url=https://${BASE_URL}/group/topic/${postId}]${postTitle}[/url]\n[${groupName}]  ${authorInfo.name}([url=https://${BASE_URL}/user/${authorInfo.id}]${authorInfo.id}[/url])`;
      }
      if (recommendReason.trim()) bbcode += `\n\n推荐理由：${recommendReason.trim()}`;

      if (!await submitComment(RECOMMEND_LOG_ID, formData, bbcode)) throw new Error('提交失败');
      alert('推荐成功！');
      document.getElementById('bangumi-recommend-reason-textarea').value = '';
    } catch (err) {
      alert('推荐失败: ' + (err.message || '未知错误'));
    }
  };

  const updateTextColor = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const textElement = document.querySelector('#bangumi-recommend-panel h2');
    if (textElement) {
      textElement.style.color = theme === 'dark' ? '#fff' : '#444';
    }
  };

  const addRecommendPanel = () => {
    const panelHTML = `
      <div id="bangumi-recommend-panel">
        <div class="SidePanel png_bg clearit">
          <h2>推荐到 <a href="https://${BASE_URL}/blog/${RECOMMEND_LOG_ID}" target="_blank">社区月刊协力楼</a></h2>
          <textarea id="bangumi-recommend-reason-textarea" placeholder="推荐原因（可选，写了更好）"></textarea>
          <button id="bangumi-recommend-submit-button">确认推荐</button>
        </div>
      </div>
    `;

    // v1.1.1:适配目录页
    if (path.startsWith('/index/')) {
      const columnElement = document.getElementById('columnSubjectBrowserB');
      if (columnElement) {

        const lastMenuInner = columnElement.querySelector('.menu_inner:last-child');
        if (lastMenuInner) {
          lastMenuInner.insertAdjacentHTML('afterend', panelHTML);
        } else {
          columnElement.insertAdjacentHTML('beforeend', panelHTML);
        }
      } else {
        console.warn('找不到目录页侧栏，推荐面板未添加');
        return;
      }
    }

    else {
      const ANCHOR_1 = '#columnB';
      const ANCHOR_2 = '#columnInSubjectB';
      const ANCHOR_3 = 'div.columns';

      if ($(ANCHOR_1).length) {
        $(ANCHOR_1).append(panelHTML);
      } else if ($(ANCHOR_2).length) {
        $(ANCHOR_2).append(panelHTML);
      } else if ($(ANCHOR_3).length) {
        $(ANCHOR_3).append(panelHTML);
      } else {
        console.warn('找不到合适的插入位置，推荐面板未添加');
        return;
      }
    }

    updateTextColor();

    const observer = new MutationObserver(updateTextColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    document.getElementById('bangumi-recommend-submit-button').addEventListener('click', () => {
      handleRecommend(document.getElementById('bangumi-recommend-reason-textarea').value);
    });
  };

  // v1.1.2:添加个性化面板设置
  const addCustomPanelTab = () => {
    if (typeof chiiLib === 'undefined' || typeof chiiLib.ukagaka === 'undefined' || typeof chiiLib.ukagaka.addPanelTab !== 'function') {
      return;
    }

    chiiLib.ukagaka.addPanelTab({
      tab: 'bangumi_monthly',
      label: '社区月刊',
      type: 'options',
      config: [
        {
          title: '首页卡片',
          name: 'homeCardEnabled',
          type: 'radio',
          defaultValue: 'true',
          getCurrentValue: function() {
            return homeCardEnabled.toString();
          },
          onChange: function(value) {
            const enabled = value === 'true';
            setSetting('homeCardEnabled', enabled);
            homeCardEnabled = enabled;

            // 立即生效
            const card = document.getElementById('bangumi_monthly');
            if (card) {
              card.style.display = enabled ? 'block' : 'none';
            } else if (enabled && window.location.pathname === '/') {
              // 如果卡片不存在但需要显示，重新注入
              injectCard();
            }
          },
          options: [
            { value: 'true', label: '开启' },
            { value: 'false', label: '关闭' }
          ]
        },
        {
          title: '推荐面板',
          name: 'recommendPanelEnabled',
          type: 'radio',
          defaultValue: 'true',
          getCurrentValue: function() {
            return recommendPanelEnabled.toString();
          },
          onChange: function(value) {
            const enabled = value === 'true';
            setSetting('recommendPanelEnabled', enabled);
            recommendPanelEnabled = enabled;

            // 立即生效
            const panel = document.getElementById('bangumi-recommend-panel');
            if (panel) {
              panel.style.display = enabled ? 'block' : 'none';
            } else if (enabled && shouldShowRecommendPanel()) {
              // 如果面板不存在但需要显示，重新注入
              addRecommendPanel();
            }
          },
          options: [
            { value: 'true', label: '开启' },
            { value: 'false', label: '关闭' }
          ]
        }
      ]
    });
  };

  injectStyles();
  injectCard();
  if (shouldShowRecommendPanel()) addRecommendPanel();
  addCustomPanelTab();

})();