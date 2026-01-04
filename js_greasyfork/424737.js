// ==UserScript==
// @name         网页净化
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去除常用站点无用信息，目前支持https://translate.google.cn/、https://cn.bing.com/、https://blog.csdn.net/。全局背景色（看情况）
// @author       来世一笑
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://*/*
// @match        http://*/*
// @downloadURL https://update.greasyfork.org/scripts/424737/%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424737/%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    //全局
    document.body.style.backgroundColor="#fffff7"
    //https://blog.csdn.net/
    if(document.getElementsByClassName("left-toolbox").length!==0)document.getElementsByClassName("left-toolbox")[0].remove()
    //https://translate.google.cn/
    if(document.getElementsByClassName("gb_Kd gb_4d gb_Td gb_Sd").length!==0)document.getElementsByClassName("gb_Kd gb_4d gb_Td gb_Sd")[0].remove()
    if(document.getElementsByClassName("VjFXz").length!==0)document.getElementsByClassName("VjFXz")[0].remove()
    if(document.getElementsByClassName("a88hkc").length!==0)document.getElementsByClassName("a88hkc")[0].remove()
    if(document.getElementsByClassName("rQKk7 zJmlgc").length!==0)document.getElementsByClassName("rQKk7 zJmlgc")[0].remove()
    if(document.getElementsByClassName("zQTmif SSPGKf RvYhPd BIdYQ aL9XFd").length!==0)document.getElementsByClassName("zQTmif SSPGKf RvYhPd BIdYQ aL9XFd")[0].style.backgroundColor="#fffff7"
    if(document.getElementsByClassName("WFnNle").length!==0)document.getElementsByClassName("WFnNle")[0].style.backgroundColor="#fffff7"
    //https://cn.bing.com/
    if(document.getElementsByTagName("title")[0].innerText.indexOf("Bing 地图")>=0){
        document.getElementById("id_h").remove()
        document.getElementById("sb_privacy").parentElement.remove()
        document.getElementById("sb_legal").parentElement.remove()
        document.getElementById("sb_advertise").parentElement.remove()
        document.getElementById("sb_help").parentElement.remove()
        document.getElementsByClassName("b_trademark")[0].remove()
    }else{
        if(document.getElementById("ilp_t")!=null)document.getElementById("ilp_t").firstElementChild.firstElementChild.remove()
        if(document.getElementById("landing_tabs")!=null)document.getElementById("landing_tabs").remove()
        if(document.getElementsByClassName("acalp_contact").length!==0)document.getElementsByClassName("acalp_contact")[0].remove()
        if(document.getElementById("ads_banner")!=null)document.getElementById("ads_banner").parentElement.remove()
        if(document.getElementById("sbox")!=null)document.getElementById("sbox").remove()
        if(document.getElementById("hdr_spl")!=null)document.getElementById("hdr_spl").remove()
        if(document.getElementById("office")!=null)document.getElementById("office").remove()
        if(document.getElementById("outlook")!=null)document.getElementById("outlook").remove()
        if(document.getElementsByClassName("ads_dwn bottom_ad").length!==0)document.getElementsByClassName("ads_dwn bottom_ad")[0].remove()
        if(document.getElementsByClassName("ads_dwn center_ad").length!==0)document.getElementsByClassName("ads_dwn center_ad")[0].remove()
        if(document.getElementsByClassName("ads_dwn top_ad").length!==0)document.getElementsByClassName("ads_dwn top_ad")[0].remove()
        if(document.getElementsByClassName("aca_contact").length!==0)document.getElementsByClassName("aca_contact")[0].remove()
        if(document.getElementsByClassName("aca_filterBar").length!==0)document.getElementsByClassName("aca_filterBar")[0].remove()
        if(document.getElementsByClassName("aca_related").length!==0)document.getElementsByClassName("aca_related")[0].remove()
        if(document.getElementById("batch_cite_button")!=null)document.getElementById("batch_cite_button").remove()
        if(document.getElementsByClassName("shwFltBar b_sbText").length!==0)document.getElementsByClassName("shwFltBar b_sbText")[0].setAttribute("style","zoom: 1.05; background-color: rgb(255, 255, 247);")
        if(document.getElementById("miniheader")!=null)document.getElementById("miniheader").remove()
        if(document.getElementById("fbpgbt")!=null)document.getElementById("fbpgbt").remove()
        if(document.getElementById("est_switch")!=null)document.getElementById("est_switch").remove()
        if(document.getElementById("ev_talkbox_wrapper")!=null)document.getElementById("ev_talkbox_wrapper").remove()
        if(document.getElementById("sb_form")!=null)document.getElementById("sb_form").style.display="none"
        if(document.getElementById("id_h")!=null)document.getElementById("id_h").remove()
        if(document.getElementById("b_footer")!=null)document.getElementById("b_footer").remove()
        if(document.getElementById("mfa_srch")!=null)document.getElementById("mfa_srch").remove()
        if(document.getElementById("epf")!=null)document.getElementById("epf").parentElement.parentElement.remove()
        if(document.getElementsByClassName("b_rs").length!==0)document.getElementsByClassName("b_rs")[0].parentElement.remove()
        while(document.getElementsByClassName("sb_add sb_adTA").length!==0)document.getElementsByClassName("sb_add sb_adTA")[0].parentElement.remove()
        if(document.getElementsByClassName("b_msg b_canvas").length!==0)document.getElementsByClassName("b_msg b_canvas")[0].remove()
        if(document.getElementById("fbmoplk")!=null)document.getElementById("fbmoplk").remove()
        if(document.getElementsByClassName("b_footnote").length!==0)document.getElementsByClassName("b_footnote")[0].remove()
        if(document.getElementById("b_header")!=null)document.getElementById("b_header").style.backgroundColor="transparent"
        if(document.getElementsByClassName("tipContainer b_cards").length!==0)document.getElementsByClassName("tipContainer b_cards")[0].remove()
        if(document.getElementById("b_tween")!=null)document.getElementById("b_tween").setAttribute("class","")
        if(document.getElementById("b_content")!=null)document.getElementById("b_content").setAttribute("style","padding-top: 41px;")
        if (document.getElementsByClassName("scope_chevdown").length!==0)document.getElementsByClassName("scope_chevdown")[0].setAttribute("class","scope_chevdown b_hide")
        if (document.getElementsByClassName("scope_chevup b_hide").length!==0)document.getElementsByClassName("scope_chevup b_hide")[0].setAttribute("class","scope_chevup")
        if (document.getElementById("bza_AutoZoom") != null) document.getElementById("bza_AutoZoom").setAttribute("aria-pressed", "true")
        if (document.getElementById("bza_AutoZoom_ctrl") != null) document.getElementById("bza_AutoZoom_ctrl").setAttribute("class", "bza_img toggle_img toggle_on")
        if(document.getElementsByTagName("li").length!==0)for(let temp=0;temp<document.getElementsByTagName("li").length;temp++)document.getElementsByTagName("li")[temp].style.backgroundColor="transparent"
        if(document.getElementsByClassName("b_ans").length!==0)for (let temp=0;temp<document.getElementsByClassName("b_ans").length;temp++)if(document.getElementsByClassName("b_ans")[temp].innerHTML==="")document.getElementsByClassName("b_ans")[temp].remove()
    }})()