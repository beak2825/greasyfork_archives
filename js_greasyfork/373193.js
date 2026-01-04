// ==UserScript==
// @name        104.com.tw Helper
// @namespace   https://github.com/gslin/104-helper-userscript
// @description Add useful links to 104 job pages.
// @include     https://www.104.com.tw/*
// @version     0.20241205.6
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @require     https://update.greasyfork.org/scripts/395037/764968/MonkeyConfig%20Modern.js
// @connect     findbiz.nat.gov.tw
// @downloadURL https://update.greasyfork.org/scripts/373193/104comtw%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373193/104comtw%20Helper.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const cfg = new MonkeyConfig({
    menuCommand: true,
    params: {
      search_template: {
        type: 'text',
        default: 'https://www.google.com/search?q=',
      },
    },
    title: '104.com.tw Helper - Configure',
  });

  const search_template = cfg.get('search_template');
  const search_domain = search_template.match(/^https:\/\/(.*?)\//)[1];

  const append_links = async (node, company_name) => {
    const company_name_chinese = get_company_name_chinese(company_name);
    const company_name_chinese_encoded = encodeURIComponent(company_name_chinese);

    const company_name_chinese_rtrim = get_company_name_chinese_rtrim(company_name);
    const company_name_chinese_rtrim_encoded = encodeURIComponent(company_name_chinese_rtrim);

    const company_name_shorted = get_company_name_short(company_name);
    const company_name_shorted_encoded = encodeURIComponent(company_name_shorted);

    const btn = document.createElement('button');
    btn.setAttribute('accesskey', 'c');
    btn.setAttribute('class', 'btn_open_helper_links');
    btn.setAttribute('style', 'display: block;');
    btn.innerHTML = '打開以下連結 (tabs)';

    // Special workaround for 求職小幫手
    btn.setAttribute('onclick', 'open_helper_outbound_links();');

    node.appendChild(btn);

    const res = await new Promise(resolve => {
      const data = 'qryCond=' + company_name_chinese_rtrim_encoded + '&infoType=D&qryType=cmpyType&cmpyType=true&brCmpyType=&busmType=&factType=&lmtdType=&isAlive=all&busiItemMain=&busiItemSub=&sugCont=&sugEmail=&g-recaptcha-response=';
      const url = 'https://findbiz.nat.gov.tw/fts/query/QueryList/queryList.do';

      const req = GM_xmlhttpRequest({
        anonymous: true,
        data: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': url,
        },
        method: 'POST',
        onerror: res => {
          resolve(res);
        },
        onload: res => {
          resolve(res);
        },
        url: url,
      });
    });

    if (200 !== res.status) {
      const err_txt = document.createElement('p');
      err_txt.innerHTML = 'Get error (findbiz.nat.gov.tw): "' + res.statusText + '".';
      node.appendChild(err_txt);
    } else {
      const findbiz_body = document.implementation.createHTMLDocument('');
      findbiz_body.documentElement.innerHTML = res.responseText;

      const el = document.createElement('div');
      el.setAttribute('style', 'background: #ddd; margin: 9px 0;');
      el.innerHTML = '<h2 style="display: inline-block; margin: 9px;"><a href="https://findbiz.nat.gov.tw/fts/query/QueryBar/queryInit.do">商工登記公示資料查詢服務</a>資料：</h2>';
      el.appendChild(document.createTextNode(`(搜尋：${company_name_chinese_rtrim})`));
      for (const item of findbiz_body.querySelectorAll('.panel.panel-default')) {
        let matches = [];
        while (matches = item.textContent.match(/\b(\d{7})\b/)) {
          const company_date_raw = (parseInt(matches[1], 10) + 19110000).toString();
          const company_date = company_date_raw.substring(0, 4) + '/' + company_date_raw.substring(4, 6) + '/' + company_date_raw.substring(6);
          item.innerHTML = item.innerHTML.replace(matches[1], company_date);
        }

        for (const a of item.querySelectorAll('a')) {
          const href = a.getAttribute('href');
          if (href.startsWith('/fts')) {
            a.setAttribute('href', 'https://findbiz.nat.gov.tw' + href);
          }
        }
        el.appendChild(item);
      }
      node.appendChild(el);
    }

    /* links */
    const search_blacklist = [
      '104.com.tw',
      '1111.com.tw',
      '518.com.tw',
      'cakeresume.com',
      'indeed.com',
      'interview.tw',
      'recruit.net',
      'salary.tw',
      'wajob.cc',
      'www.ptt.cc',
      'yes123.com.tw',
      'yourator.co',
    ];
    let search_link = search_template + '"' + company_name_shorted_encoded + '"+' + company_name_chinese_encoded + '+~面試';
    for (const site of search_blacklist) {
      search_link += '+-site:' + site;
    }
    const search_el = gen_el(search_link, `去搜尋引擎看看 (${search_domain})`);
    node.appendChild(search_el);

    const mol_link = 'https://announcement.mol.gov.tw/?UNITNAME=' + company_name_chinese_encoded;
    const mol_el = gen_el(mol_link, '去勞動部看看 (announcement.mol.gov.tw)');
    node.appendChild(mol_el);

    const linkedin_link = 'https://www.linkedin.com/search/results/all/?keywords=' + company_name_shorted_encoded;
    const linkedin_el = gen_el(linkedin_link, '去 LinkedIn 看看 (www.linkedin.com)');
    node.appendChild(linkedin_el);

    const linkedin_search_link = search_template + 'site:linkedin.com+' + company_name_shorted_encoded;
    const linkedin_search_el = gen_el(linkedin_search_link, `去 LinkedIn 看看 (${search_domain})`);
    node.appendChild(linkedin_search_el);

    const ptt_link = search_template + '"' + company_name_shorted_encoded + '"+' + company_name_chinese_encoded + '+~面試+site:www.ptt.cc';
    const ptt_el = gen_el(ptt_link, `去 Ptt 看看 (${search_domain})`);
    node.appendChild(ptt_el);

    const qollie_link = 'https://www.qollie.com/search?keyword=' + company_name_chinese_rtrim_encoded + '&kind=company';
    const qollie_el = gen_el(qollie_link, '去 Qollie 看看 (qollie.com)');
    node.appendChild(qollie_el);
  };

  const get_company_name_chinese = name => {
    name = name.trim()
      .replace(/\(.*\)/, '')
      .trim()
      .replace(/[\/_]+/g, ' ')
      .trim()
      .replace(/[^ ]*[0-9.A-Z_a-z]+[^ ]*/g, ' ')
      .trim()
      .replace(/.* /g, '');
    return name.trim();
  };

  const get_company_name_chinese_rtrim = name => {
    name = get_company_name_chinese(name);
    name = name.trim()
      .replace(/(台|臺)灣(子|分)公司$/, '')
      .replace(/(台|臺)灣辦事處$/, '')
      .replace(/在(台|臺)辦事處$/, '')
      .replace(/公司.*(子|分)公司$/, '公司')
      .replace(/(子|分)公司$/, '');
    return name;
  };

  const get_company_name_short = name => {
    name = get_company_name_chinese(name);
    name = name.trim()
      .replace(/^財團法人/, '')
      .replace(/^(法|英)屬/, '')
      .replace(/^(馬紹爾群島|維京群島|開曼群島|澳大利亞|馬來西亞|薩摩亞|塞席爾|賽席爾|新加坡|香港|瑞士|汶萊|印度|英|美|港|日)商/, '')
      .replace(/(台|臺)灣(子|分)公司$/, '')
      .replace(/(台|臺)灣辦事處$/, '')
      .replace(/在(台|臺)辦事處$/, '')
      .replace(/公司.*(子|分)公司$/, '公司')
      .replace(/(子|分)公司$/, '')
      .replace(/股份有限公司$/, '')
      .replace(/有限公司$/, '')
      .replace(/公司$/, '');
    return name.trim();
  };

  const gen_el = (url, text) => {
    const el = document.createElement('a');
    el.setAttribute('class', 'helper_outbound_link');
    el.setAttribute('href', url);
    el.innerHTML = text;
    return el;
  };

  const initial_css = () => {
    const el = document.createElement('style');
    el.innerHTML = '.helper_outbound_link { clear: both; float: left; }';
    document.querySelector('head').appendChild(el);
  };

  const verify_hh = (node, company_name) => {
    const hh_list = [
      'Arbour Services Limited.',
      'echoas  Taiwan_愛司人才管理顧問股份有限公司',
      'Morgan Philips Hong Kong Limited Taiwan Branch_香港商博禹國際顧問有限公司台灣分公司',
      'ROBERT WALTERS_華德士股份有限公司',
      '保聖那管理顧問股份有限公司',
      '全球人事顧問股份有限公司',
      '全鼎管理顧問有限公司',
      '創為人力資源有限公司',
      '台灣米高蒲志國際股份有限公司',
      '台灣英創管理顧問股份有限公司',
      '台灣英特艾倫人力資源有限公司',
      '嘉迅人才管理咨詢有限公司',
      '寶華人力資源顧問股份有限公司',
      '巖愷管理顧問有限公司',
      '康彼斯顧問股份有限公司',
      '德倫思管理顧問有限公司',
      '怡東人事顧問股份有限公司',
      '新加坡商立可人事顧問有限公司台灣分公司',
      '新加坡商立福人事顧問有限公司台灣分公司',
      '新加坡商艾得克有限公司台灣分公司',
      '益晟人力資源有限公司',
      '立展企管顧問有限公司',
      '立樂高園股份有限公司',
      '立樂高園股份有限公司',
      '精英人力資源股份有限公司',
      '經緯智庫股份有限公司 (MGR Consulting Co., Ltd.)',
      '聚賢亞洲有限公司',
      '華卡企業股份有限公司',
      '萬寶華企業管理顧問股份有限公司',
      '萬豐人力資源管理顧問有限公司',
      '萬通國際人力開發股份有限公司',
      '藝珂人事顧問股份有限公司',
      '賜禾有限公司',
      '逸亞管理顧問股份有限公司',
      '遠誠人力資源顧問股份有限公司',
      '銳光管理顧問有限公司',
      '首席國際獵才有限公司',
      '香港商唐尼爾森人力資源有限公司台灣分公司',
      '鴻鈺人力資源管理顧問有限公司',
    ];

    if (hh_list.indexOf(company_name) >= 0) {
      const el = document.createElement('div');
      el.setAttribute('style', 'color: darkred; font-size: 2em; line-height: 2em;');
      el.innerHTML = '(Company in HeadHunter List)';
      node.appendChild(el);
    }
  };

  // Special workaround for 求職小幫手
  unsafeWindow.open_helper_outbound_links = () => {
    const links = Array.from(document.getElementsByClassName('helper_outbound_link')).reverse();
    for (let el of links) {
      GM_openInTab(el.getAttribute('href'), {active: false});
    };
  };

  const pathname = document.location.pathname;

  // Company page
  if (pathname.startsWith('/company/')) {
    const ob = new MutationObserver(() => {
      const company_el = document.querySelector('h1');
      if (!company_el) {
        return;
      }
      const company_name = company_el.textContent.trim();
      if ('' === company_name) {
        return;
      }
      console.debug('company_name = ' + company_name);

      const anchor_el = document.querySelectorAll('.col.main')[1];
      if (!anchor_el) {
        return;
      }

      initial_css();

      const base_node = document.createElement('div');
      base_node.setAttribute('style', 'clear: both; display: table; padding: 0 1em 1em; width: 100%;');

      anchor_el.insertAdjacentElement('beforebegin', base_node);

      verify_hh(base_node, company_name);
      append_links(base_node, company_name);

      ob.disconnect();
    });
    ob.observe(document, {childList: true, subtree: true});

    return;
  }

  // Job page
  if (pathname.startsWith('/job/')) {
    initial_css();

    const ob = new MutationObserver(() => {
      const company_el = document.querySelector('a[data-gtm-head="公司名稱"]');
      if (!company_el) {
        return;
      }
      const company_name = company_el.textContent.trim();
      if ('' === company_name) {
        return;
      }
      console.debug('company_name = ' + company_name);

      const base_node = document.createElement('div');
      base_node.setAttribute('style', 'clear: both; display: table; width: 100%;');

      const anchor_el = document.querySelector('.job-header__cont');
      anchor_el.insertAdjacentElement('afterend', base_node);

      verify_hh(base_node, company_name);

      let addr = document.querySelector('i[data-gtm-content="地圖連結"]');
      if (addr) {
        addr = addr.parentNode;
        const location_el = document.createElement('p');
        location_el.setAttribute('style', 'clear: both;');
        location_el.textContent = addr.childNodes[0].textContent;
        base_node.appendChild(location_el);
      }

      append_links(base_node, company_name);

      ob.disconnect();
    });
    ob.observe(document, {childList: true, subtree: true});

    return;
  }
})();
