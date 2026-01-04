// ==UserScript==
// @name         MB6 Search BETA (MIN)
// @namespace    https://edocuments.co.uk/
// @version      1.6
// @description  (minified) BETA Quick search for Manual Builder 6
// @author       mbacon@edocuments.co.uk
// @match        https://edocs-site-springboard6.azurewebsites.net/*
// @match        https://edocs-site-springboard6-dev.azurewebsites.net/*
// @match        https://edocs-site-springboard6-test.azurewebsites.net/*
// @match        https://edocs-site-springboard6-staging.azurewebsites.net/*
// @match        https://edocumentsbuild.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32808/MB6%20Search%20BETA%20%28MIN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32808/MB6%20Search%20BETA%20%28MIN%29.meta.js
// ==/UserScript==
setTimeout(function(){'use strict';function b(){return 0<M.length||N?K('Portfolio already fetched: ',M.length):(n(),w?O?K('Aborted getting portfolio because already in process of getting it'):void(O=!0,m('GET','Core6','Portfolio/ByUserId').then(function(V){O=!1,M=V.Result.sites||[],0===M.length?N=!0:(A.classList.add('ready'),D.value.trim().length&&T())}).catch(function(V){L('Portfolio get error: '+V.message),O=!1})):K('Aborted getting portfolio because authToken is invalid'))}function d(){return 0<P.length||Q?K('Recents already fetched: ',P.length):(n(),w?R?K('Aborted getting recents because already in process of getting it'):void(R=!0,m('GET','Core6','Documents/Recent').then(function(V){R=!1;var W=(V.Result.documents||[]).sort((Z,$)=>Z.activityDate<$.activityDate);if(0===W.length)Q=!0;else{var X=null,Y=null;W.forEach(function(Z,$){var _={id:Z.siteId,name:Z.siteName,projects:[]};0<$&&X.id===_.id?_=X:P.push(_),X=_;var aa={id:Z.projectId,edocsRef:Z.projectRef,name:Z.projectName,documents:[]};0<$&&Y.id===aa.id&&(aa=Y),aa!==Y&&_.projects.push(aa),Y=aa,aa.documents.push({id:Z.documentId,name:Z.documentName,activity:Z.activity,activityDate:Z.activityDate.substr(0,10)})})}0<P.length&&T()}).catch(function(V){L('Recents get error: '+V.message),R=!1})):K('Aborted getting recents because authToken is invalid'))}function f(){return window.location.origin}function g(V,W,X,Y){var Z=f(),$=V.replace(/^.+(#[a-z0-9]+)$/,'$1');$===V?$='':V=V.replace($,'');var _=Z+'/'+V+'?S='+W;return X&&(_+='&G='+X),Y&&(_+='&W='+Y),$&&(_+=$),_}function h(V,W,X,Y){var Z=document.createElement('a');return Z.classList.add(o('result-target')),Z.href='function'==typeof V.path?V.path(W,X,Y):g(V.path,W,X,Y),Z.textContent=V.name,Z}function l(){A.style.display='none',z.style.display='none'}function m(V,W,X,Y){return fetch('https://edocsapi.azurewebsites.net/'+W+'/api/'+X,{method:V,mode:'cors',headers:{Authorization:'Digest username="xbbsz5aj45w" realm="" password="'+w+'"','Content-Type':'application/json'},body:JSON.stringify(Y),cache:'default'}).then(function($){if(!$.ok)throw new Error('Request failure: '+$.statusText);return $.json()}).catch(function($){alert('Search BETA - Request error: '+$.message)})}function n(){w=(window.whoAmI||{}).apiAccessToken}function o(V){return'mb6sb-'+V}function p(V){return[].slice.call(document.querySelectorAll(V))}function q(V){return(V||'').trim().toLowerCase()}function u(V){var W=new Date(V),X=new Date().getUTCFullYear(),Z=['January','February','March','April','May','June','July','August','September','October','November','December'][W.getUTCMonth()];return Z.substr(0,3)+' '+W.getUTCDate()+(W.getUTCFullYear()===X?'':' '+W.getUTCFullYear())}var w,x,y,z,A,B,C,D,E,F,G=[{name:'Dashboard',path:'site-dashboard.htm'},{name:'Management',path:'site-management.htm#users'}],H=[{name:'Dashboard',path:(V,W)=>'/site-dashboard.htm?S='+V+'&G='+W+'#projects='+W},{name:'Reporting',path:(V,W)=>'https://edocs-site-reporting.azurewebsites.net/#/report/'+W}],I=[{name:'Dashboard',path:'document-dashboard.htm'},{name:'Editor',path:'document-editor.htm'},{name:'Files',path:'document-files.htm'},{name:'Reporting',path:'document-reporting.htm'},{name:'Tools',path:'document-tools.htm'}],J=!1;window.enableSearchLogging=function(V){'boolean'!=typeof V&&(V=!0),J=V};var K=function(){J&&console.log.apply(console,arguments)},L=function(){J&&console.error.apply(console,arguments)},M=[],N=!1,O=!1,P=[],Q=!1,R=!1;w='',n();var S=null,T=function(V,W,X){var Y,Z=!0;return function(){var $=this,_=arguments;Z&&(X&&V.apply($,_),Z=!1,Y=setTimeout(function(){Z=!0,X||V.apply($,_)},W))}}(function(){var W=D.value.trim().toLowerCase(),X=''===W&&0<P.length;if(W!=S&&(M.length||X)){E.innerHTML=X?'<strong id="'+o('recent-title')+'">Recent activity:</strong>':'';var Y=q(W).split(' '),Z=function(aa,ba){var ca=q(aa).split(' '),da=[];return ca.forEach(function(ea){Y.forEach(function(fa){-1<ea.indexOf(fa)&&-1===da.indexOf(fa)&&da.push(fa)})}),da.length>(ba?Y.length-1:0)};b();var $=[];(X?P:M).forEach(function(_){var aa=!1,ba={id:_.id,name:_.name,projects:[]};_.projects.forEach(function(ca){var da=!1,ea={id:ca.id,name:ca.name,edocsRef:ca.edocsRef,documents:[]};ca.documents.forEach(function(fa){Z(fa.name)&&Z([_.name,ca.name,ca.edocsRef,fa.name].join(' '),!0)&&ea.documents.push(fa)}),da=Z(ca.name+' '+ca.edocsRef)&&Z(_.name+' '+ca.name+' '+ca.edocsRef,!0)||0<ea.documents.length,da&&(0===ea.documents.length&&(ea.documents=ca.documents),ba.projects.push(ea))}),aa=Z(_.name,!0)||0<ba.projects.length,aa&&(0===ba.projects.length&&(ba.projects=_.projects),$.push(ba))}),$.forEach(function(_){var aa=document.createElement('div');aa.classList.add(o('search-result'));var ba=document.createElement('div');ba.classList.add(o('site'),o('result-item'));var ca=document.createElement('div');ca.classList.add(o('result-item-title'));var da=document.createElement('div');da.textContent=_.name,da.classList.add(o('site-name'),o('result-item-name'));var ea=document.createElement('div');if(ea.textContent='Site: ',ea.classList.add(o('result-targets')),G.forEach(function(ga){ea.appendChild(h(ga,_.id))}),ca.appendChild(da),ca.appendChild(ea),ba.appendChild(ca),aa.appendChild(ba),0<_.projects.length){var fa=document.createElement('div');fa.classList.add(o('projects'),o('result-children')),ba.appendChild(fa),_.projects.forEach(function(ga){var ha=document.createElement('div');ha.classList.add(o('project'),o('result-item'));var ia=document.createElement('div');ia.classList.add(o('result-item-title'));var ja=document.createElement('div');ja.textContent=(ga.edocsRef?ga.edocsRef+' : ':'')+ga.name,ja.classList.add(o('project-name'),o('result-item-name'));var ka=document.createElement('div');if(ka.textContent='Project: ',ka.classList.add(o('result-targets')),H.forEach(function(ma){ka.appendChild(h(ma,_.id,ga.id))}),ia.appendChild(ja),ia.appendChild(ka),ha.appendChild(ia),fa.appendChild(ha),0<ga.documents.length){var la=document.createElement('div');la.classList.add(o('documents'),o('result-children')),ha.appendChild(la),ga.documents.forEach(function(ma){var na=document.createElement('div');na.classList.add(o('document'),o('result-item'));var oa=document.createElement('div');oa.classList.add(o('result-item-title'));var pa=document.createElement('div');pa.textContent=ma.name,X&&(pa.textContent+=' ('+u(ma.activityDate)+' - '+ma.activity+')'),pa.classList.add(o('document-name'),o('result-item-name'));var qa=document.createElement('div');qa.textContent='Document: ',qa.classList.add(o('result-targets')),I.forEach(function(ra){qa.appendChild(h(ra,_.id,ga.id,ma.id))}),oa.appendChild(pa),oa.appendChild(qa),na.appendChild(oa),la.appendChild(na)})}})}E.appendChild(aa)}),S=W}},500);x=document.createElement('style'),x.type='text/css',x.rel='stylesheet',x.innerHTML=`
        #${o('launch-elem')} {
            top: 10px;
            right: 10px;
            color: #222;
            padding: 10px;
            cursor: pointer;
            position: fixed;
            background: #CCC;
            z-index: 99;
        }
        #${o('launch-elem')}:hover {
            background: #EEE;
        }

        #${o('overlay-elem')} {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 991;
            display: none;
            position: fixed;
            cursor: pointer;
            background: rgba(20,20,20,0.7);
        }

        #${o('search-elem')} {
            z-index: 992;
            top: 50%;
            left: 50%;
            color: #222;
            width: 700px;
            height: 400px;
            display: none;
            padding: 10px;
            position: fixed;
            background: #EEE;
            transform: translate(-50%, -50%);
        }
            #${o('recent-title')} {
                padding: 10px 5px;
            }

        #${o('search-input')} {
            margin: 5px;
            width: 200px;
            font-size: 12px;
            padding: 5px 8px;
            background: #FFF;
            line-height: 15px;
            border: 1px solid #CCC;
        }
            #${o('search-elem')}.ready #${o('search-input')} {
                background: #FFF;
            }

        #${o('search-results')} {
            line-height: 14px;
            overflow-y: auto;
            font-size: 12px;
            height: 360px;
        }
            #${o('search-results')} .${o('search-result')} {
                margin: 5px;
                padding: 5px;
                background: #DDD;
            }
                .${o('result-item')} {
                }
                    .${o('result-item-title')} {
                        position: relative;
                    }
                    .${o('result-item-title')} .${o('result-targets')} {
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 150px;
                        padding: 2px;
                        display: none;
                        font-size: 11px;
                        background: #DDD;
                        line-height: 14px;
                        position: absolute;
                        box-shadow: #DDD -15px 0 20px 5px;
                    }
                    .${o('result-item-title')}:hover > .${o('result-targets')} {
                        display: block;
                    }
                        .${o('result-targets')} .${o('result-target')} {
                            display: inline-block;
                            padding: 2px 4px;
                            margin: 0 5px;
                        }
                    .${o('result-item')} .${o('result-item-name')} {
                        padding: 5px;
                    }
                    .${o('search-result')} .${o('result-children')} {
                        margin-left: 15px;
                    }
