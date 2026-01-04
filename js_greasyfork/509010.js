// ==UserScript==
// @name         四方坪职院学术重定向
// @namespace    https://example.com
// @version      1.4
// @license      MPL-2.0
// @description  「重要更新」Update 1.4 切换图书馆API；通过重定向至图书馆包库，解锁期刊访问权限
// @author       https://github.com/cyan-io
// @homepage     https://github.com/cyan-io/SPC-Academic-Redirection

// @match        *://uni.resset.com/*
// @match        *://edu.sslibrary.com/*
// @match        *://www.annualreviews.org/*
// @match        *://www.iwaponline.com/*
// @match        *://www.proquest.com/*
// @match        *://www.cshprotocols.org/*
// @match        *://www.plantcell.org/*
// @match        *://e-learning.51cto.com/*
// @match        *://pubs.rsna.org/*
// @match        *://pubsonline.informs.org/*
// @match        *://iopscience.iop.org/*
// @match        *://thesis.library.caltech.edu/*
// @match        *://disk.hnadl.cn/*
// @match        *://www.jstor.org/*
// @match        *://epubs.siam.org/*
// @match        *://esi.clarivate.com/*
// @match        *://www.degruyter.com/*
// @match        *://www.healthaffairs.org/*
// @match        *://www.inoteexpress.com/*
// @match        *://bg.sunwayinfo.com.cn/*
// @match        *://portlandpress.com/*
// @match        *://www.twbxyz.net/*
// @match        *://www.iresearchbook.cn/*
// @match        *://jt.xinyulib.com.cn/*
// @match        *://jcr.clarivate.com/*
// @match        *://www.fenqubiao.com/*
// @match        *://link.gale.com/*
// @match        *://www.engineeringvillage.com/*
// @match        *://navi.ion.org/*
// @match        *://paper.hnlat.com/*
// @match        *://specialsci.cn/*
// @match        *://journals.ametsoc.org/*
// @match        *://esajournals.onlinelibrary.wiley.com/*
// @match        *://arxiv.org/*
// @match        *://www.innojoy.com/*
// @match        *://101.201.29.206:8012/*
// @match        *://www.englibrary.com/*
// @match        *://www.cnki.net/*
// @match        *://academic.oup.com/*
// @match        *://www.nature.com/*
// @match        *://www.pqdtcn.com/*
// @match        *://www.wanfangdata.com.cn/*
// @match        *://www.ieslib.com/*
// @match        *://www.arabidopsis.org/*
// @match        *://www.sciencedirect.com/*
// @match        *://scifund.wanfangdata.com.cn/*
// @match        *://dl.acm.org/*
// @match        *://www.ajnr.org/*
// @match        *://xwk.test.cqvip.com:8090/*
// @match        *://www.doaj.org/*
// @match        *://incites.clarivate.com/*
// @match        *://www.keledge.com/*
// @match        *://www.umajor.net/*
// @match        *://www.spiedigitallibrary.org/*
// @match        *://www.52met.com/*
// @match        *://elibrary.asabe.org/*
// @match        *://www.sciencemag.org/*
// @match        *://bksp.hnadl.cn/*
// @match        *://link.springer.com/*
// @match        *://suyang.zxhnzq.com/*
// @match        *://baike.udsim.net/*
// @match        *://webofscience.com/*
// @match        *://xianxiao.ssap.com.cn/*
// @match        *://cssci.nju.edu.cn/*
// @match        *://www.global-sci.org/*
// @match        *://www.cashl.edu.cn/*
// @match        *://www.osapublishing.org/*
// @match        *://journals.aps.org/*
// @match        *://www.MeTeL.cn/*
// @match        *://www.tandfonline.com/*
// @match        *://www.ydylcn.com/*
// @match        *://www.cxstar.com/*
// @match        *://www.annals.org/*
// @match        *://qikan.cqvip.com/*
// @match        *://www.oadds.cn/*
// @match        *://www.pnas.org/*
// @match        *://m-tob.jd.com/*
// @match        *://www.cambridge.org/*
// @match        *://sage.cnpereading.com/*
// @match        *://www.nejm.org/*
// @match        *://www.scopus.com/*
// @match        *://www.bjinfobank.com/*
// @match        *://ssvideo.chaoxing.com/*
// @match        *://aspb.org/*
// @match        *://www.scitation.org/*
// @match        *://cdnsciencepub.com/*
// @match        *://iopscience.iop.org/*
// @match        *://www.nrcresearchpress.com/*
// @match        *://gwbz.sunwayinfo.com.cn/*
// @match        *://www.htcases.com/*
// @match        *://cmkd.hnadl.cn/*
// @match        *://cadal.edu.cn/*
// @match        *://agupubs.onlinelibrary.wiley.com/*
// @match        *://arc.aiaa.org/*
// @match        *://www.hnadl.cn/*
// @match        *://sciencechina.cn/*
// @match        *://journals.sagepub.com/*
// @match        *://www.rdfybk.com/*
// @match        *://kg.iguofang.net:8888/*
// @match        *://www.vipexam.cn/*
// @match        *://asmedigitalcollection.asme.org/*
// @match        *://onlinelibrary.wiley.com/*
// @match        *://fx.gfkd.chaoxing.com/*
// @match        *://www.neohytung.com/*
// @match        *://www.bingoenglish.net/*
// @match        *://search.ebscohost.com/*
// @match        *://www.emerald.com/*
// @match        *://www.duxiu.com/*
// @match        *://www.bigan.net/*
// @match        *://www.patentics.com/*
// @match        *://janes.cinfo.net.cn/*
// @match        *://www.dachengdata.com/*
// @match        *://www.royalsocietypublishing.org/*
// @match        *://www.cshlpress.com/*
// @match        *://ieeexplore.ieee.org/*
// @match        *://pubs.acs.org/*
// @match        *://www.scival.com/*
// @match        *://www.emis.cn/*
// @match        *://libfw.nudt.edu.cn/*
// @match        *://www.51sjsj.com/*
// @match        *://www.futuremedicine.com/*
// @match        *://library.cmpkgs.com/*
// @match        *://data.lilun.cn/*
// @match        *://lib-nudt.wqxuetang.com/*
// @match        *://law.hnadl.cn/*
// @match        *://www.webofknowledge.com/*
// @match        *://olap.epsnet.com.cn/*

// @icon        https://library.nudt.edu.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/509010/%E5%9B%9B%E6%96%B9%E5%9D%AA%E8%81%8C%E9%99%A2%E5%AD%A6%E6%9C%AF%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/509010/%E5%9B%9B%E6%96%B9%E5%9D%AA%E8%81%8C%E9%99%A2%E5%AD%A6%E6%9C%AF%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
'use strict';
// 1.4 update library api
let redirectUrl = 'https://libyc.nudt.edu.cn/go?url=' + window.location.href

console.log('Debug <url>', redirectUrl);

let button = document.createElement('button');
button.innerHTML = '🔐' + redirectUrl;
button.style.position = 'fixed';
button.style.bottom = '20px';
button.style.right = '20px';
button.style.zIndex = '9999';
button.style.backgroundColor = '#FFFFFF';
button.style.border = '2px solid black';
button.style.borderRadius = '5px';
button.style.padding = '5px 10px';
button.addEventListener('click',
                        function() { window.open(redirectUrl, "_blank"); });
document.body.appendChild(button);
})();
