// ==UserScript==
// @name         Download PDF
// @namespace    DownloadPDFButton
// @author       小集
// @license      MIT
// @version      3.07
// @description  在文章页面上添加下载 PDF 按钮
// @match        *://pubs.rsc.org/*
// @match        *://www.sciencedirect.com/*
// @match        *://pubs.acs.org/*
// @match        *://www.tandfonline.com/*
// @match        *://ieeexplore.ieee.org/*
// @match        *://www.worldscientific.com/*
// @match        *://*.onlinelibrary.wiley.com/*
// @match        *://journals.sagepub.com/*
// @match        *://arc.aiaa.org/*
// @match        *://dl.acm.org/*
// @match        *://ascelibrary.org/*
// @match        *://www.annualreviews.org/*
// @match        *://www.spiedigitallibrary.org/*
// @match        *://d.wanfangdata.com.cn/*
// @match        *://kns.cnki.net/*
// @match        *://iopscience.iop.org/*
// @match        *://www.science.org/*
// @match        *://www.scientific.net/*
// @match        *://www.cell.com/*
// @match        *://link.springer.com/*
// @match        *://www.nature.com/*
// @match        *://www.jstor.org/*
// @match        *://www.pnas.org/*
// @match        *://www.proquest.com/*
// @match        *://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d234336155700b8ca891472636a6d29e640e/*
// @match        *://www.ahajournals.org/*
// @match        *://www.degruyter.com/*
// @match        *://pubs.rsna.org/*
// @match        *://pubsonline.informs.org/*
// @match        *://cdnsciencepub.com/*
// @match        *://www.acpjournals.org/*
// @match        *://www.liebertpub.com/*
// @match        *://iopscience-iop-org-s.webvpn.zju.edu.cn:8001/*
// @match        *://digital-library.theiet.org/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/466267/Download%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/466267/Download%20PDF.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 域名替换
  const domainReplacements = {
    'pubs.rsc.org': 'pubs-rsc-org-s.webvpn.zju.edu.cn:8001',
    'pubs.acs.org': 'pubs-acs-org-s.webvpn.zju.edu.cn:8001',
    'journals.sagepub.com': 'sage-cnpereading-com.webvpn.zju.edu.cn:8001',
    'ieeexplore.ieee.org': 'ieeexplore-ieee-org-s.webvpn.zju.edu.cn:8001',
    'dl.acm.org': 'eproxy.lib.tsinghua.edu.cn/https/GGfu0kQ7pVN3LDUoHbJb3i3lffIOd7L',
    'ascelibrary.org': 'eproxy.lib.tsinghua.edu.cn/https/4vbdTx2QboGIeKvKlKVYzpEBQmeAsniJuOfKSb',
    'www.annualreviews.org': 'eproxy.lib.tsinghua.edu.cn/https/7myu6CcKGCfinziNA0yUIf0POLz2FyW5L2i4l0hvSrEe1x',
    'www.spiedigitallibrary.org': 'www.spiedigitallibrary.org',
    'd.wanfangdata.com.cn': 'eproxy.lib.tsinghua.edu.cn/https/NksWtG1yndwf0pZZZJBk0i94qNYldkFhyr9BzZw4iNE',
    'kns.cnki.net': 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421fbf952d2243e635930068cb8',
    'iopscience.iop.org': 'iopscience-iop-org-s.webvpn.zju.edu.cn:8001',
    'www.science.org': 'eproxy.lib.tsinghua.edu.cn/https/62eG3uvJA8HgOyvKAkATOGkMsgfGYVKzJTo7f8',
    'www.scientific.net': 'wvpn.ustc.edu.cn/https/77726476706e69737468656265737421e7e056d234336155701c80aa91566d3b50de',
    'www.cell.com': 'eproxy.lib.tsinghua.edu.cn/https/5Jy11EOv8yX7Jv5Km8JjbsvP1U4DQtLbzI',
    'www.nature.com': 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d229317c456c0dc7af9758',
    'www.jstor.org': 'www-jstor-org-s.webvpn.zju.edu.cn:8001',
    'arc.aiaa.org': 'eproxy.lib.tsinghua.edu.cn/https/4L9EpN4yvEfyakAFFWHtOGib5xR5dIo3JX',
    'www.pnas.org': 'eproxy.lib.tsinghua.edu.cn/https/5Jy11EWbH4LLHFFILXV81ksWznkqh8kwz3',
    'www.ahajournals.org': 'eproxy.lib.tsinghua.edu.cn/https/SKPXZZmy4yngCoWErOSCFF7EqozE5sQnBRJVhQI4MzP',
    'www.degruyter.com': 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d223356f426b119da98a1b203a88',
    'pubs.rsna.org': 'eproxy.lib.tsinghua.edu.cn/https/KgWXayWIEg6Bx08kgEDSulZ9QSDIrYWxD7b',
    'pubsonline.informs.org': 'eproxy.lib.tsinghua.edu.cn/https/UHGKRRtBpzoBSlJRAfsxutoqrDkQtqjyFR60yp1uvXUPYpM',
    'cdnsciencepub.com': 'eproxy.lib.tsinghua.edu.cn/https/1Ni4ZZ6YEE424WPnXp08mkFuxQp07gcMlVjtEGqor',
    'www.acpjournals.org': 'eproxy.lib.tsinghua.edu.cn/https/SKPXZZmuKICejid0cul4OC0LVcRrSxEKAfihGuzLxid',
    'www.worldscientific.com': 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d2303f7a5c7a1b8aa59d5b373c08eac124d89000',
    'www.liebertpub.com': 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d22b396d527b1a9dbc8d576d36fb19',
    'digital-library.theiet.org': 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421f4fe46953331641d72018bbe99473a7bb240e48f39f60a2516aa',
  };

  // 获取当前页面的URL
  const currentDomain = window.location.hostname;

  // 需要包含查询字符串的域名列表
  const domainsToInclude = ['kns.cnki.net', '*.onlinelibrary.wiley.com', 'dl.acm.org'];

  // 检查当前域名是否需要包含查询字符串
  const shouldIncludeDomain = domainsToInclude.includes(currentDomain);

  // 根据是否需要包含查询字符串来生成URL，排除查询字符串（？和#）
  const url = shouldIncludeDomain ? window.location.href : window.location.href.split(/[?#]/)[0];

  // 不同域名对应的处理函数，生成下载链接
  const domains = {
        'pubs.rsc.org': url => url.includes('articlehtml') || url.includes('articlelanding') ? url.replace(/(articlehtml|articlelanding)/, 'articlepdf') : null,
        'www.sciencedirect.com': url => url.includes('pdf') ? null :url.includes('article') ? url + '/pdfft?download=true&isDTMRedir=true' :null,
        'pubs.acs.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'ieeexplore.ieee.org': url => url.includes('document/') || url.includes('abstract/document/') ? url.replace(/\/(abstract\/)?document\//, '/stamp/stamp.jsp?tp=&arnumber=') : null,
        'www.tandfonline.com': url => url.includes('doi/') ? ((/(abs|full)/).test(url) ? url.replace(/(abs|full)/, 'pdf') : url.replace('doi', 'doi/pdf')) + '?download=true' : null,
        'www.worldscientific.com': url => url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/') ? url.replace(/\/doi\/(abs|full)?\/?/, '/doi/pdf/'): null,
        'onlinelibrary.wiley.com': url => url.includes('doi/pdf') ? null: (url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/')|| url.includes('doi/book') ? url.replace(/\/doi\/(book|abs|full)?\/?/, '/doi/pdfdirect/'): null),
        'journals.sagepub.com': url => url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/') ? url.replace(/\/doi\/(abs|full)?\/?/, '/paragraph/download/?doi=') : null,
        'arc.aiaa.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'dl.acm.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'ascelibrary.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.annualreviews.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'iopscience.iop.org': url => url.includes('meta') ? url.replace('/meta', '.pdf'):url + '.pdf',
        'iopscience-iop-org-s.webvpn.zju.edu.cn:8001': url => url.includes('meta') ? url.replace('/meta', '.pdf'):url + '.pdf',
        'www.science.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.spiedigitallibrary.org': url => url.includes('10.') ? url :null,
        'd.wanfangdata.com.cn': url => url,
        'www.scientific.net': url => url,
        'www.cell.com': url => url,
        'link.springer.com': url => url.includes('article') ? url: null,
        'www.nature.com': url => url.includes('articles') ? url + '.pdf': null,
        'www.jstor.org': url => url.includes('stable') ? url.replace('stable', 'stable/pdf')+ '.pdf' : null,
        'www.pnas.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d234336155700b8ca891472636a6d29e640e': url => url.includes('pdf') ? null :url.includes('article') ? url + '/pdfft?download=true&isDTMRedir=true' :null,
        'www.ahajournals.org': url => url.includes('doi/') ? url.replace('/doi/', '/doi/pdf/') : null,
        'www.degruyter.com': url => url.includes('html') ? url.replace('html', 'pdf') : null,
        'pubs.rsna.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'pubsonline.informs.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'cdnsciencepub.com': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.acpjournals.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.liebertpub.com': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'digital-library.theiet.org': url => url,
        'kns.cnki.net':url => url,
  };

   // 根据 URL 获取当前页面所在的域名
  const domain = Object.keys(domains).find((d) => url.includes(d));
  if (!domain) return;

  // 根据不同的域名生成下载链接
  let newUrl = domains[domain](url);
  if (!newUrl) return;

  // 对于需要替换的域名进行替换
  if (domainReplacements.hasOwnProperty(domain)) {
    newUrl = newUrl.replace(domain, domainReplacements[domain]);
  }

  // 检查替换后的域名是否包含"webvpn.zju.edu.cn"，如果是，则使用HTTP协议
  const isWebvpnDomain = newUrl.includes('webvpn.zju.edu.cn');
  if (isWebvpnDomain) {
    newUrl = newUrl.replace('https', 'http');
  }

  // 创建下载按钮
  const downloadBtn = document.createElement('a');
  downloadBtn.style = 'position: fixed; z-index: 999999999; top: 50%; right: 20px; transform: translateY(-50%); padding: 10px 15px; background-color: #007aff; color: #fff; border-radius: 5px; font-weight: bold; text-decoration: none;';
  downloadBtn.href = newUrl;
  downloadBtn.target = '_blank';
  downloadBtn.innerHTML = 'Download PDF';
  document.body.appendChild(downloadBtn);
})();