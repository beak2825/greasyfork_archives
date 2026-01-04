// ==UserScript==
// @name         Redirector login
// @namespace    Redirector login
// @author       小集
// @license      MIT
// @version      1.03
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
// @match        *://cdnsciencepub.com/*
// @match        *://www.acpjournals.org/*
// @match        *://www.liebertpub.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/466307/Redirector%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/466307/Redirector%20login.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 域名替换
  const domainReplacements = {
    'pubs.rsc.org': 'www.rsc.org/rsc-id/account/checkfederatedaccess?instituteurl=https://idp.tsinghua.edu.cn/idp/shibboleth&returnurl=https://pubs.rsc.org',
    'pubs.acs.org': 'pubs.acs.org/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=https://pubs.acs.org',
    'ieeexplore.ieee.org': 'ieeexplore.ieee.org/servlet/wayf.jsp?entityId=https://idp.ustc.edu.cn/idp/shibboleth&url=https://ieeexplore.ieee.org',
    'dl.acm.org': 'dl.acm.org/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=',
    'www.tandfonline.com': 'www.tandfonline.com/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=https://www.tandfonline.com',
    'www.sciencedirect.com': 'auth.elsevier.com/ShibAuth/institutionLogin?entityID=https://idp.tsinghua.edu.cn/idp/shibboleth&appReturnURL=https://www.sciencedirect.com/user/router/shib%3FtargetURL%3Dhttps://www.sciencedirect.com',
    'www.spiedigitallibrary.org': 'connect.openathens.net/spie.org/70cc7182-e28c-4862-b8c4-46853d2d0bd0/login?entity=https://idp.ustc.edu.cn/idp/shibboleth&target=https://www.spiedigitallibrary.org',
    'iopscience.iop.org': 'myiopscience.iop.org/signin?origin=deeplink&entity=https://idp.tsinghua.edu.cn/idp/shibboleth&target=https://iopscience.iop.org',
    'www.science.org': 'iam.atypon.com/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=http://www.science.org',
    'www.scientific.net': 'connect.openathens.net/scientific.net/9a54dd64-0769-4f59-a7ec-b249515c9de7/login?entity=https://idp.ustc.edu.cn/idp/shibboleth&target=https://www.scientific.net',
    'link.springer.com': 'fsso.springer.com/federation/init?entityId=https://idp.tsinghua.edu.cn/idp/shibboleth&returnUrl=https://link.springer.com',
    'www.nature.com': 'sp.nature.com/saml/login?idp=https://idp.tsinghua.edu.cn/idp/shibboleth&targetUrl=https://www.nature.com',
    'www.jstor.org': 'shibbolethsp.jstor.org/start?entityID=https://idp.tsinghua.edu.cn/idp/shibboleth&dest=https://www.jstor.org',
    'arc.aiaa.org': 'arc.aiaa.org/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=',
    'www.pnas.org': 'iam.atypon.com/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=http://www.pnas.org',
    'www.worldscientific.com': 'www.worldscientific.com/action/ssostart?idp=https://idp.tsinghua.edu.cn/idp/shibboleth&redirectUri=',
    'ascelibrary.org': 'ascelibrary.org/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=/&federationId=https://fed.openathens.net/oafed/metadata?=',
    'onlinelibrary.wiley.com': 'onlinelibrary.wiley.com/action/ssostart?idp=https://idp.tsinghua.edu.cn/openathens&redirectUri=https://onlinelibrary.wiley.com',
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
        'www.sciencedirect.com': url => url.includes('pdf') ? null :url.includes('article') ? url + '/pdfft?download=true&isDTMRedir=true' :null,
        'pubs.rsc.org': url => url.includes('articlehtml') || url.includes('articlelanding') ? url.replace(/(articlehtml|articlelanding)/, 'articlepdf') : null,
        'pubs.acs.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') + '&federationId=https://ed.openathens.net/oafed/metadata' : null,
        'ieeexplore.ieee.org': url => url.includes('document/') || url.includes('abstract/document/') ? url.replace(/\/(abstract\/)?document\//, '/stamp/stamp.jsp?tp=&arnumber=') : null,
        'www.tandfonline.com': url => url.includes('doi/') ? ((/(abs|full)/).test(url) ? url.replace(/(abs|full)/, 'pdf') : url.replace('doi', 'doi/pdf')) + '?download=true' : null,
        'www.worldscientific.com': url => url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/') ? url.replace(/\/doi\/(abs|full)?\/?/, '/doi/pdf/') +"&federationId=urn%3Amace%3Ashibboleth%3Acarsifed": null,
        'onlinelibrary.wiley.com': url => url.includes('doi/pdf') ? null: (url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/')|| url.includes('doi/book') ? url.replace(/\/doi\/(book|abs|full)?\/?/, '/doi/pdfdirect/'): null),
        'journals.sagepub.com': url => url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/') ? url.replace(/\/doi\/(abs|full)?\/?/, '/paragraph/download/?doi=') : null,
        'arc.aiaa.org': url => url.includes('doi/') ? url + '&federationId=https://fed.openathens.net/oafed/metadata' : null,
        'dl.acm.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, 'doi/pdf/') + '&federationId=https://fed.openathens.net/oafed/metadata' : null,
        'ascelibrary.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.annualreviews.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'iopscience.iop.org': url => url.includes('article') ? url.replace('/meta', '')+ '/pdf': null,
        'www.science.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') + '&mode=trans&targetSP=https://www.science.org&requesterId=https://www.science.org/shibboleth': null,
        'www.spiedigitallibrary.org': url => url.includes('10.') ? url :null,
        'd.wanfangdata.com.cn': url => url,
        'www.scientific.net': url => url,
        'link.springer.com': url => url,
        'www.nature.com': url => url.includes('articles') ? url: null,
        'www.jstor.org': url => url.includes('stable') ? (url.includes('pdf') ? null:url + '&site=jstor'): null,
        'www.pnas.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') + '&mode=trans&targetSP=https://www.pnas.org&requesterId=https://pnas.org/shibboleth': null,
        'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d234336155700b8ca891472636a6d29e640e': url => url.includes('pdf') ? null :url.includes('article') ? url + '/pdfft?download=true&isDTMRedir=true' :null,
        'www.ahajournals.org': url => url.includes('doi/') ? url.replace('/doi/', '/doi/pdf/') : null,
        'www.degruyter.com': url => url.includes('html') ? url.replace('html', 'pdf') : null,
        'pubs.rsna.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'cdnsciencepub.com': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.acpjournals.org': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'www.liebertpub.com': url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/pdf') ? url.replace(/\/doi\/(abs|full|pdf)?\/?/, '/doi/pdf/') : null,
        'onlinelibrary.wiley.com': url => url.includes('doi/pdf') ? null: (url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/')|| url.includes('doi/book') ? url.replace(/\/doi\/(book|abs|full)?\/?/, '/doi/pdfdirect/'): null),
  };

  // 根据 URL 获取当前页面所在的域名
  const domain = Object.keys(domains).find(d => url.includes(d));
  if (!domain) return;

  // 根据不同的域名生成下载链接
  let newUrl = domains[domain](url);
  if (!newUrl) return;

  // 对于需要替换的域名进行替换
  if (domainReplacements.hasOwnProperty(domain)) {
    newUrl = newUrl.replace(domain, domainReplacements[domain]);
  }

// 创建下载按钮
const downloadBtn = document.createElement('a');
downloadBtn.style = 'position: fixed; z-index: 999999999; top: 50%; left: 20px; transform: translateY(-50%); padding: 10px 15px; background-color: #007aff; color: #fff; border-radius: 5px; font-weight: bold; text-decoration: none;';
downloadBtn.href = newUrl;
downloadBtn.target = '_blank';
downloadBtn.innerHTML = 'Redirector login';
document.body.appendChild(downloadBtn);
})();