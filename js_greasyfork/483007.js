// ==UserScript==
// @name         Download PDF & Redirector Login
// @namespace    小集专用
// @license      MIT
// @version      2.6.4
// @author       wxxj
// @description  在文章页面上添加下载 PDF 按钮和 Redirector 登录按钮
// @match        *://pubs.rsc.org/*
// @match        *://www.sciencedirect.com/*
// @match        *://pubs.acs.org/*
// @match        *://www.tandfonline.com/*
// @match        *://*.ieee.org/*
// @match        *://www.worldscientific.com/*
// @match        *://*.onlinelibrary.wiley.com/*
// @match        *://journals.sagepub.com/*
// @match        *://arc.aiaa.org/*
// @match        *://dl.acm.org/*
// @match        *://ascelibrary.org/*
// @match        *://www.annualreviews.org/*
// @match        *://www.spiedigitallibrary.org/*
// @match        *://*.wanfangdata.com.cn/*
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
// @match        *://www.ahajournals.org/*
// @match        *://www.degruyter.com/*
// @match        *://pubs.rsna.org/*
// @match        *://pubsonline.informs.org/*
// @match        *://cdnsciencepub.com/*
// @match        *://www.acpjournals.org/*
// @match        *://www.liebertpub.com/*
// @match        *://iopscience.iop.org/*
// @match        *://digital-library.theiet.org/*
// @match        *://qikan.cqvip.com/*
// @match        *://www.nejm.org/*
// @match        *://academic.oup.com/*
// @match        *://*.yiigle.com/*
// @match        *://www.dl.begellhouse.com/*
// @match        *://*.asme.org/*
// @match        *://*.jove.com/*
// @match        *://karger.com/*
// @match        *://www.pqdtcn.com/*
// @match        *://www.zhangqiaokeyan.com/*
// @match        *://epubs.siam.org/*
// @match        *://www.thelancet.com/*
// @match        *://www.cell.com/*
// @match        *://www.thieme-connect.com/*
// @match        *://www.thieme-connect.de/*
// @match        *://www.annalsofoncology.org/*
// @match        *://www.futuremedicine.com/*
// @match        *://journals.asm.org/*
// @match        *://pubs.aip.org/*
// @match        *://heinonline.org/*
// @match        *://content.iospress.com/*
// @match        *://*.embopress.org/*
// @match        *://*.jstor.org/*
// @match        *://journals.aps.org/*
// @match        *://journals.physiology.org/*
// @icon        https://files.wxxjsci.cn/7433345?auth_key=105420821179-936201-014d29ab19bb7a092de284a9cd147d1c
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483007/Download%20PDF%20%20Redirector%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/483007/Download%20PDF%20%20Redirector%20Login.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 获取当前页面 URL
  const currentUrl = window.location.href;
  // 获取当前页面域名
  const currentDomain = window.location.hostname;

  // 域名替换映射表
  const domainReplacements = {
   'journals.physiology.org': {
      download: 'journals-physiology-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: '',
    },
   'journals.aps.org': {
      download: 'journals-aps-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'journals-aps-org-s.webvpn.zju.edu.cn:8001',
    },
   'www.embopress.org': {
      download: 'www-embopress-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'www-embopress-org-s.webvpn.zju.edu.cn:8001',
    },
   'content.iospress.com': {
      download: 'content-iospress-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'content-iospress-com-s.webvpn.zju.edu.cn:8001',
    },
   'heinonline.org': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/1HHvwajJhYWMHp2JzCeoHYlSOlE0PXeuhXv8x',
      redirectorLogin: '',
    },
   'journals.asm.org': {
      download: 'journals-asm-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: '',
    },
   'www.futuremedicine.com': {
      download: 'www-futuremedicine-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: '',
    },

   'www.thieme-connect.com': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d233386155730dc4af975b2d307af0cb2cf9',
      redirectorLogin: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d233386155730dc4af975b2d307af0cb2cf9',
    },
   'www.thieme-connect.de': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d233386155730dc4af975b2d307af0cb2cf9',
      redirectorLogin: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d233386155730dc4af975b2d307af0cb2cf9',
    },
   'www.cell.com': {
      download: 'www.sciencedirect.com',
      redirectorLogin: '',
    },
   'www.thelancet.com': {
      download: 'www.sciencedirect.com',
      redirectorLogin: '',
    },
   'epubs.siam.org': {
      download: 'epubs-siam-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'epubs.siam.org/action/ssostart?idp=https%3A%2F%2Fidp.zju.edu.cn%2Fidp%2Fshibboleth&redirectUri=',
    },
   'www.zhangqiaokeyan.com': {
      download: '',
      redirectorLogin: 'spoauth2.carsi.edu.cn/Shibboleth.sso/Login?entityID=https://idp.zju.edu.cn/idp/shibboleth&target=https://spoauth2.carsi.edu.cn/api/authorize%3Fresponse_type%3Dcode%26client_id%3Dpqdt%26state%3D1234',
    },
   'www.pqdtcn.com': {
      download: 'www-pqdtcn-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'spoauth2.carsi.edu.cn/Shibboleth.sso/Login?entityID=https://idp.zju.edu.cn/idp/shibboleth&target=https://spoauth2.carsi.edu.cn/api/authorize%3Fresponse_type%3Dcode%26client_id%3Dpqdt%26state%3D1234',
    },
   'karger.com': {
      download: 'karger-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: '',
    },
   'app.jove.com': {
      download: 'www.jove.com',
      redirectorLogin: 'www.jove.com/Shibboleth.sso/Login?entityID=https://idp.zju.edu.cn/idp/shibboleth&target=https%3A%2F%2Fwww.jove.com%2Fshibboleth%2Fwayf_login.php%3Freturn_page=http://www.jove.com',
    },
   'www.jove.com': {
      download: 'www.jove.com',
      redirectorLogin: 'www.jove.com/Shibboleth.sso/Login?entityID=https://idp.zju.edu.cn/idp/shibboleth&target=https%3A%2F%2Fwww.jove.com%2Fshibboleth%2Fwayf_login.php%3Freturn_page=http://www.jove.com',
    },
   'asmedigitalcollection.asme.org': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421f1e44c9923396f596a0985af97592f30e4bcbff6d40473825cb44cb8eceb',
      redirectorLogin: '',
    },
   'www.dl.begellhouse.com': {
      download: 'www-dl-begellhouse-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'www.dl.begellhouse.com/shibboleth2/?entityID=https://idp.zju.edu.cn/idp/shibboleth&dest=https://www.dl.begellhouse.com',
    },
   'rs.yiigle.com': {
      download: 'rs-yiigle-com-443.webvpn.bjmu.edu.cn',
      redirectorLogin: 'rs.yiigle.com',
    },
   'www.yiigle.com': {
      download: 'www-yiigle-com-443.webvpn.bjmu.edu.cn',
      redirectorLogin: 'www.yiigle.com',
    },
   'academic.oup.com': {
      download: 'academic-oup-com-s.webvpn.bjmu.edu.cn',
      redirectorLogin: 'academic.oup.com',
    },
   'www.nejm.org': {
      download: 'www-nejm-org-443.webvpn.bjmu.edu.cn',
      redirectorLogin: '',
    },

   'qikan.cqvip.com': {
      download: 'lib-cqvip-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'qikan.cqvip.com',
    },
    'pubs.rsc.org': {
      download: 'pubs-rsc-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'www.rsc.org/rsc-id/account/checkfederatedaccess?instituteurl=https://idp.zju.edu.cn/idp/shibboleth&returnurl=https://pubs.rsc.org',
    },
    'www.sciencedirect.com': {
      download: 'www.sciencedirect.com',
      redirectorLogin: 'auth.elsevier.com/ShibAuth/institutionLogin?entityID=https://idp.zju.edu.cn/idp/shibboleth&appReturnURL=https://www.sciencedirect.com/user/router/shib%3FtargetURL%3Dhttps://www.sciencedirect.com',
    },
    'www.spiedigitallibrary.org': {
      download: 'connect.openathens.net/spie.org/70cc7182-e28c-4862-b8c4-46853d2d0bd0/login?entity=https://idp.zju.edu.cn/openathens&target=https://www.spiedigitallibrary.org',
      redirectorLogin: 'connect.openathens.net/spie.org/70cc7182-e28c-4862-b8c4-46853d2d0bd0/login?entity=https://idp.ustc.edu.cn/idp/shibboleth&target=https://www.spiedigitallibrary.org',
    },
    'pubs.acs.org': {
      download: 'pubs-acs-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'pubs.acs.org/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://pubs.acs.org',
    },
    'www.tandfonline.com': {
      download: 'www.tandfonline.com',
      redirectorLogin: 'www.tandfonline.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://www.tandfonline.com',
    },
    'ieeexplore.ieee.org': {
      download: 'ieeexplore-ieee-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'ieeexplore.ieee.org/servlet/wayf.jsp?entityId=https://idp.zju.edu.cn/idp/shibboleth&url=https%3A%2F%2Fieeexplore.ieee.org',
    },
    'www.worldscientific.com': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d2303f7a5c7a1b8aa59d5b373c08eac124d89000',
      redirectorLogin: 'www.worldscientific.com/action/ssostart?idp=https://idp.zju.edu.cn/idp/shibboleth&redirectUri=',
    },
    'onlinelibrary.wiley.com': {
      download: 'onlinelibrary.wiley.com',
      redirectorLogin: 'onlinelibrary.wiley.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://onlinelibrary.wiley.com',
    },
    'ifst.onlinelibrary.wiley.com': {
      download: 'ifst.onlinelibrary.wiley.com',
      redirectorLogin: 'ifst.onlinelibrary.wiley.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://onlinelibrary.wiley.com',
    },
    'agupubs.onlinelibrary.wiley.com': {
      download: 'ifst.onlinelibrary.wiley.com',
      redirectorLogin: 'agupubs.onlinelibrary.wiley.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://onlinelibrary.wiley.com',
    },
    'obgyn.onlinelibrary.wiley.com': {
      download: 'obgyn.onlinelibrary.wiley.com',
      redirectorLogin: 'obgyn.onlinelibrary.wiley.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://onlinelibrary.wiley.com',
    },
    'chemistry-europe.onlinelibrary.wiley.com': {
      download: 'chemistry-europe.onlinelibrary.wiley.com',
      redirectorLogin: 'chemistry-europe.onlinelibrary.wiley.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://onlinelibrary.wiley.com',
    },
    'journals.sagepub.com': {
      download: 'sage-cnpereading-com.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'go.openathens.net/redirector/broward.edu?url=https://journals.sagepub.com',
    },
    'arc.aiaa.org': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/4L9EpN4yvEfyakAFFWHtOGib5xR5dIo3JX',
      redirectorLogin: 'arc.aiaa.org/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=',
    },
    'dl.acm.org': {
      download: 'dl-acm-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'dl.acm.org/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://dl.acm.org',
    },
    'ascelibrary.org': {
      download: 'ascelibrary.org',
      redirectorLogin: 'ascelibrary.org/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://ascelibrary.org',
    },
    'www.annualreviews.org': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/7myu6CcKGCfinziNA0yUIf0POLz2FyW5L2i4l0hvSrEe1x',
      redirectorLogin: 'www.annualreviews.org/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=https://www.annualreviews.org',
    },
    'wanfangdata.com.cn': {
      download: 'wzxepffrarqxfuzvewavkhtirdhvfzxepffrge-s.p.lib.tju.edu.cn',
      redirectorLogin: 'shibboleth.wanfangdata.com.cn/Shibboleth.sso/Login?entityID=https%3A%2F%2Fidp.zju.edu.cn%2Fidp%2Fshibboleth&target=https%3A%2F%2Fshibboleth.wanfangdata.com.cn%2F',
    },
    'kns.cnki.net': {
      download: 'www-cnki-net-443.webvpn.bjmu.edu.cn',
      redirectorLogin: 'https://fsso.cnki.net/Shibboleth.sso/Login?entityID=https://idp.zju.edu.cn/idp/shibboleth&target=https://fsso.cnki.net/secure/default.aspx',
    },
    'iopscience.iop.org': {
      download: 'iopscience-iop-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'myiopscience.iop.org/signin?origin=deeplink&entity=https://idp.zju.edu.cn/idp/shibboleth&target=https://iopscience.iop.org',
    },
    'www.science.org': {
      download: 'www-science-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'iam.atypon.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=http://www.science.org',
    },
    'www.scientific.net': {
      download: '',
      redirectorLogin: '',
    },
    'link.springer.com': {
      download: 'link-springer-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'fsso.springer.com/federation/init?entityId=https://idp.zju.edu.cn/idp/shibboleth&returnUrl=https://link.springer.com',
    },
    'www.nature.com': {
      download: 'www-nature-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'sp.nature.com/saml/login?idp=https://idp.zju.edu.cn/idp/shibboleth&targetUrl=https://www.nature.com',
    },
    'www.jstor.org': {
      download: 'www-jstor-org-s.webvpn.bjmu.edu.cn',
      redirectorLogin: 'shibbolethsp.jstor.org/start?entityID=https://idp.zju.edu.cn/idp/shibboleth&dest=https://www.jstor.org',
    },
    'www.pnas.org': {
      download: 'www-pnas-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'iam.atypon.com/action/ssostart?idp=https://idp.zju.edu.cn/openathens&redirectUri=http://www.pnas.org',
    },
    'www.proquest.com': {
      download: 'www-proquest-com-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: 'tlink.lib.tsinghua.edu.cn/go?url=https://search.proquest.com',
    },
    'www.ahajournals.org': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/SKPXZZmy4yngCoWErOSCFF7EqozE5sQnBRJVhQI4MzP',
      redirectorLogin: '',
    },
    'www.degruyter.com': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d223356f426b119da98a1b203a88',
      redirectorLogin: 'www.degruyter.com/applib/openathens?entityID=https://idp.zju.edu.cn/idp/shibboleth&dest=https://www.degruyter.com',
    },
    'pubs.rsna.org': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/KgWXayWIEg6Bx08kgEDSulZ9QSDIrYWxD7b',
      redirectorLogin: '',
    },
    'pubsonline.informs.org': {
      download: 'pubsonline-informs-org-s.webvpn.zju.edu.cn:8001',
      redirectorLogin: '',
    },
    'cdnsciencepub.com': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/1Ni4ZZ6YEE424WPnXp08mkFuxQp07gcMlVjtEGqor',
      redirectorLogin: '',
    },
    'www.acpjournals.org': {
      download: 'eproxy.lib.tsinghua.edu.cn/https/SKPXZZmuKICejid0cul4OC0LVcRrSxEKAfihGuzLxid',
      redirectorLogin: '',
    },
    'www.liebertpub.com': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d22b396d527b1a9dbc8d576d36fb19',
      redirectorLogin: '',
    },
    'digital-library.theiet.org': {
      download: 'webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421f4fe46953331641d72018bbe99473a7bb240e48f39f60a2516aa',
      redirectorLogin: '',
    },
    // 添加其他需要替换的域名映射关系
  };

  // 不同域名对应的处理函数，生成下载链接和重定向登录链接
 const domains = {
    'journals.physiology.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub')? url: null,
    },
    'journals.aps.org': {
      download: url => url.includes('abstract') ? url.replace('abstract', 'pdf') : null,
      redirectorLogin: url => url.includes('abstract') ? url:null,
    },
    'content.iospress.com': {
      download: url => url.includes('articles') ? url: null,
      redirectorLogin: url => url.includes('abstract') ? url:null,
    },
    'heinonline.org': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'journals.asm.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') +'&federationId=https%3A%2F%2Ffed.openathens.net%2Foafed%2Fmetadata&mode=trans&targetSP=https%3A%2F%2Fjournals.asm.org&requesterId=https%3A%2F%2Fjournals.asm.org%2Fshibboleth': null,
    },
    'www.futuremedicine.com': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => null,
    },
    'www.annalsofoncology.org': {
      download: url => url.includes('article') || url.includes('journals/lancet') ? url.replace('article', 'science/article/pii').replace('/fulltext', '').replace('journals/lancet', '').replace('PII', '') : null,
      redirectorLogin: url => null,
    },
    'www.thieme-connect.de': {
      download: url => url.includes('abstract')? url.replace('abstract', 'pdf')+'.pdf' : null,
      redirectorLogin: url => url,
    },
    'www.thieme-connect.com': {
      download: url => url.includes('abstract')? url.replace('abstract', 'pdf')+'.pdf' : null,
      redirectorLogin: url => url,
    },
    'www.cell.com': {
      download: url => url.includes('fulltext') ? url.replace('cell/fulltext', 'science/article/pii').replace('cell-chemical-biology/fulltext', 'science/article/pii').replace('cancer-cell/fulltext', 'science/article/pii') : null,
      redirectorLogin: url => null,
    },
    'karger.com': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'www.thelancet.com': {
      download: url => url.includes('article') || url.includes('journals') ? url.replace('article', 'science/article/pii').replace('/fulltext', '').replace('journals', '').replace('/lancet', '').replace('/landia', '').replace('PII', '') : null,
      redirectorLogin: url => null,
    },
    'epubs.siam.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') + "&federationId=urn%3Amace%3Ashibboleth%3Acarsifed" : null,
    },
    'www.zhangqiaokeyan.com': {
      download: url => null,
      redirectorLogin: url => url.includes('academic-degree-foreign_mphd_thesis') ? url : null,
    },
    'www.pqdtcn.com': {
      download: url => url.includes('thesis')? null : url,
      redirectorLogin: url => url.includes('thesis')? null : url,
    },
    'app.jove.com': {
      download: url => null,
      redirectorLogin: url => url,
    },
    'www.jove.com': {
      download: url => null,
      redirectorLogin: url => url,
    },
    'asmedigitalcollection.asme.org': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'www.dl.begellhouse.com': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'www.yiigle.com': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'rs.yiigle.com': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'academic.oup.com': {
      download: url => url,
      redirectorLogin: url => null,
    },
    'www.nejm.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') + "&federationId=https://fed.openathens.net://oafed/metadata" : null,
    },

    'qikan.cqvip.com': {
      download: url => url,
      redirectorLogin: url => null,
    },
     'pubs.rsc.org': {
      download: url => url.includes('articlehtml') || url.includes('articlelanding') ? url.replace(/(articlehtml|articlelanding)/, 'articlepdf') : null,
      redirectorLogin: url => url.includes('articlehtml') || url.includes('articlelanding') ? url.replace(/(articlehtml|articlelanding)/, 'articlepdf') : null,
    },
    'www.sciencedirect.com': {
      download: url => url.includes('pdf') ? null :url.includes('article') ? url + '/pdfft?download=true&isDTMRedir=true' :null,
      redirectorLogin: url => url,
    },
    'www.spiedigitallibrary.org': {
      download: url => null,
      redirectorLogin: url => url.includes('10.') ? url :null,
    },
    'pubs.acs.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
    },
    'www.tandfonline.com': {
      download: url => url.includes('doi/') ? ((/(abs|full)/).test(url) ? url.replace(/(abs|full)/, 'pdf') : url.replace('doi', 'doi/pdf')) + '?download=true' : null,
      redirectorLogin: url => url.includes('doi/') ? ((/(abs|full)/).test(url) ? url.replace(/(abs|full)/, 'pdf') : url.replace('doi', 'doi/pdf')) + '?download=true' : null,
    },
    'ieeexplore.ieee.org': {
      download: url => url.includes('document/') || url.includes('abstract/document/') ? url.replace(/\/(abstract\/)?document\//, '/stamp/stamp.jsp?tp=&arnumber=') : null,
      redirectorLogin: url => url.includes('document/') || url.includes('abstract/document/') ? url: null,
    },
    'www.worldscientific.com': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/') ? url.replace(/\/doi\/(abs|full)?\/?/, '/doi/pdf/'): null,
    },
    'onlinelibrary.wiley.com': {
      download: url => url.includes('doi/pdf') ? null: (url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/')|| url.includes('doi/book') ? url.replace(/\/doi\/(book|abs|full)?\/?/, '/doi/pdfdirect/'): null),
      redirectorLogin: url => url.includes('doi/pdf') ? null: (url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/')|| url.includes('doi/book') ? url.replace(/\/doi\/(book|abs|full)?\/?/, '/doi/pdfdirect/'): null),
    },
    'journals.sagepub.com': {
      download: url => url.includes('doi/abs/') || url.includes('doi/full/') || url.includes('doi/') ? url.replace(/\/doi\/(abs|full)?\/?/, '/paragraph/download/?doi=') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') + "?utm_source=cross-product-footer&utm_medium=cross-product&":null,
    },
    'arc.aiaa.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') + "&federationId=https://fed.openathens.net/oafed/metadata": null,
    },
    'dl.acm.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
    },
    'ascelibrary.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
    },
    'www.annualreviews.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
    },
    'wanfangdata.com.cn': {
      download: url => null,
      redirectorLogin: url => url,
    },
    'kns.cnki.net': {
      download: url => url.includes('kcms2') ? url: null,
      redirectorLogin: url => null,
    },
    'iopscience.iop.org': {
      download: url => url.includes('pdf') ? null:url.includes('article') ? (url.includes('meta') ? url.replace('/meta', '/pdf') : url + '/pdf'): url.includes('book') ? (url.includes('meta') ? url.replace('/meta', '.pdf') : url + '.pdf'):null,
      redirectorLogin: url => url.includes('pdf') ? null:url.includes('article') ? (url.includes('meta') ? url.replace('/meta', '/pdf') : url + '/pdf'): url.includes('book') ? (url.includes('meta') ? url.replace('/meta', '.pdf') : url + '.pdf'):null,
    },
    'www.science.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') ? url.replace(/\/doi\/(abs|full|epdf)?\/?/, '/doi/pdf/') +'&federationId=https://fed.openathens.net/oafed/metadata&mode=trans&targetSP=https://www.science.org&requesterId=https://www.science.org/shibboleth': null,
    },
    'www.scientific.net': {
      download: url => url,
      redirectorLogin: url => url,
    },
    'link.springer.com': {
      download: url => url.includes('article') || url.includes('book') ? url: null,
      redirectorLogin: url => url,
    },
    'www.nature.com': {
      download: url => url.includes('articles') ? url : null,
      redirectorLogin: url => url,
    },
    'www.jstor.org': {
      download: url => null,
      redirectorLogin: url => url+'&site=jstor',
    },
    'www.pnas.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') + '&mode=trans&targetSP=https://www.pnas.org&requesterId=https://pnas.org/shibboleth' : null,
    },
    'www.proquest.com': {
      download: url => url.includes('view') ? url: null,
      redirectorLogin: url => url.includes('view') ? url + "?accountid=14426": null,
    },
    'www.ahajournals.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => url.includes('doi/') ? url.replace('/doi/', '/doi/pdf/') : null,
    },
    'www.degruyter.com': {
      download: url => url.includes('html') ? url.replace('html', 'pdf') : null,
      redirectorLogin: url => url.includes('html') ? url : null,
    },
    'pubs.rsna.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => null,
    },
    'pubsonline.informs.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => null,
    },
    'cdnsciencepub.com': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => null,
    },
    'www.acpjournals.org': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => null,
    },
    'www.liebertpub.com': {
      download: url => url.includes('doi/abs') || url.includes('doi/full') || url.includes('doi/') || url.includes('doi/epdf') || url.includes('doi/epub') ? url.replace(/\/doi\/(abs|full|epdf|epub)?\/?/, '/doi/pdf/') : null,
      redirectorLogin: url => null,
    },
    'digital-library.theiet.org': {
      download: url => url,
      redirectorLogin: url => null,
    },
    // 添加其他域名的处理函数
  };

  // 检查当前域名是否需要包含查询字符串
  const shouldIncludeDomain = ['kns.cnki.net', 'qikan.cqvip.com', 'www.yiigle.com','heinonline.org','karger.com'].includes(currentDomain);

  // 根据是否需要包含查询字符串来生成 URL，排除查询字符串（？和#）
  const url = shouldIncludeDomain ? currentUrl : currentUrl.split(/[?#]/)[0];

  // 根据 URL 获取当前页面所在的域名
   const domain = Object.keys(domains).find(d => url.includes(d));
  if (!domain) return;

  // 获取当前域名的替换映射关系
  const replacements = domainReplacements[currentDomain] || {};

  // 生成下载链接和重定向登录链接，并进行域名替换
  const downloadUrl = domains[domain].download(url)?.replace(currentDomain, replacements.download);
  const redirectorLoginUrl = domains[domain].redirectorLogin(url)?.replace(currentDomain, replacements.redirectorLogin);

 // 检查替换后的域名是否包含"webvpn.zju.edu.cn"，如果是，则使用HTTP协议//下载链接
  const isWebvpnDomain = downloadUrl && downloadUrl.includes('webvpn.zju.edu.cn');
  const newDownloadUrl = isWebvpnDomain ? downloadUrl.replace('https://', 'http://') : downloadUrl;


  // 创建下载 PDF 按钮
  if (newDownloadUrl) createButton(newDownloadUrl, 'Download PDF');

 // 创建 Redirector 登录按钮
  if (redirectorLoginUrl) createButton(redirectorLoginUrl, 'Redirector Login', 'left');

  /**
   * 创建按钮函数
   * @param {string} url - 按钮链接
   * @param {string} text - 按钮文本
   * @param {string} position - 按钮位置，默认为 'right'
   */
  function createButton(url, text, position = 'right') {
    const btn = document.createElement('a');
    btn.style = `position: fixed; z-index: 999999999; top: 50%; ${position}: 20px; transform: translateY(-50%); padding: 10px 15px; background-color: #007aff; color: #fff; border-radius: 5px; font-weight: bold; text-decoration: none;`;
    btn.href = url;
    btn.target = '_blank';
    btn.innerHTML = text;
    document.body.appendChild(btn);
  }
})();
