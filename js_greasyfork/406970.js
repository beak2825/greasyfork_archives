// ==UserScript==
// @name         企查查企业信息页面精简工具
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  用于企查查精简信息
// @author       DD
// @grant        none
// @match  *://www.qcc.com/firm*
// @downloadURL https://update.greasyfork.org/scripts/406970/%E4%BC%81%E6%9F%A5%E6%9F%A5%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/406970/%E4%BC%81%E6%9F%A5%E6%9F%A5%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
qichacha();
    function qichacha(){
        console.log('开始优化企查查信息页面');
        //删除多余无关内容
        if(document.getElementById('RNav') != undefined){document.getElementById('RNav').remove();}
        if(document.getElementById('openSuspend') != undefined){document.getElementById('openSuspend').remove();}
        if(document.getElementsByClassName('own-switch')[0]!=undefined){document.getElementsByClassName('own-switch')[0].remove();}
        if(document.getElementsByClassName('logo')[1]!=undefined){document.getElementsByClassName('logo')[1].remove();}
        if(document.getElementsByClassName('row title jk-tip')[0].getElementsByClassName('btn-nrenzheng')[0] != undefined){ document.getElementsByClassName('row title jk-tip')[0].getElementsByClassName('btn-nrenzheng')[0].remove(); }
        if(document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_jk')[0] != undefined){document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_jk')[0].remove();}
        if(document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_card')[0] != undefined){document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_card')[0].remove();}
        if(document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_contact')[0] != undefined){document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_contact')[0].remove();}
        if(document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_focus')[0] != undefined){document.getElementsByClassName('company-action')[0].getElementsByClassName('c_iconDt2 ca_focus')[0].remove();}
        if(document.getElementsByClassName('dcontent')[0] != undefined){document.getElementsByClassName('dcontent')[0].remove(); }
        if(document.getElementsByClassName('row dongtai  dongtai4')[0]!= undefined){ document.getElementsByClassName('row dongtai  dongtai4')[0].remove();}
        if(document.getElementsByClassName('company-btoolbar clearfix')[0] != undefined){document.getElementsByClassName('company-btoolbar clearfix')[0].remove();}
        if(document.getElementsByClassName('renzheng-qcccert  hvisit')[0] != undefined){document.getElementsByClassName('renzheng-qcccert  hvisit')[0].remove();}
        if(document.getElementsByClassName('company-visit')[0] != undefined){document.getElementsByClassName('company-visit')[0].remove(); }
        if(document.getElementsByClassName('company-centbar')[0] != undefined){document.getElementsByClassName('company-centbar')[0].remove(); }
        if(document.getElementsByClassName('company-nav')[0] != undefined){document.getElementsByClassName('company-nav')[0].remove(); }
        if(document.getElementsByClassName('col-sm-12')[0].getElementsByTagName('header')[0] != undefined){document.getElementsByClassName('col-sm-12')[0].getElementsByTagName('header')[0].remove();}
        if(document.getElementsByClassName('panel b-a clear m_dataTab')[0] != undefined){document.getElementsByClassName('panel b-a clear m_dataTab')[0].remove();
                                                                                        }
        if(document.getElementById('qccGraph') != undefined){document.getElementById('qccGraph').remove();
                                                            }
        if(document.getElementById('riskTop1') != undefined){document.getElementById('riskTop1').remove();
                                                            }
        if(document.getElementById('partnern') != undefined){document.getElementById('partnern').remove(); }
        if(document.getElementById('guquan') != undefined){document.getElementById('guquan').remove();
                                                          }
        if(document.getElementById('Mainmember') != undefined){document.getElementById('Mainmember').remove();
                                                              }
        if(document.getElementById('touzilist') != undefined){document.getElementById('touzilist').remove();
                                                             }
        if(document.getElementById('syrlist') != undefined){document.getElementById('syrlist').remove();
                                                           }
        if(document.getElementById('kzrtupu') != undefined){document.getElementById('kzrtupu').remove();
                                                           }
        if(document.getElementById('holdcolist') != undefined){document.getElementById('holdcolist').remove();
                                                              }
        if(document.getElementById('branchelist') != undefined){document.getElementById('branchelist').remove();
                                                               }
        if(document.getElementById('publicity') != undefined){document.getElementById('publicity').remove();
                                                             }
        if(document.getElementById('stockholderslist') != undefined){document.getElementById('stockholderslist').remove();
                                                                    }
        if(document.getElementById('stockchangelist') != undefined){document.getElementById('stockchangelist').remove();
                                                                   }
        if(document.getElementById('stockholdersTab') != undefined){document.getElementById('stockholdersTab').remove();
                                                                   }
        if(document.getElementById('muhou') != undefined){document.getElementById('muhou').remove();
                                                         }
        if(document.getElementById('cwjx') != undefined){document.getElementById('cwjx').remove();
                                                        }
        if(document.getElementById('thyfx') != undefined){document.getElementById('thyfx').remove();}

        if(document.getElementsByClassName('footer')[0] != undefined){ document.getElementsByClassName('footer')[0].remove();}

        if(document.getElementsByClassName('panel clear company-bottom-nav')[0] != undefined){document.getElementsByClassName('panel clear company-bottom-nav')[0].remove();
                                                                                             }
        if(document.getElementsByClassName('nco-bottom')[0] != undefined){document.getElementsByClassName('nco-bottom')[0].remove();}
        if(document.getElementsByClassName('oxin clear')[0] != undefined){document.getElementsByClassName('oxin clear')[0].remove();}
         //美化页面
        if(document.getElementsByClassName('ntag text-danger tooltip-br')[0]!=undefined){document.getElementsByClassName('ntag text-danger tooltip-br')[0].style='font-size:60px;background-color:#ff0000;height: 75px;border-radius: 6px;padding: 8px;color:#ffffff !important;';}
        document.getElementsByClassName('row title jk-tip')[0].style='width:auto;'
        document.getElementsByClassName('row title jk-tip')[0].getElementsByTagName('h1')[0].style='font-size:50px;line-height:60px;';
        document.getElementsByClassName('ntag text-success tooltip-br')[0].style='font-size:30px';
        document.getElementsByClassName('row tags')[0].style='top:13px';
        document.getElementsByClassName('refs')[0].style='text-align:right;top:0;'
        if(document.getElementsByClassName('panel b-a clear')[0] != undefined){document.getElementsByClassName('panel b-a clear')[0].remove(); }
        console.log('优化完成!');

    }
})();