`,document.head.appendChild(x),A=document.createElement('div'),A.id=o('search-elem'),B=document.createElement('div'),B.id=o('search-login'),A.appendChild(B),C=document.createElement('div'),C.id=o('search-form'),A.appendChild(C),D=document.createElement('input'),D.id=o('search-input'),C.appendChild(D),D.addEventListener('blur',T),D.addEventListener('keyup',T),E=document.createElement('div'),E.id=o('search-results'),C.appendChild(E),F=document.createElement('div'),F.id=o('recents'),A.appendChild(F),z=document.createElement('div'),z.id=o('overlay-elem'),z.addEventListener('click',function(){l()}),document.addEventListener('keyup',function(V){27===V.keyCode&&l()}),y=document.createElement('div'),y.id=o('launch-elem'),y.textContent='Search BETA',y.addEventListener('click',function(){A.style.display='block',z.style.display='block',b(),d(),D.focus()}),function(V,W,X,Y){function Z(){var _=W();_?V(_):($++,$<X&&setTimeout(Z,Y))}var $=0;X=X||10,Y=Y||150,setTimeout(Z,Y)}(function(V){V[V.length-1];document.body.appendChild(y),document.body.appendChild(z),document.body.appendChild(A)},function(){var V=p('#navigation .mainNav > li');return 0===V.length?null:V},30,250)},500);