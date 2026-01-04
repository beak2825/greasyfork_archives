// ==UserScript==
// @name        cnki download.
// @namespace   cnki download.
// @grant       none
// @run-at      document-start
// @inject-into content
// @version     1.0
// @author      zwwwwlqqwww
// @license     hg
// @description 文献直达
// @match       *://onlinelibrary.wiley.com/doi/*
// @match       *://kns.cnki.net/*
// @match       *://www.cnki.net
 
// @downloadURL https://update.greasyfork.org/scripts/457304/cnki%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/457304/cnki%20download.meta.js
// ==/UserScript==
// Variables
const L = window.location
// Redirect to new URL
const redirectTo = url=>{ L.href = url }
// Replace something from URL
const replaceLocation = (inReg, outReg)=>{
  redirectTo( L.href.replace(inReg, outReg) )
}
const doiRegex = new RegExp('(10\.\\d{4,}/[-._;()/:\\w]+)')
const rscRegex = new RegExp('\\d{4}/ta/[A-Za-z0-9]{6,14}')
 
var ppurl
let cars = ["wiley", "science", "nature","rsc","sciencedirect"];
for(var key in cars) {
     if ((window.location.href.indexOf(cars[key])>-1)&&(window.location.href.indexOf("whu")==-1)){ ppurl=L}
}
 
// rules
const rules = [
   {/* login  \?service=http%3A%2F%2Fuas.metaauth.com%2Fcas-whu%2Flogin.jsp%3FserviceIP%3Dwww.metaauth.com%2F/i,*/
       reg: /^https?:\/\/cas.whu.edu.cn\/authserver\/login/i,
       redirect: ()=>{ window.location.replace('https://whu.metaersp.cn/platformRelation/loading?token=69312d1b2203ccc936a9f4973794dc4d&username=00014279&password=bkU458f4EM7053PX&databasenum=DB_631aed305895402c820f8ef688757b8b&librarycode=131001')}
   },
  { /*login */
       reg: /^https?:\/\/ersp.lib.whu.edu.cn\/s\/com\/wiley\/onlinelibrary\/G.https\/?;x-chain-id=7pzhmk1i60w0/i,
       redirect: ()=>{ window.location.replace( ppurl)}
   },
    {/* cnki */
       reg: /^https?:\/\/www.cnki.net/i,
       redirect: ()=>{ replaceLocation(/^https?:\/\/www.cnki.net/i,'https://ersp.lib.whu.edu.cn/s/net/cnki/kns/G.https/kns8/defaultresult/index') }
   },
  {/* cnki */
      reg: /^https?:\/\/kns.cnki.net/i,
      redirect: ()=>{ replaceLocation(/^https?:\/\/kns.cnki.net/i, 'https://ersp.lib.whu.edu.cn/s/net/cnki/kns/G.https') }
   },

]
for(const rule of rules){
  if(rule.reg.test(L.href)){
     //window.alert(L);
    rule.redirect()
    break
  }
}