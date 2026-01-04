// ==UserScript==
// @name         Shanghai Library e-journals download redirect
// @version      0.1
// @description  e-journals download redirect for  Shanghai Library V 0.1
// @match      *://www.wanfangdata.com.cn/*
// @match      *://academic.oup.com/journals*
// @match      *://iopscience.iop.org/*
// @match      *://link.springer.com/*
// @match      *://muse.jhu.edu/*
// @match      *://onlinelibrary.wiley.com/*
// @match      *://www.cambridge.org/core*
// @match      *://www.cnki.net/*
// @match      *://www.duxiu.com/*
// @match      *://www.jstor.org/*
// @match      *://www.sciencedirect.com/*
// @match      *://www.tandfonline.com/*
// @match      *://www.worldscientific.com/page/worldscibooks*
// @author       famiuer
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/812983
// @downloadURL https://update.greasyfork.org/scripts/432044/Shanghai%20Library%20e-journals%20download%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/432044/Shanghai%20Library%20e-journals%20download%20redirect.meta.js
// ==/UserScript==


window.location.replace(window.location.href.replace('academic.oup.com/journals', 'academic-oup-com-s.z.library.sh.cn/journals/').replace('iopscience.iop.org', 'iopscience-iop-org-s.z.library.sh.cn').replace('link.springer.com', 'link-springer-com-s.z.library.sh.cn').replace('muse.jhu.edu', 'muse-jhu-edu-s.z.library.sh.cn').replace('onlinelibrary.wiley.com', 'onlinelibrary-wiley-com-s.z.library.sh.cn').replace('www.cambridge.org', 'www-cambridge-org-s.z.library.sh.cn').replace('www.cnki.net', 'www-cnki-net-s.z.library.sh.cn').replace('www.duxiu.com', 'www-duxiu-com-s.z.library.sh.cn').replace('www.jstor.org', 'www-jstor-org-s.zz.library.sh.cn').replace('www.sciencedirect.com', 'www-sciencedirect-com-s.z.library.sh.cn').replace('www.tandfonline.com', 'www-tandfonline-com-s.z.library.sh.cn').replace('www.wanfangdata.com.cn', 'p-8088.10.1.20.73.z.library.sh.cn').replace('www.worldscientific.com', 'www-worldscientific-com-s.z.library.sh.cn'));