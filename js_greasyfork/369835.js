// ==UserScript==
// @name         Report fb phan dong
// @namespace    https://greasyfork.org/scripts/369835-report-fb-phan-dong/code/Report%20fb%20phan%20dong.user.js
// @version      0.1.1.3
// @description  Script report facebook lũ phản động chống phá nhà nước CHXHCNVN
// @author       You
// @match        *://*.facebook.com/thientran74*
// @match        *://*.facebook.com/100026401080034*
// @match        *://*.facebook.com/100014464271169*
// @match        *://*.facebook.com/lisa.pham.75470316*
// @match        *://*.facebook.com/100026262104047*
// @match        *://*.facebook.com/100026277126158*
// @match        *://*.facebook.com/100010489180519*
// @match        *://*.facebook.com/100014670072298*
// @match        *://*.facebook.com/pg/viettan*
// @match        *://*.facebook.com/SBTNOfficial*
// @match        *://*.facebook.com/ngocviendongVNCH*
// @match        *://*.facebook.com/QLVNCH.3*
// @match        *://*.facebook.com/1782901738516590*
// @match        *://*.facebook.com/KhoiPhucChinhTheVietNamCongHoa*
// @match        *://*.facebook.com/thuongphebinh*
// @match        *://*.facebook.com/quanlucvnch*
// @match        *://*.facebook.com/mnvntn1975*
// @match        *://*.facebook.com/VietNamCongHoaThoiBao*
// @match        *://*.facebook.com/NhaBaoTuDoVN*
// @match        *://*.facebook.com/BoThongTin.VNCHLV*
// @match        *://*.facebook.com/BaoVem*
// @match        *://*.facebook.com/1654487421262126*
// @match        *://*.facebook.com/113958848708939*
// @match        *://*.facebook.com/hoianhemdanchu*
// @match        *://*.facebook.com/cafekubua*
// @match        *://*.facebook.com/discoveringlife*
// @match        *://*.facebook.com/VietNamSuLieu*
// @match        *://*.facebook.com/motgocnhinvn*
// @match        *://*.facebook.com/139796173489417*
// @match        *://*.facebook.com/VietNamDauThuong*
// @match        *://*.facebook.com/thong.luan.1*
// @match        *://*.facebook.com/beerparty.vn*
// @match        *://*.facebook.com/sotaybannuoc*
// @match        *://*.facebook.com/haidau170704*
// @match        *://*.facebook.com/258083244338526*
// @match        *://*.facebook.com/chongphandong.fanpage*
// @match        *://*.facebook.com/www.vietlive.tv*
// @match        *://*.facebook.com/RFIvi*
// @match        *://*.facebook.com/BBCVietnamese*
// @match        *://*.facebook.com/RFAVietnam*
// @match        *://*.facebook.com/truyenthonggioitreconggiaovinh*
// @match        *://*.facebook.com/phapamthoai*
// @match        *://*.facebook.com/payenguoiconggiao*
// @match        *://*.facebook.com/menChuayeuquehuong*
// @match        *://*.facebook.com/thanhnienconggiao*
// @match        *://*.facebook.com/danchuchovn*
// @match        *://*.facebook.com/1837696516536707*
// @match        *://*.facebook.com/VNAdvocacyDay*
// @match        *://*.facebook.com/343012852838737*
// @match        *://*.facebook.com/luatkhoa.org*
// @match        *://*.facebook.com/danlambaovn*
// @match        *://*.facebook.com/tinmungchonguoingheo*
// @match        *://*.facebook.com/namquocsonhavietnam*
// @match        *://*.facebook.com/148688402507015*
// @match        *://*.facebook.com/tapchimidan*
// @match        *://*.facebook.com/90trieunguoi*
// @match        *://*.facebook.com/dothanhsaigon1*
// @match        *://*.facebook.com/HCMCONCHO*
// @match        *://*.facebook.com/VietNamCongHoaThoiBao*
// @match        *://*.facebook.com/nhatkyyeunuoc1*
// @match        *://*.facebook.com/959340927412515*
// @match        *://*.facebook.com/1432615946958470*
// @match        *://*.facebook.com/188356101196163*
// @match        *://*.facebook.com/1499047880403666*
// @match        *://*.facebook.com/toiacdcsvn*
// @match        *://*.facebook.com/toiaccongsan28*
// @match        *://*.facebook.com/lisaphamkdt*
// @match        *://*.facebook.com/594340200941375*
// @match        *://*.facebook.com/189397101690510*
// @match        *://*.facebook.com/hoinhungnguoighetphandong*
// @match        *://*.facebook.com/dothanhsg*
// @match        *://*.facebook.com/VOATiengViet*
// @match        *://*.facebook.com/VietTanJapan*
// @match        *://*.facebook.com/toiaccongsanfacechongcong*
// @match        *://*.facebook.com/164426107600509*
// @match        *://*.facebook.com/toiaccongsanvietnam1*
// @match        *://*.facebook.com/ToiAcCongSanVietNam*
// @match        *://*.facebook.com/toiacdangcongsanvietnam*
// @match        *://*.facebook.com/groups/toiacdangcsvn*
// @match        *://*.facebook.com/groups/381541945696068*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/37907-arrive-js/code/arrivejs.js?version=246397
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369835/Report%20fb%20phan%20dong.user.js
// @updateURL https://update.greasyfork.org/scripts/369835/Report%20fb%20phan%20dong.meta.js
// ==/UserScript==
var intv;
//reports personal accounts
if(/thientran74|100026401080034|100014464271169|lisa.pham.75470316|100026262104047|100026277126158|100010489180519|100014670072298/i.test(window.location.href)){
    console.log('ok');
    $(document).arrive('._1yzl', function(){
        intv = setInterval(function(){$('._1yzl').click();},500);
        $(document).unbindArrive('._1yzl');
    });

    $(document).arrive('._54nc[href^="/ajax/nfx/start_dialog?story_location=profile_someone_else&reportable"] ._54nh', function(){
        clearInterval(intv);
        $('._54nc[href^="/ajax/nfx/start_dialog?story_location=profile_someone_else&reportable"] ._54nh').click();
        $(document).unbindArrive('._54nc[href^="/ajax/nfx/start_dialog?story_location=profile_someone_else&reportable"] ._54nh');
    });
    $(document).arrive('#nfxQuestionNamedaccount > label._55sh._5ww6._5p_b.uiInputLabelInput > span', function(){
        $('#nfxQuestionNamedaccount > label._55sh._5ww6._5p_b.uiInputLabelInput > span').click();
        $('._42ft._4jy0.layerConfirm').click();
        $(document).unbindArrive('#nfxQuestionNamedaccount > label._55sh._5ww6._5p_b.uiInputLabelInput > span');
    });

    $(document).arrive('#nfxQuestionNamedfake > label._55sh._5ww6._5p_b.uiInputLabelInput > span', function(){
        $('#nfxQuestionNamedfake > label._55sh._5ww6._5p_b.uiInputLabelInput > span').click();
        $('._42ft._4jy0.layerConfirm').click();
        $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
            setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();},500);
            $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
        });
        $(document).unbindArrive('#nfxQuestionNamedfake > label._55sh._5ww6._5p_b.uiInputLabelInput > span');
    });
}
//reports groups
if(/toiacdangcsvn|381541945696068/i.test(window.location.href)){
    console.log('ok 2');
    $(document).arrive('#pagelet_group_actions i', function(){
        intv = setInterval(function(){$('#pagelet_group_actions i').click();},500);
        $(document).unbindArrive('#pagelet_group_actions i');
    });

    $(document).arrive('._54nc[href^="/ajax/report.php"] span', function(){
        clearInterval(intv);
        $('._54nc[href^="/ajax/report.php"] span').click();
        $(document).unbindArrive('._54nc[href^="/ajax/report.php"] span');
    });
    $(document).arrive('#nfxQuestionNamedhate span', function(){
        $('#nfxQuestionNamedhate span').click();
        $('#nfx_dialog_continue').click();
        $(document).unbindArrive('#nfxQuestionNamedhate span');
    });
    $(document).arrive('#nfxQuestionNamedrace span', function(){
        $('#nfxQuestionNamedrace span').click();
        $('#nfx_dialog_continue').click();
        $(document).unbindArrive('#nfxQuestionNamedrace span');
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();},500);
        $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
    });
}
//reports pages
if(/dothanhsg|quanlucvnch|mnvntn1975|VietNamCongHoaThoiBao|NhaBaoTuDoVN|BoThongTin.VNCHLV|BaoVem|1654487421262126|113958848708939|hoianhemdanchu|cafekubua|discoveringlife|VietNamSuLieu|motgocnhinvn|139796173489417|VietNamDauThuong|thong.luan.1|beerparty.vn|sotaybannuoc|haidau170704|258083244338526|chongphandong.fanpage|www.vietlive.tv|RFIvi|BBCVietnamese|RFAVietnam|truyenthonggioitreconggiaovinh|phapamthoai|payenguoiconggiao|menChuayeuquehuong|thanhnienconggiao|danchuchovn|1837696516536707|VNAdvocacyDay|343012852838737|luatkhoa.org|danlambaovn|tinmungchonguoingheo|namquocsonhavietnam|148688402507015|tapchimidan|90trieunguoi|dothanhsaigon1|HCMCONCHO|VietNamCongHoaThoiBao|nhatkyyeunuoc1|959340927412515|1432615946958470|188356101196163|1499047880403666|toiacdcsvn|toiaccongsan28|lisaphamkdt|594340200941375|594340200941375|189397101690510|hoinhungnguoighetphandong|VOATiengViet|VietTanJapan|toiaccongsanfacechongcong|164426107600509|toiaccongsanvietnam1|ToiAcCongSanVietNam|toiacdangcongsanvietnam/i.test(window.location.href)){
    console.log('ok 3');
    $(document).arrive('._p._4jy0._4jy4', function(){
        intv = setInterval(function(){$('._p._4jy0._4jy4').click();},500);
        $(document).unbindArrive('._p._4jy0._4jy4');
    });

    $(document).arrive('.uiContextualLayer ul > li:nth-child(6) ._54nh', function(){
        clearInterval(intv);
        $('.uiContextualLayer ul > li:nth-child(6) ._54nh').click();
        $(document).unbindArrive('.uiContextualLayer ul > li:nth-child(6) ._54nh');
    });
    $(document).arrive('#nfxQuestionNamedharassment span', function(){
        $('#nfxQuestionNamedharassment span').click();
        $('#nfx_dialog_continue').click();
        $(document).unbindArrive('#nfxQuestionNamedharassment span');
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();},500);
        $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
    });
}
if(/ /i.test(window.location.href)){
    console.log('ok 4');
    $(document).arrive('.fsm.fwn.fcg a[ajaxify^="/ajax/report.php"]', function(){
        intv = setInterval(function(){document.querySelector('.fsm.fwn.fcg a[ajaxify^="/ajax/report.php"]').click();},500);
        $(document).unbindArrive('.fsm.fwn.fcg a[ajaxify^="/ajax/report.php"]');
    });

    $(document).arrive('#nfxQuestionNamedinappropriate span', function(){
        clearInterval(intv);
        $('#nfxQuestionNamedinappropriate span').click();
        $('#nfx_dialog_continue').click();
        $(document).unbindArrive('#nfxQuestionNamedinappropriate span');
    });
    $(document).arrive('#nfxQuestionNamedhate span', function(){
        clearInterval(intv);
        $('#nfxQuestionNamedhate span').click();
        $('#nfx_dialog_continue').click();
        $(document).unbindArrive('#nfxQuestionNamedhate span');
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();},500);
        $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
    });
}
setTimeout(function(){location.reload();},300000);