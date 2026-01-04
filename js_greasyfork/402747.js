// ==UserScript==
// @name         百度自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.3
// @description  Baidu auto Login
// @include      *://*.baidu.com/*
// @include      *://*.yoojia.com/*
// @include      *://*.apollo.com/*
// @include      *://pan.baidu.com/*
// @include      https://baidu.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402747/%E7%99%BE%E5%BA%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/402747/%E7%99%BE%E5%BA%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    //获取当前所有cookie
    var strCookies = document.cookie;
    if (strCookies.indexOf("BDUSS") == -1) {
      document.cookie="BAIDUID=0A60A96E0F10DAE3C785174803E54383:FG=1;domain=.baidu.com;path=/;";
      document.cookie="BAIDUID=5A817B8D7848082C061517A13587F3A9:FG=1;domain=.yoojia.com;path=/;";
      document.cookie="BAIDUID_BFESS=0A60A96E0F10DAE3C785174803E54383:FG=1;domain=.baidu.com;path=/;";
      document.cookie="BAIDU_WISE_UID=wapp_1709619049995_547;domain=.baidu.com;path=/;";
      document.cookie="BA_HECTOR=80002g0001252405810h0g0kgdkg141iuddic1s;domain=.baidu.com;path=/;";
      document.cookie="BDORZ=FAE1F8CFA4E8841CC28A015FEAEE495D;domain=.baidu.com;path=/;";
      document.cookie="BDPPN=af0f33c98c2f93dcb3b7be46c48167c7;domain=aiqicha.baidu.com;path=/;";
      document.cookie="BDRCVFR[X_XKQks0S63]=mk3SLVN4HKm;domain=.baidu.com;path=/;";
      document.cookie="BDRCVFR[tFA6N9pQGI3]=mk3SLVN4HKm;domain=.baidu.com;path=/;";
      document.cookie="BDRCVFR[w2jhEs_Zudc]=mk3SLVN4HKm;domain=.baidu.com;path=/;";
      document.cookie="BDSVRTM=34;domain=xueshu.baidu.com;path=/;";
      document.cookie="BDUSS=UR1fnhDNmp5Ym9kbTh3amRMbWVuVlU2OW10bktCV3RUdmRmZUJIU1NFSnVRdzVtSVFBQUFBJCQAAAAAAAAAAAEAAACtsDzOem0xNDc3ODc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG625mVutuZlT;domain=.apollo.auto;path=/;";
      document.cookie="BDUSS=UR1fnhDNmp5Ym9kbTh3amRMbWVuVlU2OW10bktCV3RUdmRmZUJIU1NFSnVRdzVtSVFBQUFBJCQAAAAAAAAAAAEAAACtsDzOem0xNDc3ODc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG625mVutuZlT;domain=.baidu.com;path=/;";
      document.cookie="BDUSS=UR1fnhDNmp5Ym9kbTh3amRMbWVuVlU2OW10bktCV3RUdmRmZUJIU1NFSnVRdzVtSVFBQUFBJCQAAAAAAAAAAAEAAACtsDzOem0xNDc3ODc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG625mVutuZlT;domain=.yoojia.com;path=/;";
      document.cookie="BDUSS_BFESS=UR1fnhDNmp5Ym9kbTh3amRMbWVuVlU2OW10bktCV3RUdmRmZUJIU1NFSnVRdzVtSVFBQUFBJCQAAAAAAAAAAAEAAACtsDzOem0xNDc3ODc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG625mVutuZlT;domain=.baidu.com;path=/;";
      document.cookie="BD_HOME=0;domain=xueshu.baidu.com;path=/;";
      document.cookie="BD_UPN=12314753;domain=www.baidu.com;path=/;";
      document.cookie="BIDUPSID=0A60A96E0F10DAE3A95CB67F4046DE10;domain=.baidu.com;path=/;";
      document.cookie="CITY=%7B%22code%22%3A%22131%22%2C%22name%22%3A%22%E5%8C%97%E4%BA%AC%22%7D;domain=.yoojia.com;path=/;";
      document.cookie="CTOKEN=55b84215c017a4956d7a7ee188e03295;domain=anquan.baidu.com;path=/;";
      document.cookie="CookiePolicy=1;domain=www.apollo.auto;path=/;";
      document.cookie="EXP_NAV_AUTH_NEW=1;domain=jingyan.baidu.com;path=/;";
      document.cookie="HISTORY=fc0448ed7be55d9fd31944ed0befb4e656986c4bef0f6787a3;domain=.passport.baidu.com;path=/;";
      document.cookie="HISTORY_BFESS=fc0448ed7be55d9fd31944ed0befb4e656986c4bef0f6787a3;domain=.passport.baidu.com;path=/;";
      document.cookie="HOSUPPORT=1;domain=.passport.baidu.com;path=/;";
      document.cookie="HOSUPPORT_BFESS=1;domain=.passport.baidu.com;path=/;";
      document.cookie="HR_SIGN=PASS_UR1fnhDNmp5Ym9kbTh3amRMbWVuVlU2OW10bktCV3RUdmRmZUJIU1NFSnVRdzVtSVFBQUFBJCQAAAAAAAAAAAEAAACtsDzOem0xNDc3ODc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG625mVutuZlT;domain=.yingxiao.baidu.com;path=/;";
      document.cookie="H_PS_PSSID=39662_40210_40206_40215_40222_40294_40289_40285_40317_40319_40080_40364_40351;domain=.baidu.com;path=/;";
      document.cookie="H_WISE_SIDS=110085_287977_288665_294244_287174_269893_294392_295129_292241_295350_295402_295367_295376_295396_295502_290400_295732_277936_295724_296175_291026_281879_296149_283867_294566_296674_297002_296958_297241_297247_283782_294860_297496_297534_292709_297581_295509_297577_294361_295498_297691_284553_296454_297875_297982_297985_297979_297128_292964_292166_294756_290401_298301_298351_298398_298369_298395_298364_298527_298629_298623_298892_298111_298193_299018_289478_298946_299128_107311_299120_298693_299349_299383_298225_298227_299465_299444;domain=.baidu.com;path=/;";
      document.cookie="H_WISE_SIDS_BFESS=110085_287977_288665_294244_287174_269893_294392_295129_292241_295350_295402_295367_295376_295396_295502_290400_295732_277936_295724_296175_291026_281879_296149_283867_294566_296674_297002_296958_297241_297247_283782_294860_297496_297534_292709_297581_295509_297577_294361_295498_297691_284553_296454_297875_297982_297985_297979_297128_292964_292166_294756_290401_298301_298351_298398_298369_298395_298364_298527_298629_298623_298892_298111_298193_299018_289478_298946_299128_107311_299120_298693_299349_299383_298225_298227_299465_299444;domain=.baidu.com;path=/;";
      document.cookie="JSESSIONID=5F282AC0406356D3D35A6632560E2425;domain=cbbs.baidu.com;path=/;";
      document.cookie="LOCALGX=%u4E0A%u6D77%7C%32%33%35%34%7C%u4E0A%u6D77%7C%32%33%35%34;domain=.news.baidu.com;path=/;";
      document.cookie="MCITY=-289%3A;domain=.baidu.com;path=/;";
      document.cookie="M_LG_SALT=268dad37637c14ddd79b1fc9c8093212;domain=map.baidu.com;path=/;";
      document.cookie="M_LG_UID=3460083885;domain=map.baidu.com;path=/;";
      document.cookie="PANPSC=14643142591172611934%3ACU2JWesajwBhLC9r5nXzdUy7txDAjOFZzMcBqG5aI%2B4sT%2BaAL4bHrBM4dDjxBdlpBp3oGpzhhicIhOIna7V5qR8eyRB184c6kmKWVSc%2BNCRFah9uWgECZwelhSA6FDy85L%2BYKub7X%2F2i%2BY1X7udr9G2gud9gLjYtALuryAQJaBImU589kUerfmRQlJOOd4%2FA625AVJzIhX8%3D;domain=.photo.baidu.com;path=/;";
      document.cookie="PANPSC=17518932403623879025%3ACU2JWesajwBhLC9r5nXzdUy7txDAjOFZzMcBqG5aI%2B4sT%2BaAL4bHrBM4dDjxBdlpBp3oGpzhhicZLh5t5MNKZh8eyRB184c6kmKWVSc%2BNCRFah9uWgECZwelhSA6FDy85L%2BYKub7X%2F2i%2BY1X7udr9G2gud9gLjYtpqvB0tQPnfltcQe%2BbgwEaTCo8bcT1HMK;domain=.pan.baidu.com;path=/;";
      document.cookie="PANWEB.sig=mEnYrSeaQqssYZire89rFPmLY9htA0FzmyWp6jBsV1U;domain=photo.baidu.com;path=/;";
      document.cookie="PANWEB=1;domain=photo.baidu.com;path=/;";
      document.cookie="PHPSESSID=b4agelfbrlabasebqbu8hqppc4;domain=baijiahao.baidu.com;path=/;";
      document.cookie="PHPSESSID=ddfarpcf69ughg4e2bfm647o64;domain=test.baidu.com;path=/;";
      document.cookie="PSTM=1709618764;domain=.baidu.com;path=/;";
      document.cookie="PTOKEN=6f6b31c113c71494fc311924e6978f77;domain=.passport.baidu.com;path=/;";
      document.cookie="PTOKEN_BFESS=6f6b31c113c71494fc311924e6978f77;domain=.passport.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=3&tt=709&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=3itl&ul=3qr8&hd=3qs2\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=3&tt=709&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=3itl&ul=4rz5&hd=4rzl\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=3&tt=709&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=3itl\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=4&tt=9oj&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=sw6&ul=6oxt&hd=6oya\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=7&tt=c05&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=124o&ul=7g00&hd=7g11\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=7&tt=c05&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=124o&ul=8d0g&hd=8d0p\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=9&tt=pk1&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=1mlg\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=9&tt=u9s&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=1xrj\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=a&tt=ub0&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=5imd&ul=8kxt&hd=8ky3\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=a&tt=ub0&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=5imd\";domain=.baidu.com;path=/;";
      document.cookie="RT=\"z=1&dm=baidu.com&si=e85ded5a-5f2e-4206-b5f1-4bcb774df3f0&ss=ltdz0hpz&sl=d&tt=vzi&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=9bdj\";domain=.baidu.com;path=/;";
      document.cookie="SAVEUSERID=dd098be94139df6f217874358aca7d438bf9f3bb5d;domain=.passport.baidu.com;path=/;";
      document.cookie="SAVEUSERID_BFESS=dd098be94139df6f217874358aca7d438bf9f3bb5d;domain=.passport.baidu.com;path=/;";
      document.cookie="SE_LAUNCH=5%3A28493650;domain=.baidu.com;path=/;";
      document.cookie="STOKEN=16545ff302dcdf75f282704cfe43d998e6d017c8999be207723e34c8c3c74ced;domain=.passport.baidu.com;path=/;";
      document.cookie="STOKEN=a053cdd18ea34d212cf7928b53a4e0ab2b0fb7d8923948003d7b932d8704b970;domain=.tieba.baidu.com;path=/;";
      document.cookie="STOKEN=b43c25f3f8a9b19f06b85a3d0db9c3402bc0d3c201752a28a3c39339126c94b0;domain=photo.baidu.com;path=/;";
      document.cookie="STOKEN=b43c25f3f8a9b19f06b85a3d0db9c340859e40b6c430a4560d141c1f910ca422;domain=.pan.baidu.com;path=/;";
      document.cookie="STOKEN_BFESS=16545ff302dcdf75f282704cfe43d998e6d017c8999be207723e34c8c3c74ced;domain=.passport.baidu.com;path=/;";
      document.cookie="SUUUID_V3=\"NjI0YzU0ZDMxOTA1MDhmNTE0MjA1ZTI0\\012\";domain=su.baidu.com;path=/;";
      document.cookie="UBI=fi_PncwhpxZ%7ETaJcy6C8SoEcC6DCr1FEFgjLifuFMvXomWoj-2lDTCHAPtprxTHpc7WJ8aUkkhV8cnVV6p6;domain=.passport.baidu.com;path=/;";
      document.cookie="UBI_BFESS=fi_PncwhpxZ%7ETaJcy6C8SoEcC6DCr1FEFgjLifuFMvXomWoj-2lDTCHAPtprxTHpc7WJ8aUkkhV8cnVV6p6;domain=.passport.baidu.com;path=/;";
      document.cookie="USERNAMETYPE=2;domain=.passport.baidu.com;path=/;";
      document.cookie="USERNAMETYPE_BFESS=2;domain=.passport.baidu.com;path=/;";
      document.cookie="USER_JUMP=-1;domain=tieba.baidu.com;path=/;";
      document.cookie="XFCS=52808708D90DA9A627426C0F039EBBF1260972777A0889AFD68D77E54E588172;domain=tieba.baidu.com;path=/;";
      document.cookie="XFCS=AA8243C16B8997737D8F175EFABDC648F4E30EE6DC3F0506E660D7C3C1BBA92D;domain=pan.baidu.com;path=/;";
      document.cookie="XFCS=D03AA722DB1436355A87C11F640F9406BD7417CE4BCC4A793C22A8DCDEBE4F60;domain=yiyan.baidu.com;path=/;";
      document.cookie="XFCS=DAA222A13B9D3461A542535A9268B6A89F5C17E1AFF6C0FA5C82A93C26A2D3B1;domain=tieba.baidu.com;path=/;";
      document.cookie="XFCS=F47499B0F7003D0D2F649FA70B17CE5EBFA0499428E40EACF9A89893FBB6C264;domain=baijiahao.baidu.com;path=/;";
      document.cookie="XFI=031b9140-dab8-11ee-8796-83cb2960c36a;domain=tieba.baidu.com;path=/;";
      document.cookie="XFI=0766c4f0-dab7-11ee-8a33-f75316db9b5b;domain=baijiahao.baidu.com;path=/;";
      document.cookie="XFI=1ce47a70-dab7-11ee-9f68-5f1d381749c6;domain=tieba.baidu.com;path=/;";
      document.cookie="XFI=2d792b10-dab7-11ee-a4b9-534d766419a0;domain=yiyan.baidu.com;path=/;";
      document.cookie="XFI=d0f2211f-2645-83bc-c871-587d7a14c328;domain=pan.baidu.com;path=/;";
      document.cookie="XFT=3ttBE+tCd6amLB1kbbqDuOkbqBglkzsOSliPWUunDGM=;domain=baijiahao.baidu.com;path=/;";
      document.cookie="XFT=OhsuY0AKZWc5YPvNRcqe/1e3UgRpjFESM3En0FP90Ac=;domain=tieba.baidu.com;path=/;";
      document.cookie="XFT=li0QjqI+uOBbsZPTfNHxKFw0S1Q61c7vVjLsxj63DpQ=;domain=pan.baidu.com;path=/;";
      document.cookie="XFT=m3EacBo5c/VI7R1uWrAeFp+p1V3QSep8hogvVKQLCdw=;domain=tieba.baidu.com;path=/;";
      document.cookie="YII_CSRF_TOKEN=eef53bb8963cbed03055544d4e9ad0707f31f3e4;domain=test.baidu.com;path=/;";
      document.cookie="ZD_ENTRY=empty;domain=.baidu.com;path=/;";
      document.cookie="ZFY=vpKgizMthm2rauirWJXPfpOn9GDOxv8GgKkHSmXeUdI:C;domain=.baidu.com;path=/;";
      document.cookie="__bid_n=18e0d3ce4d48064add77d0;domain=.baidu.com;path=/;";
      document.cookie="__bsi=10584181861511298918_00_12_R_R_4_0303_c02f_Y;domain=.m.baidu.com;path=/;";
      document.cookie="__yjs_duid=1_085b9d24294bad6cb040a041f490c0691709619042825;domain=.baidu.com;path=/;";
      document.cookie="_ga=GA1.3.2005952442.1709619020;domain=.dumall.baidu.com;path=/;";
      document.cookie="_gid=GA1.3.1142904321.1709619020;domain=.dumall.baidu.com;path=/;";
      document.cookie="_i=TJuzKN2kAV61ZFzw%2BHDPZQ%3D%3D;domain=.baidu.com;path=/;";
      document.cookie="_ii=TJuzKN2kAV61ZFzw%2BHDPZQ%3D%3D;domain=dumall.baidu.com;path=/;";
      document.cookie="_t4z_qc8_=xlTM-TogKuTwRygtYSNjy2rcLQbkkt4Hngmd;domain=aiqicha.baidu.com;path=/;";
      document.cookie="ab170961840=a8095eb3ef9c476b0b47b185981caed11709619004206;domain=aiqicha.baidu.com;path=/;";
      document.cookie="appKey=0;domain=dumall.baidu.com;path=/;";
      document.cookie="arialoadData=false;domain=.baidu.com;path=/;";
      document.cookie="babyFirstReferHost=;domain=baobao.baidu.com;path=/;";
      document.cookie="bjhStoken=7096907eaa5973f6d3ba334e40c1a3a65bd24c4dad7c567809a128d5c563a66f;domain=.baijiahao.baidu.com;path=/;";
      document.cookie="canary=0;domain=baijiahao.baidu.com;path=/;";
      document.cookie="channelId=0;domain=dumall.baidu.com;path=/;";
      document.cookie="ci_session=9b4ddk6cmbgvi2oj948j7100upfvktq5;domain=anquan.baidu.com;path=/;";
      document.cookie="csrfToken=wXWJR0nRx3nHSd-qqror88zj;domain=pan.baidu.com;path=/;";
      document.cookie="csrfToken=xqeQA-LsOmrKm8NfuN0mbdAg;domain=photo.baidu.com;path=/;";
      document.cookie="date=2024-03-05;domain=su.baidu.com;path=/;";
      document.cookie="delPer=0;domain=.baidu.com;path=/;";
      document.cookie="devStoken=7223ff8eb7d4934d1ee6359aa63abf8a5bd24c4dad7c567809a128d5c563a66f;domain=.baijiahao.baidu.com;path=/;";
      document.cookie="firstShowTip=1;domain=image.baidu.com;path=/;";
      document.cookie="gray=1;domain=baijiahao.baidu.com;path=/;";
      document.cookie="guid=d7fba7f642cc6f25b3b7d83439ac0b082024-03-05T14:10:43.585871Z;domain=su.baidu.com;path=/;";
      document.cookie="historyUrl=[\"/home\"];domain=yingxiao.baidu.com;path=/;";
      document.cookie="logTraceID=50d6167cb66d8a79e6ae8b350b5eb7f0670a630c8e435a45a5;domain=.passport.baidu.com;path=/;";
      document.cookie="log_first_time=1709619004593;domain=.baidu.com;path=/;";
      document.cookie="log_guid=c5d3c061dc0b9c5a79e8fb2b29c095aa;domain=aiqicha.baidu.com;path=/;";
      document.cookie="log_last_time=1709619005587;domain=.baidu.com;path=/;";
      document.cookie="loginType=0;domain=anquan.baidu.com;path=/;";
      document.cookie="login_type=passport;domain=aiqicha.baidu.com;path=/;";
      document.cookie="logintype=passport;domain=su.baidu.com;path=/;";
      document.cookie="ndut_fmt=E2576770ED53C62D4A62415EEB4C65963198F9A45A6606EC4202887E9862EC0F;domain=pan.baidu.com;path=/;";
      document.cookie="newlogin=1;domain=.baidu.com;path=/;";
      document.cookie="openTabIndex=tab_hot_quest;domain=baijiahao.baidu.com;path=/;";
      document.cookie="plus_cv=1::m:0ae33561;domain=.m.baidu.com;path=/;";
      document.cookie="plus_lsv=f13b091cd99baee3;domain=.m.baidu.com;path=/;";
      document.cookie="pplogid=3582adZs8UY1qVsPqnawyQvaVsCi5heIb82dUAdTUMaja7ectfnFsGMDMBllcundrm1fF5yep%2FfIaqCYTfvGEG8z8VZcJOSf9Soy7Gm2etbH%2FMraL4i0RnvHaFh8ouCkkVLP;domain=passport.baidu.com;path=/;";
      document.cookie="pplogid_BFESS=3582adZs8UY1qVsPqnawyQvaVsCi5heIb82dUAdTUMaja7ectfnFsGMDMBllcundrm1fF5yep%2FfIaqCYTfvGEG8z8VZcJOSf9Soy7Gm2etbH%2FMraL4i0RnvHaFh8ouCkkVLP;domain=.passport.baidu.com;path=/;";
      document.cookie="referrer=https%3A%2F%2Fsu.baidu.com%2F;domain=su.baidu.com;path=/;";
      document.cookie="rk=f2b4b0447fba47a0bd9da0ae3be6f0cf;domain=dumall.baidu.com;path=/;";
      document.cookie="rsv_i=c61blq+CSOGEmOz5RpO3JGc37q6HG1BB6X4WzaxV5RTyGJNmljH7N6LfGx8g5LD9PxOoPasf4mA1fidIU5Mu8mJvnjzqzb8;domain=.baidu.com;path=/;";
      document.cookie="saasid=acb38a9d3d3a358df7fe9a288e87a847;domain=anquan.baidu.com;path=/;";
      document.cookie="sbuss=eyJ1c2VybmFtZSI6ICJ6bTE0Nzc4NzhAcGFzc3BvcnQiLCAicmFuZCI6ICI2c2x3dDRpMyIsICJzaWduIjogImVjYjc1YmU0NzE0MjdiMzEwYWZkY2QzM2ViMDFjZThmIiwgImlkIjogIjYyNGM1NGQzMTkwNTA4ZjUxNDIwNWUyNCIsICJsZXZlbCI6IDF9;domain=su.baidu.com;path=/;";
      document.cookie="seed=2ef09726a928b3d8b5c295ac9ed00148;domain=su.baidu.com;path=/;";
      document.cookie="session_id=17096190634133722417942996121;domain=zhidao.baidu.com;path=/;";
      document.cookie="showFollow=false;domain=dumall.baidu.com;path=/;";
      document.cookie="ssid=eyJpdiI6Im9RU3B0ZVk3V25jN1BLTW5wcWpZRVE9PSIsInZhbHVlIjoiMXNtQndaNGc5cHlqbHFUNlZpNXI1eDdXSlpUWUhyb0NDaWd4ZFI1dmVGMUNDbDRmTHN6djV5b0RWeWViTTZsd28yK0JaSXNyMDFQdG1EUFRVNjF5REpiekRJT0FMay9Md0ZIT2lHVU9hWUdDREZJdU1vWjdwMDRWZ01zcklvVWkiLCJtYWMiOiJjYWE0MjZmMDZhMzUzYjRiZjQ0NWQ5NGVmYzJhYzQ1YjI5ZTI0MzU1ZTQyOWE3YjM3ODgyNmU0YTI2NTgxNGIxIiwidGFnIjoiIn0%3D;domain=www.apollo.auto;path=/;";
      document.cookie="userFrom=null;domain=.baidu.com;path=/;";
      document.cookie="userType=0;domain=anquan.baidu.com;path=/;";
      document.cookie="validate=21384;domain=map.baidu.com;path=/;";
      document.cookie="zhishiTopicRequestTime=1709619013782;domain=baike.baidu.com;path=/;";
      location.reload();
    }
})();
