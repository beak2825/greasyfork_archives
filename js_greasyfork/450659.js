// ==UserScript==
// @name        page jump.
// @namespace   page jump.
// @grant       none
// @run-at      document-start
// @inject-into content
// @version     1.0
// @author      zwwwwlqqwww
// @license     hg
// @description 文献直达
// @match       *://onlinelibrary.wiley.com/doi/*
// @match       *://pubs.rsc.org/en/content/articlelanding/*
// @match       *://cas.whu.edu.cn/authserver/*
// @match       *://www.science.org/doi/*
// @match       *:https://ersp.lib.whu.edu.cn/proxy
// @match       *://www.nature.com/articles/*
// @match       *://www.sciencedirect.com/*
// @match       *://ersp.lib.whu.edu.cn/*
// @match       *://link.springer.com/*

// @downloadURL https://update.greasyfork.org/scripts/450659/page%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/450659/page%20jump.meta.js
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

    {/* wiley */
        reg: /^https?:\/\/onlinelibrary.wiley.com\/doi/i,
        redirect: ()=>{ window.location.replace('https://ersp.lib.whu.edu.cn/s/com/wiley/onlinelibrary/G.https/doi/'+location.href.match(doiRegex)[1])}
    },
        {/* wiley */
            reg:/^https?:\/\/([\s\S]*)onlinelibrary.wiley.com\/doi/i,
            redirect: ()=>{ window.location.replace('https://ersp.lib.whu.edu.cn/s/com/wiley/onlinelibrary/G.https/doi/'+location.href.match(doiRegex)[1])}
        },
   {/* science */
       reg: /^https?:\/\/www.science.org\/doi/i,
       redirect: ()=>{ window.location.replace( 'https://ersp.lib.whu.edu.cn/s/org/science/www/G.https/doi') }
   },
   {/* nature */
    reg: /^https?:\/\/www.nature.com/i,
    redirect: ()=>{ replaceLocation(/^https?:\/\/www.nature.com/i, 'https://ersp.lib.whu.edu.cn/s/com/nature/www/G.https') }
   },
   {/* rsc */
       reg: /^https?:\/\/pubs.rsc.org\/en\/content\/articlelanding/i,
       redirect: ()=>{ replaceLocation(/^https?:\/\/pubs.rsc.org\/en\/content\/articlelanding/i, 'https://ersp.lib.whu.edu.cn/s/org/rsc/pubs/G.https/en/content/articlelanding') }
   },
    {/* sd*/
       reg: /^https?:\/\/www.sciencedirect.com\/science\/article\/abs/i,
       redirect: ()=>{ replaceLocation(/^https?:\/\/www.sciencedirect.com\/science\/article\/abs/i, 'https://ersp.lib.whu.edu.cn/s/com/sciencedirect/www/G.https/science/article') }
   },
    {/* sp*/
       reg: /^https?:\/\/link.springer.com\/article/i,
       redirect: ()=>{ replaceLocation(/^https?:\/\/link.springer.com\/article/i, 'https://ersp.lib.whu.edu.cn/s/com/springer/link/G.https/article') }
   },

       {/* rsc */
        //reg: /^https?:\/\/pubs.rsc.org\/en\/content\/articlelanding/i,
       // redirect: ()=>{ replaceLocation(L.herf,'https://ersp.lib.whu.edu.cn/s/org/rsc/pubs/G.https/en/content/articlelanding/'+location.href.match(rscRegex))}
       },


    {/* wiley action */
      //reg: /^https?:\/\/ersp.lib.whu.edu.cn\/s\/com\/wiley\/onlinelibrary\/G.https\/action/i,
      //redirect: ()=>{ replaceLocation( /^https?:\/\/ersp.lib.whu.edu.cn\/s\/com\/wiley\/onlinelibrary\/G.https\/action/i, 'https://onlinelibrary.wiley.com/action')}
    },

]
for(const rule of rules){
  if(rule.reg.test(L.href)){
     //window.alert(L);
    rule.redirect()
    break
  }
}




