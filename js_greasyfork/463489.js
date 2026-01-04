// ==UserScript==
// @name         全网VIP视频免费破解去广告等CTuck
// @namespace         super_video_analysis
// @version      0.2.1
// @description  支持手机移动端PC端腾讯，爱奇艺，优酷，土豆等vip视频解析；
// @author       CTuck
// @icon         https://www.chatgptzh.cn/img/img_cij.png
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @include      *v.youku.com/v_*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *v.qq.com/x/*
// @include      *v.qq.com/p*
// @include      *v.qq.com/cover*
// @include      *v.qq.com/tv/*
// @include      *film.sohu.com/album/*
// @include      *tv.sohu.com/*
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *.le.com/ptv/vplay/*
// @include      *.tudou.com/listplay/*
// @include      *.tudou.com/albumplay/*
// @include      *.tudou.com/programs/view/*
// @include      *.tudou.com/v*
// @include      *.mgtv.com/b/*
// @include      *.acfun.cn/v/*
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/anime/*
// @include      *.bilibili.com/bangumi/play/*
// @include      *.pptv.com/show/*
// @include      *.baofeng.com/play/*
// @include      *://y.qq.com/n
// @license  AGPL License
// @downloadURL https://update.greasyfork.org/scripts/463489/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%AD%89CTuck.user.js
// @updateURL https://update.greasyfork.org/scripts/463489/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%AD%89CTuck.meta.js
// ==/UserScript==

(function() {
    'use strict';

  GM_registerMenuCommand("免费观看", function () {
        var locationurl = window.location.href;
        if (locationurl) {
            GM_openInTab(`https://okjx.cc/?url=?q=${locationurl}`, { active: true });
        }
    });
    const mianColor = "#1E1E28";
    const iconbg = "#a8ffdc"
    const secondColor = "#2ab463";
    const clkColor = "#ff7300";
    const fontsColor = "#ffffff";
    const iconMarginLeft = 2;
    const iconMarginTop = 150;
    var iconWidth = 40;
    const iconHeight = 35;
    const iconFilletPercent = 0.3;
    var developMenuHeight = 220;
    var developMenuSecond = 0;
    const parseInterfaces =[
        {"name": "OK解析","url":"https://okjx.cc/?url=?q="},
        {"name": "天翼","url": "https://jsap.attakids.com/?url="},
        {"name": "m1907","url": "https://z1.m1907.cn/?jx="},
        {"name": "乐多","url": "https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
        {"name": "yparse","url": "https://jx.yparse.com/index.php?url="},
        {"name": "七哥","url": "https://jx.mmkv.cn/tv.php?url="},
        {"name": "铭人云","url": "https://parse.123mingren.com/?url="},
        {"name": "Player-JY","url": "https://jx.playerjy.com/?url="},
        {"name": "虾米","url": "https://jx.xmflv.com/?url="},
        {"name": "MAO","url": "https://www.mtosz.com/m3u8.php?url="},
        {"name": "综合/B站","url": "https://jx.bozrc.com:4433/player/?url="},
        {"name": "诺讯","url": "https://www.nxflv.com/?url="},
        {"name": "夜幕","url": "https://www.yemu.xyz/?url="},
        {"name": "BL","url": "https://svip.bljiex.cc/?v="},
        {"name": "M3U8TV","url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "爱豆","url": "https://jx.aidouer.net/?url="},
        {"name": "七彩","url": "https://www.xymav.com/?url="},
        {"name": "人人迷","url": "https://jx.blbo.cc:4433/?url="},
        {"name": "江湖云","url": "https://api.jhdyw.vip/?url="},
        {"name": "1717","url": "https://ckmov.ccyjjd.com/ckmov/?url="},
        {"name": "8090","url": "https://www.8090g.cn/?url="},
        {"name": "qianqi","url": "https://api.qianqi.net/vip/?url="},
        {"name": "laobandq","url": "https://vip.laobandq.com/jiexi.php?url="},
        {"name": "playm3u8","url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "无名小站","url": "https://www.administratorw.com/video.php?url="},
		{"name":"星空","url":"http://60jx.com/?url=", "showType":1},
		{"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url=", "showType":1},
		{"name":"奇米","url":"https://qimihe.com/?url=", "showType":1},
		{"name":"小蒋","url":"https://www.kpezp.cn/jlexi.php?url=", "showType":1},
        {"name": "全民","url": "https://jx.blbo.cc:4433/?url="},
        {"name":"百域","url": "https://jx.618g.com/?url="},
        {"name":"全民","url": "https://jx.quanmingjiexi.com/?url="},
		{"name":"游艺","url":"https://api.u1o.net/?url=", "showType":1},
		{"name":"爱豆","url":"https://jx.aidouer.net/?url=", "showType":1},
        {"name": "CK","url": "https://www.ckplayer.vip/jiexi/?url="},
        {"name": "盖世","url": "https://www.gai4.com/?url="},
        {"name": "盘古","url": "https://go.yh0523.cn/y.cy?url="},,
		{"name":"诺诺","url":"https://www.ckmov.com/?url=", "showType":1},
		{"name":"解析la","url":"https://api.jiexi.la/?url=", "showType":1},
		{"name":"MUTV","url":"https://jiexi.janan.net/jiexi/?url=", "showType":1},
		{"name":"盘古2","url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":1},
		{"name":"思云","url":"https://jx.ap2p.cn/?url=", "showType":1},
		{"name":"听乐","url":"https://jx.dj6u.com/?url=", "showType":1},
    ];
    const imgbase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAECAQIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACikzRmgBaKTNGaAFopM0ZFAC0UmaM0ALRSZozQAtFFFABRSZpaACikzRmgBaKKKACiikzQAtFJketFAC0UlGR60ALRSZozQAtFJmjNAC0UUUAFFFFABSHkUtIelAH5Aft6ft5/HX4K/tY+OvBvgzxz/Y3hvTfsP2Wy/siwn8vzLC3lf55YGc5eRzyxxnA4AFeAf8PRv2nf+imf+UDS/wD5Gpf+Co//ACfZ8Tf+4Z/6a7Sv3T+KXxT8MfBbwJqfjLxlqf8AY/hvTfK+1Xv2eWfy/MlSJPkiVnOXkQcKcZyeATQB+Ff/AA9G/ad/6KZ/5QNL/wDkaj/h6N+07/0Uz/ygaX/8jV+qx/4Ki/sxg4PxLOf+wBqn/wAjUn/D0X9mP/oph/8ABBqn/wAjUAflV/w9G/ad/wCimf8AlA0v/wCRq+//APglN+1F8Tv2lP8AhaP/AAsfxN/wkX9i/wBl/YP9AtbXyfO+1+Z/qIk3Z8qP72cbeMZOfVv+Co//ACYn8Tf+4Z/6dLSvlT/ghlx/wuz/ALgn/t/QByn7en7efx1+Cv7WPjrwb4M8c/2N4b037D9lsv7IsJ/L8ywt5X+eWBnOXkc8scZwOABXgH/D0b9p3/opn/lA0v8A+Rq9/wD29P2DPjr8av2sfHXjLwZ4G/tnw3qX2H7Le/2vYQeZ5dhbxP8AJLOrjDxuOVGcZHBBo/YL/YM+OvwV/ax8C+MvGfgb+xvDem/bvtV7/a9hP5fmWFxEnyRTs5y8iDhTjOTwCaAPAP8Ah6N+07/0Uz/ygaX/API1H/D0b9p3/opn/lA0v/5Gr9qfjl+1J8MP2bP7E/4WN4m/4R3+2vP+wf6BdXXneT5fm/6iJ9uPNj+9jO7jODjyv/h6L+zH/wBFMP8A4INU/wDkagD6qpDyKWkJwCT0FAH5Aft6ft5/HX4K/tY+OvBvgzxz/Y3hvTfsP2Wy/siwn8vzLC3lf55YGc5eRzyxxnA4AFfsBXgHxR/b0+BXwX8dan4N8ZeODo3iTTfK+1WX9kX8/l+ZEkqfPFAyHKSIeGOM4OCCK/NX9lv9lz4nfsX/AB28M/GT4yeGf+EO+G/hr7V/autfb7W++zfaLWW1h/c2sssz7priJPkQ43ZOFBIAPqn/AIKt/tR/E79ms/C7/hXHib/hHf7a/tT7f/oFrded5P2Tyv8AXxPtx5sn3cZ3c5wMfAH/AA9G/ad/6KZ/5QNL/wDkavVv+CrX7UXwx/aU/wCFXf8ACuPE3/CRf2L/AGp9v/0C6tfJ877J5X+viTdnypPu5xt5xkZ+/wD/AIJcf8mJ/DL/ALif/p0u6APqqiuU+KXxT8MfBbwJqfjLxlqf9j+G9N8r7Ve/Z5Z/L8yVIk+SJWc5eRBwpxnJ4BNfmt+3QP8Ah5OfBI/Zy/4uIfBf27+3v+YX9j+1/Z/s3/H95Hmb/slx/q923Z82Ny5AP1Ur8AP+Ho37Tv8A0Uz/AMoGl/8AyNR/w65/ad/6Jn/5X9L/APkmvVv2W/2XPid+xf8AHbwz8ZPjJ4Z/4Q74b+GvtX9q619vtb77N9otZbWH9zayyzPumuIk+RDjdk4UEgA8p/4ei/tOHg/Ezj/sAaX/API1fr/+wV8UfE/xo/ZO8DeMvGWp/wBs+JNT+3fa737PFB5nl39xEnyRKqDCRoOFGcZPJJr81v8Agqz+1F8Mf2lP+FXf8K48Tf8ACRf2L/an2/8A0C6tfJ877J5f+viTdnypPu5xt5xkZ+gP2Cv28/gV8Fv2TvAvg3xn44OjeJNN+3farL+yL+fy/Mv7iVPnigZDlJEPDHGcHkEUAfVP7evxR8T/AAX/AGTvHPjLwbqf9jeJNM+w/ZL37PFP5fmX9vE/ySqyHKSOOVOM5HIBr8gP+Hov7Tg4HxM4/wCwBpf/AMjV+qv/AAVH/wCTE/ib/wBwz/06WlfKn/BDI4/4XYT0H9if+39AHyr/AMPRv2nf+imf+UDS/wD5Go/4ejftO/8ARTP/ACgaX/8AI1fsB8Uf29PgV8F/HWp+DfGXjg6N4k03yvtVl/ZF/P5fmRJKnzxQMhykiHhjjODggiuU/wCHov7Mf/RTD/4INU/+RqAPyq/4ejftO/8ARTP/ACgaX/8AI1H/AA9G/ad/6KZ/5QNL/wDkav2p+Bv7Unwx/aT/ALbHw48Tf8JF/Yvkfb/9AurXyfO8zyv9fEm7PlSfdzjbzjIz+K//AAVH/wCT7Pib/wBwz/012lAH7/UUUUAFFFFABSHpS0h6UAfgF/wVH/5Ps+Jv/cM/9NdpX6qf8FR/+TFPiZ/3DP8A052lflX/AMFR/wDk+z4m/wDcM/8ATXaV+qn/AAVH/wCTE/ib/wBwz/06WlAH4A5ozRRQB+/3/BUf/kxP4m/9wz/06WlfKn/BDL/mtn/cE/8Ab+vqv/gqP/yYn8Tf+4Z/6dLSvlT/AIIZf81s/wC4J/7f0Aeq/tRf8FWv+Ga/jr4m+HH/AAq7/hI/7F+y/wDEy/4SD7L53nWsU/8Aqvsr7cebt+8c7c8ZwPv/AIr8Av8AgqP/AMn2fE3/ALhn/prtKT/h6N+07/0Uz/ygaX/8jUAfVX/Bc3/mieP+o3/7YV+VnNfqn+wuf+Hkx8bH9o3/AIuIfBf2H+wf+YX9j+1/aPtP/Hj5Hmb/ALJb/wCs3bdny43Nn4r/AG9fhd4Y+C/7WPjnwb4N0z+x/DemfYfsll9oln8vzLC3lf55WZzl5HPLHGcDgAUAfup+1H8c/wDhmz4FeJviP/Yn/CRf2L9l/wCJb9r+y+d511FB/rdj7cebu+6c7ccZyPKf2Gf25/8AhtEeNv8Aiif+EO/4Rr7D/wAxb7d9p+0faP8AphFs2+R753dscr/wVH/5MT+Jv/cM/wDTpaV8qf8ABDLn/hdn/cE/9v6APVf2ov8AglN/w0n8dfE3xH/4Wj/wjn9tfZv+JZ/wj/2ryfJtYoP9b9qTdnyt33RjdjnGT9VftR/AwftJ/ArxN8Of7bHh3+2vsv8AxM/sn2ryfJuop/8AVb03Z8rb94Y3Z5xg/mr+3p+3n8dfgr+1j468G+DPHP8AY3hvTfsP2Wy/siwn8vzLC3lf55YGc5eRzyxxnA4AFH7Bf7efx1+NX7WPgXwb4z8c/wBs+G9S+3farL+yLCDzPLsLiVPnigVxh40PDDOMHgkUAeA/tzfsNf8ADF//AAhOfG3/AAmP/CS/bf8AmE/Yfs32f7P/ANNpd+7z/bG3vnj1X9l3/gq1/wAM1/Arwz8OB8Lv+Ej/ALF+1f8AEy/4SD7L53nXUs/+q+yvtx5u37xztzxnA9U/4Lm8D4J/9xv/ANsK/KygD+lL9qP4G/8ADSfwK8TfDj+2/wDhHf7a+y/8TL7J9q8nybqKf/Vb03Z8rb94Y3Z5xg+VfsM/sM/8MX/8Jt/xW3/CY/8ACS/Yf+YV9h+z/Z/tH/TeXfu+0e2NvfPH5V/8PRv2nf8Aopn/AJQNL/8Akaj/AIejftO/9FM/8oGl/wDyNQB+/wBx7V+K/wC1F/wVaH7SfwK8TfDj/hV3/COf219l/wCJn/wkH2ryfJuop/8AVfZU3Z8rb94Y3Z5xg+U/8PRv2nf+imf+UDS//kavlagBSTnrSZoooA/f7/gqP/yYn8Tf+4Z/6dLSvlT/AIIZf81s/wC4J/7f19V/8FR/+TE/ib/3DP8A06WlfKn/AAQy/wCa2f8AcE/9v6APlb/gqNx+3X8TP+4Z/wCmy0r5VzX1V/wVH/5Ps+Jv/cM/9NdpXyrQB+qf/BDL/mtn/cE/9v6+Vv8AgqP/AMn2fE3/ALhn/prtK+qf+CGX/NbP+4J/7f18rf8ABUf/AJPs+Jv/AHDP/TXaUAfv9RRRQAUUUUAFIelLSHpQB+AX/BUf/k+z4m/9wz/012lfqp/w9F/Zj/6KYf8AwQap/wDI1eU/tRf8Epf+GlPjr4m+I/8AwtH/AIRz+2vsv/Et/wCEf+1eT5NrFB/rftSbs+Vu+6Mbsc4yfK/+HGX/AFWz/wAtT/7toA+qv+Hov7Mf/RTD/wCCDVP/AJGo/wCHov7Mf/RTD/4INU/+Rq+VD/wQzx/zWz/y1P8A7tpf+HGX/VbP/LU/+7aAOr/b1/bz+BXxp/ZO8deDfBnjg6z4k1L7D9lsv7Iv4PM8u/t5X+eWBUGEjc8sM4wOSBXKf8EMxj/hdn/cE/8Ab+j/AIcZf9Vs/wDLU/8Au2vqn9hj9hn/AIYvPjb/AIrb/hMf+El+xf8AMJ+w/Z/s/wBo/wCm8u/d5/tjb3zwAflZ/wAFR/8Ak+z4m/8AcM/9NdpXqv7Lf7LnxO/Yv+O3hn4yfGTwz/wh3w38Nfav7V1r7fa332b7Ray2sP7m1llmfdNcRJ8iHG7JwoJH1T+1F/wSl/4aU+Ovib4j/wDC0f8AhHP7a+y/8S3/AIR/7V5Pk2sUH+t+1Juz5W77oxuxzjJ9W/4KjD/jBT4mf9wz/wBOdpQB6p8DP2o/hj+0n/bY+HPib/hIv7F8j7f/AKBdWvk+d5nlf6+JN2fKk+7nG3nGRn8V/wDgqP8A8n2fE3/uGf8AprtKX9hn9uY/sX/8JtnwT/wmJ8S/Yv8AmLfYfs32f7R/0xl37vtHtjb3zx9Un9hj/h5Of+Gjv+E2/wCFdf8ACaf8y1/ZX9qfY/sn+gf8fPnQ+Zv+yeZ/q1279vO3cQDyr9lv9lz4nfsX/Hbwz8ZPjJ4Z/wCEO+G/hr7V/autfb7W++zfaLWW1h/c2sssz7priJPkQ43ZOFBI9U/bn/42T/8ACE/8M5f8XF/4Qv7d/b3/ADC/sf2v7P8AZv8Aj98nzN/2S4/1e7Gz5sblz9//ALUfwMH7SfwK8TfDn+2x4d/tr7L/AMTP7J9q8nybqKf/AFW9N2fK2/eGN2ecYPwB/wAoX+v/ABeL/hZP/cD/ALO/s/8A8CfN8z7f/sbfK/i3fKAerfst/tR/DH9i/wCBPhn4N/GTxN/wh3xI8Nfav7V0X+z7q++zfaLqW6h/fWsUsL7obiJ/kc43YOGBA/NX4o/sF/HX4LeBdT8ZeM/A40bw3pvlfar3+17Cfy/MlSJPkinZzl5EHCnGcnABNcr+1H8c/wDhpP46+JviP/Yh8O/219l/4ln2v7V5Pk2sUH+t2Juz5W77oxuxzjJ+qv2ov+CrQ/aT+BXib4cf8Ku/4Rz+2vsv/Ez/AOEg+1eT5N1FP/qvsqbs+Vt+8Mbs84wQD5V+Bv7LXxP/AGkv7b/4Vz4Z/wCEi/sXyPt/+n2tr5PneZ5f+vlTdnypPu5xt5xkZ/VT9lv9qP4Y/sX/AAJ8M/Bv4yeJv+EO+JHhr7V/aui/2fdX32b7RdS3UP761ilhfdDcRP8AI5xuwcMCB5T/AMENMf8AF7M/9QT/ANv6+Vv+Co3/ACfX8TMdP+JZ/wCmy0oA/VT/AIKj/wDJifxN/wC4Z/6dLSvlT/ghkcf8LsJ6D+xP/b+vv/8Aaj+Bv/DSfwK8TfDj+2/+Ed/tr7L/AMTL7J9q8nybqKf/AFW9N2fK2/eGN2ecYPwB/wAoXv8AqsX/AAsn/uB/2d/Z/wD4E+b5n2//AGNvlfxbvlAPtb4o/t6fAr4L+OtT8G+MvHB0bxJpvlfarL+yL+fy/MiSVPnigZDlJEPDHGcHBBFfir8Uf2C/jr8FvAup+MvGfgcaN4b03yvtV7/a9hP5fmSpEnyRTs5y8iDhTjOTgAmuV/aj+Of/AA0l8dfE3xG/sT/hHf7a+y/8Sz7X9q8nybWKD/W7E3Z8rd90Y3Y5xk/v7+1H8DP+GkvgV4m+HP8Abf8Awjv9tfZf+Jn9k+1eT5N1FP8A6rem7PlbfvDG7POMEA/AL4Hfst/E/wDaR/tv/hXPhn/hIf7F8n7fm/tbXyfO8zy/9fKm7PlSfdzjbzjIzyvxS+Fvif4LeO9T8G+MtM/sbxJpvlfarLz4p/L8yJJU+eJmQ5SRDwxxnB5BFfuj+wz+wz/wxf8A8JsT42/4TH/hJPsX/MK+w/Zvs/2j/pvLv3ef7Y2988eV/tRf8Epf+GlPjr4m+I//AAtH/hHP7a+zf8S3/hH/ALV5Pk2sUH+t+1Juz5W77oxuxzjJAPVv+Co//JifxN/7hn/p0tK+AP8AglL+1F8Mf2a/+Fo/8LH8Tf8ACO/21/Zf2D/QLq687yftfm/6iJ9uPNj+9jO7jODj9VP2o/gZ/wANJ/ArxN8OP7b/AOEd/tr7L/xMvsn2ryfJuop/9VvTdnytv3hjdnnGD+f/APw4zxx/wuzH/cqf/dtAH1X/AMPRf2Y/+imH/wAEGqf/ACNR/wAPRf2Y/wDoph/8EGqf/I1fKv8Aw4y/6rZ/5an/AN20f8OM/wDqtn/lqf8A3bQB9Vf8PRf2YzwPiWc/9gDVP/kavyA/b1+KPhj40ftY+OfGXg3U/wC2PDep/Yfsl79nlg8zy7C3if5JVVxh43HKjOMjgg19qf8ADjP/AKrZ/wCWp/8AdtH/AA4y/wCq2f8Alqf/AHbQB+qtFFFABRRRQAUUUhOASegoAWivAPij+3p8Cvgv461Pwb4y8cHRvEmm+V9qsv7Iv5/L8yJJU+eKBkOUkQ8McZwcEEV8q/t6/t5/Ar40/sneOvBvgzxwdZ8Sal9h+y2X9kX8HmeXf28r/PLAqDCRueWGcYHJAoA6n/gq3+1F8Tv2bP8AhV4+HPib/hHRrX9qfb/9AtbrzvJ+yeX/AK+J9uPNk+7jO7nOBj6A/YK+KPif40fsneBvGXjLU/7Z8San9u+13v2eKDzPLv7iJPkiVUGEjQcKM4yeSTX865GDRQB/RR+3r8UfE/wX/ZO8c+MvBup/2N4k0z7D9kvfs8U/l+Zf28T/ACSqyHKSOOVOM5HIBr5//wCCUn7UXxO/aT/4WgPiN4m/4SIaL/Zf2D/QLW18nzvtfmf6iJN2fKj+9nG3jGTn7V+KXxT8MfBbwJqfjLxlqf8AY/hvTfK+1Xv2eWfy/MlSJPkiVnOXkQcKcZyeATXKfA79qT4Y/tI/23/wrnxN/wAJD/Yvk/b82F1a+T5vmeX/AK+JN2fKk+7nG3nGRkA9WrlPil8LPDHxp8Can4N8ZaZ/bHhvUvK+1WX2iWDzPLlSVPniZXGHjQ8MM4weCRXlfxR/b0+BXwX8dan4N8ZeODo3iTTfK+1WX9kX8/l+ZEkqfPFAyHKSIeGOM4OCCK+Vf29f28/gV8af2TvHXg3wZ44Os+JNS+w/ZbL+yL+DzPLv7eV/nlgVBhI3PLDOMDkgUAeAf8FWv2Xvhl+zW3wuPw48M/8ACOnWv7UN+ft91ded5P2Ty/8AXyvtx5sn3cZ3c5wMfP3wu/b0+OvwW8C6Z4N8GeOBo3hvTfN+y2X9kWE/l+ZK8r/PLAznLyOeWOM4GAAK+1P+CGfy/wDC7c9v7E/9v6+1vij+3p8Cvgv461Pwb4y8cHRvEmm+V9qsv7Iv5/L8yJJU+eKBkOUkQ8McZwcEEUAfn9+wX+3n8dfjV+1j4F8G+M/HP9s+G9S+3farL+yLCDzPLsLiVPnigVxh40PDDOMHgkV+lXxy/Zb+GH7Sf9if8LG8M/8ACRf2L5/2D/T7q18nzvL83/USpuz5Uf3s428Yyc8r+3r8LvE/xo/ZO8c+DfBumf2z4k1P7D9ksvtEUHmeXf28r/PKyoMJG55YZxgckCvir9hf/jWyfGv/AA0b/wAW7/4TT7D/AGDj/iafbPsn2j7T/wAePn+Xs+12/wDrNu7f8udrYAPqv/h11+zH/wBEzP8A4P8AVP8A5Jr8Aa/p9+FvxT8MfGnwJpnjLwbqf9seG9S837Le/Z5YPM8uV4n+SVVcYeNxyozjI4INHxS+Kfhj4LeBNT8ZeMtT/sfw3pvlfar37PLP5fmSpEnyRKznLyIOFOM5PAJoA/nX+Bn7UnxO/ZsGtj4ceJv+Ed/tryPt/wDoFrded5PmeV/r4n2482T7uM7uc4GP1U/Zb/Zc+GP7aHwJ8M/GT4yeGf8AhMfiR4l+1f2rrX9oXVj9p+z3UtrD+5tZYoU2w28SfIgztycsST5T+3T/AMbJv+EK/wCGcv8Ai4n/AAhf27+3s/8AEr+x/a/s/wBm/wCP7yfM3/ZLj/V7tuz5sblz+a/xS+Fvif4LeO9T8G+MtM/sbxJpvlfarLz4p/L8yJJU+eJmQ5SRDwxxnB5BFAHv3/D0b9p3/opn/lA0v/5Gr6q/YXP/AA8mPjY/tG/8XEPgv7D/AGD/AMwv7H9r+0faf+PHyPM3/ZLf/Wbtuz5cbmzyn7Bf7Bnx1+Cv7WPgXxl4z8Df2N4b037d9qvf7XsJ/L8ywuIk+SKdnOXkQcKcZyeATX6VfHL9qP4Y/s2/2IPiN4m/4R0615/2D/QLq687yfL8z/URPtx5sf3sZ3cZwcAH4Wft6/C7wx8F/wBrHxz4N8G6Z/Y/hvTPsP2Sy+0Sz+X5lhbyv88rM5y8jnljjOBwAK/an9vX4o+J/gv+yd458ZeDdT/sbxJpn2H7Je/Z4p/L8y/t4n+SVWQ5SRxypxnI5ANfit+3r8UfDHxo/ax8c+MvBup/2x4b1P7D9kvfs8sHmeXYW8T/ACSqrjDxuOVGcZHBBrqv+HXP7Tv/AETP/wAr+l//ACTQAf8AD0X9pzGP+FmcdMf2Bpf/AMjV+v8A+wV8UfE/xo/ZO8DeMvGWp/2z4k1P7d9rvfs8UHmeXf3ESfJEqoMJGg4UZxk8kmvn/wD4JS/su/E79mr/AIWifiP4Z/4Rwa1/Zf2D/T7W687yftfm/wColfbjzY/vYzu4zg4+gfij+3p8Cvgv461Pwb4y8cHRvEmm+V9qsv7Iv5/L8yJJU+eKBkOUkQ8McZwcEEUAe/1+f/8AwVb/AGo/id+zWfhd/wAK48Tf8I7/AG1/an2//QLW687yfsnlf6+J9uPNk+7jO7nOBj7V+KXxT8MfBbwJqfjLxlqf9j+G9N8r7Ve/Z5Z/L8yVIk+SJWc5eRBwpxnJ4BNcp8Dv2pPhj+0j/bf/AArnxN/wkP8AYvk/b82F1a+T5vmeX/r4k3Z8qT7ucbecZGQD8Vv+Ho37Tv8A0Uz/AMoGl/8AyNXv/wCwX+3n8dfjV+1j4F8G+M/HP9s+G9S+3farL+yLCDzPLsLiVPnigVxh40PDDOMHgkV+gPxR/b0+BXwX8dan4N8ZeODo3iTTfK+1WX9kX8/l+ZEkqfPFAyHKSIeGOM4OCCK/FX4o/sF/HX4LeBdT8ZeM/A40bw3pvlfar3+17Cfy/MlSJPkinZzl5EHCnGcnABNAH6U/8FWf2ovid+zX/wAKu/4Vx4m/4R3+2v7U+3/6Ba3XneT9k8v/AF8T7cebJ93Gd3OcDHwB/wAPRv2nf+imf+UDS/8A5Gryv4Hfst/E/wDaR/tv/hXPhn/hIf7F8n7fm/tbXyfO8zy/9fKm7PlSfdzjbzjIzyvxS+Fvif4LeO9T8G+MtM/sbxJpvlfarLz4p/L8yJJU+eJmQ5SRDwxxnB5BFAH9PtFFFABRRRQAUh6UtIelAH4Bf8FRuP26/iZ/3DP/AE2WleVfsufAz/hpT46+Gfhx/bf/AAjv9tfav+Jl9k+1eT5NrLP/AKrem7PlbfvDG7POMH1X/gqP/wAn2fE3/uGf+mu0o/4Jcf8AJ9nwy/7if/pru6AD9uf9hn/hi7/hCf8Aitv+Ex/4SX7d/wAwn7D9m+z/AGf/AKbS793n+2NvfPHyrX6p/wDBc3/mif8A3G//AGwr8rKAP1U/4bn/AOHk/wDxjj/whP8Awrr/AITT/mZf7V/tT7H9k/07/j28mHzN/wBk8v8A1i7d+7nbtKZ/4cv/APVYv+Fk/wDcD/s7+z//AAJ83zPt/wDsbfK/i3cerftSfsufDH9i/wCBPib4yfBvwz/wh3xI8NfZf7K1r+0Lq++zfaLqK1m/c3UssL7obiVPnQ43ZGGAI/Kv45/tSfE79pMaKPiP4m/4SL+xfP8AsH+gWtr5PneX5v8AqIk3Z8qP72cbeMZOQA/aj+Of/DSfx18TfEcaL/wjv9tfZf8AiWfa/tXk+TaxQf63Ym7PlbvujG7HOMnyrmiv3+/4ddfsx/8ARMz/AOD/AFT/AOSaAPlT/ghn/wA1sz/1BP8A2/r1X9qL/glN/wANJ/HXxN8R/wDhaP8Awjn9tfZv+JZ/wj/2ryfJtYoP9b9qTdnyt33RjdjnGT9VfA39lv4Yfs2f23/wrnwz/wAI7/bXkfb/APT7q687yfM8r/Xyvtx5sn3cZ3c5wMfmr+3p+3n8dfgr+1j468G+DPHP9jeG9N+w/ZbL+yLCfy/MsLeV/nlgZzl5HPLHGcDgAUAfpV+1H8c/+GbfgV4m+I39if8ACRf2L9l/4ln2v7L53nXUUH+t2Ptx5u77pztxxnI/Fj9ub9uX/htD/hCf+KJ/4Q0+Gvtv/MV+3faPtH2f/phFs2/Z/fO7tjn1T9lv9qP4nftofHbwz8G/jJ4m/wCEx+G/iX7V/aui/YLWx+0/Z7WW6h/fWsUUybZreJ/kcZ24OVJB+/x/wS6/Zj/6Jn/5X9U/+SaAPgH9l3/gq1/wzX8CvDPw4/4Vd/wkf9i/av8AiZ/8JB9l87zrqWf/AFX2V9uPN2/eOdueM4B+1F/wVa/4aT+BXib4cH4Xf8I5/bX2X/iZ/wDCQfavJ8m6in/1X2VN2fK2/eGN2ecYP39/w66/Zj/6Jmf/AAf6p/8AJNeAft6fsGfAv4LfsneOvGXgzwOdG8Sab9h+y3v9r38/l+Zf28T/ACSzshykjjlTjORyAaAOT/4IZ/8ANbM/9QT/ANv69V/ai/4JS/8ADSnx18TfEf8A4Wj/AMI5/bX2X/iW/wDCP/avJ8m1ig/1v2pN2fK3fdGN2OcZPlX/AAQz5/4XZn/qCf8At/XKft6ft5/HX4K/tY+OvBvgzxz/AGN4b037D9lsv7IsJ/L8ywt5X+eWBnOXkc8scZwOABQB+lX7Ufxy/wCGbPgV4m+I/wDYn/CRf2L9l/4lv2v7L53nXUUH+t2Ptx5u77pztxxnI/Fj9uX9ub/htD/hCf8Aiif+EO/4Rr7b/wAxb7d9p+0fZ/8ApjFs2/Z/fO7tjn9U/wDgqP8A8mKfE3/uGf8Ap0tK+AP+CUn7Lvwx/aTPxQ/4WN4Z/wCEiOi/2X9gxf3Vr5Pnfa/M/wBRKm7PlR/ezjbxjJyAL+y7/wAEpf8AhpT4FeGfiP8A8LR/4Rz+2vtP/Es/4R/7V5Pk3UsH+t+1Juz5W77oxuxzjJ+qP2Xf+CrX/DSnx18M/Dj/AIVd/wAI5/bX2r/iZf8ACQfavJ8m1ln/ANV9lTdnytv3hjdnnGD9q/C34WeGPgt4E0zwb4N0z+x/Dem+b9lsvtEs/l+ZK8r/ADysznLyOeWOM4HAAr8LP+CXH/J9nwy/7if/AKa7ugD9Uv25v25f+GL/APhCf+KJ/wCEx/4SX7b/AMxb7D9n+z/Z/wDphLv3ef7Y2988fK//AAwx/wAPJ/8AjI3/AITb/hXX/Caf8y1/ZX9qfY/sn+gf8fPnw+Zv+yeZ/q1279vO3cT/AILmHB+CRHb+2/8A2wr4q+F37enx1+C3gXTPBvgzxwNG8N6b5v2Wy/siwn8vzJXlf55YGc5eRzyxxnAwABQB+6f7UnwM/wCGk/gV4m+HP9t/8I7/AG19l/4mf2T7V5Pk3UU/+q3puz5W37wxuzzjB8q/YZ/YZ/4YvHjbPjb/AITH/hJfsX/MK+w/Zvs/2j/pvLv3faPbG3vnjq/29fij4n+C/wCyd458ZeDdT/sbxJpn2H7Je/Z4p/L8y/t4n+SVWQ5SRxypxnI5ANfkB/w9F/acxj/hZYx0x/YGl/8AyNQAv/BUY/8AGdfxMx/1DP8A02WlftR+1H8DB+0n8CvE3w4/tseHf7a+y/8AEz+yfavJ8m6in/1W9N2fK2/eGN2ecYP87HxS+KXif40+O9T8ZeMtT/tnxJqXlfar3yIoPM8uJIk+SJVQYSNBwozjJ5JNe/f8PRv2nf8Aopn/AJQNL/8AkagD9U/2Gf2Gf+GL/wDhNv8Aitv+Ex/4ST7F/wAwn7D9m+z/AGj/AKby793n+2NvfPH5Wf8ABUb/AJPr+Jv/AHDP/TZaV9//APBKX9qP4nftKf8AC0f+Fj+Jv+Ei/sX+y/sH+gWtr5Pnfa/N/wBREm7PlR/ezjbxjJz8A/8ABUf/AJPs+Jv/AHDP/TXaUAfv9RRRQAUUUUAFIelLSHpQB+AX/BUf/k+z4m/9wz/012lfr9+3r8LvE/xo/ZO8c+DfBumf2z4k1P7D9ksvtEUHmeXf28r/ADysqDCRueWGcYHJAr8gf+Co3P7dfxM/7hn/AKbLSv394oA/mt+OX7LnxO/ZtGiH4jeGf+EdGtef9g/0+1uvO8ny/M/1Er7cebH97Gd3GcHH7U/8EuP+TE/hl/3E/wD06XdfKn/Bc3/mimP+o3/7YV9V/wDBLj/kxP4Zf9xP/wBOl3QAf8PRf2Y/+imH/wAEGqf/ACNR/wAPRf2Y/wDoph/8EGqf/I1fit+y58DP+Gk/jr4Z+HH9tnw7/bX2r/iZ/ZPtXk+Tayz/AOq3puz5W37wxuzzjB+/h/wQzz0+Nn/lqf8A3bQB9V/8PRf2Y/8Aoph/8EGqf/I1dV+3r8LvE/xo/ZO8c+DfBumf2z4k1P7D9ksvtEUHmeXf28r/ADysqDCRueWGcYHJAr4r/wCHGX/VbP8Ay1P/ALto/wCH5v8A1RP/AMuv/wC4qAPlT/h11+04ef8AhWfH/Yf0v/5Jr9AP2W/2o/hj+xf8CfDPwb+Mnib/AIQ74keGvtX9q6L/AGfdX32b7RdS3UP761ilhfdDcRP8jnG7BwwIHqf7DP7c3/DaP/CbD/hCf+EO/wCEa+xf8xX7d9o+0faP+mEWzb5Hvnd2xz+Vv/BUbj9uv4mf9wz/ANNlpQBb0f8A4JXftLahqlta3HgO20qCaQI97d67YNFACfvuIpncgd9qsfY1+k/7Ff7NHhL9hxPF1ne/Em08R6vry2Qvovs6262rwGfCqA7k5Nxj5sH5RxzgfUfxM1K50rwFr91Yyvb3kdo4imiXLxsRgMowckZyODyOhr4W+0okUskodIlaSR3ZjlBk59xjJOT3JJ5Ir3Muy6ONjKc5WSOepVcGklufccnxc8HxKXfxBZogJBZnwO3f8R+dfB3wC/Yl+Dv7KnxX8J/FR/jOZ1sluXs4dUhitoLxZbaSEsj7ssAJt2VyOBVCTx2bFMWlulzrk6eZH9tXdbaTFj/XvH91pST8qnIG0EjgZzI70/aZPsMEmr6xesRLqOpIZ7q5brwucheSMEqB6Y5rxq+LyrDUpYrEV+SldpNrWdt3FbuPnsz38JlGNxlT2VGndrftH1b0TPav2xPg78Jv20Lbwbcah8U00CDw6LtoZbGJZ0nFx5GSS2AMeQMY67jXo/7NOr/Cr9nn4MeH/h3pXxI07xDa6KLllvXkQSOJbiWcllQkAAykfQV8wTfD/wAOfDSyTxT4/wBRGnwQxBbfS4JNrSED+LaRuc5OccCvL/Gfxk8SeK9KkutGjPgnwycpZWNgm26vG52liuCAeufTPHevzXLOJ8Znc6n9n4Xmpw3qN8sEl521dux7OOyfB4BxVTEXb0sle77Lv6n6j23xs8C3cCzw+KNNkgYZEyzDYR67umOv5Vk/GX9pb4cfs/6BpOt+O/ELaNo+qymGzvodPuryGV9m8Lut45ApK5YbsbgGIzg4/Oj4JjxCbvUJtYvGure3hRJfOUMZZyCSpdufkGec8g4JIXj2j48W0fiL/gn58W7G9AuLXT4obq0VxnyHWaJ/k6bfmXP/AAJs5yQf1anhfa5bSzCzXN0f5ryfS/Q+UxNP6tiZYe97dT5U/ak/Zc+J37aHx28TfGT4N+Gf+Ex+G/iX7L/ZWtfb7Wx+0/Z7WK1m/c3UsUybZreVPnQZ25GVIJ+f/wBgr4o+GPgv+1j4G8ZeMtT/ALH8N6Z9u+13v2eWfy/MsLiJPkiVnOXkQcKcZyeATX0B+y5/wVa/4Zs+BXhn4cf8Ku/4SP8AsX7V/wATP/hIPsvneddSz/6r7K+3Hm7fvHO3PGcD4A5rgMj9U/26P+Nkv/CE/wDDOX/FxP8AhCvt39vf8wv7H9r+z/Zv+P7yfM3/AGS4/wBXu27PmxuXP2r+wV8LvE/wX/ZO8DeDfGWmf2N4k0z7d9rsvtEU/l+Zf3EqfPEzIcpIh4Y4zg8givyB/YZ/bl/4Yv8A+E2z4J/4TH/hJfsP/MV+w/Z/s/2j/pjLv3faPbG3vnj6q/4fm/8AVE//AC6//uKgDq/29f28/gV8af2TvHXg3wZ44Os+JNS+w/ZbL+yL+DzPLv7eV/nlgVBhI3PLDOMDkgV+avwN/Zb+J37SX9tn4c+Gf+EiGi+R9v8A9PtbXyfO8zy/9fKm7PlSfdzjbzjIz9//APDjL/qtn/lqf/dtJ/yhf/6rF/wsn/uB/wBnf2f/AOBPm+Z9v/2NvlfxbvlAPtX9gr4XeJ/gv+yd4G8G+MtM/sbxJpn277XZfaIp/L8y/uJU+eJmQ5SRDwxxnB5BFfmt+y3+y58Tv2L/AI7eGfjJ8ZPDP/CHfDfw19q/tXWvt9rffZvtFrLaw/ubWWWZ901xEnyIcbsnCgkeq/8AD83/AKon/wCXX/8AcVff37UfwM/4aT+BXib4c/22PDv9tfZf+Jn9k+1eT5N1FP8A6rem7PlbfvDG7POMEA+AP26P+Nkw8E/8M5f8XE/4Qv7d/b3/ADC/sf2v7P8AZv8Aj98nzN/2S4/1e7bs+bG5c/mv8Uvhb4n+C3jvU/BvjLTP7G8Sab5X2qy8+Kfy/MiSVPniZkOUkQ8McZweQRX6Uf8AKGD/AKrEfiT/ANwP+zv7P/8AAnzfM+3/AOxt8r+Ld8q/8ML/APDyf/jI7/hNv+Fdf8Jp/wAy1/ZX9qfY/sn+gf8AHz50Pmb/ALJ5n+rXbv287dxAP1UooooAKKKKACkIyCD0NLRQB4B8Uf2C/gV8aPHWp+MvGXgc6z4k1LyvtV7/AGvfweZ5cSRJ8kU6oMJGg4UZxk5JJr8f/wDh6N+07/0Uz/ygaX/8jV+/9fit+y3+y58Tv2L/AI7eGfjJ8ZPDP/CHfDfw19q/tXWvt9rffZvtFrLaw/ubWWWZ901xEnyIcbsnCgkAHyr8c/2pPif+0n/Yn/Cx/E3/AAkX9i+f9g/0C1tfJ87y/N/1ESbs+VH97ONvGMnP7U/8EuP+TE/hl/3E/wD06XdeqfAz9qP4Y/tJ/wBtj4c+Jv8AhIv7F8j7f/oF1a+T53meV/r4k3Z8qT7ucbecZGfxX/4Kj/8AJ9nxN/7hn/prtKAPv/8Aak/Zc+GP7F/wJ8TfGT4N+Gf+EO+JHhr7L/ZWtf2hdX32b7RdRWs37m6llhfdDcSp86HG7IwwBCf8Epf2o/id+0ofij/wsfxN/wAJF/Yv9l/YP9AtbXyfO+1+b/qIk3Z8qP72cbeMZOflb9lv9lz4nfsX/Hbwz8ZPjJ4Z/wCEO+G/hr7V/autfb7W++zfaLWW1h/c2sssz7priJPkQ43ZOFBIP+CrX7UXwx/aT/4Vd/wrjxN/wkX9i/2p9v8A9AurXyfO+yeV/r4k3Z8qT7ucbecZGQD9qa/Nb9vX9gz4FfBb9k7x14y8GeBzo3iTTfsP2W9/te/n8vzL+3if5JZ2Q5SRxypxnI5ANfkBX7/f8PRf2Y/+imH/AMEGqf8AyNQB8q/8EMzn/hdn/cE/9v6+Vf8AgqP/AMn2fE3/ALhn/prtK9V/4KtftRfDH9pT/hV3/CuPE3/CRf2L/an2/wD0C6tfJ877J5X+viTdnypPu5xt5xkZ+/8A/glx/wAmJ/DL/uJ/+nS7oA9z+MDKvw18Sl0MiC0JKhS2efQda/Pr4seIRpktposYaRroM7xLyrRhmwpI4UFhyemFP94Vs/sV/s8fEj9mf9mn40WvxA0BvDV9qDRXFmEvra5Z0WMqzAwyOFIJH3sV53ry28mkfabu4jgutQuFtIZ7h8ZJ6sWPXjI/ADpgD5zPeJf7IwcsBST9pW0uui2fzPsuHckWPq/Xa0kqdNpW6t7/AHJGn4Q0DUtdvPsdiy3d+7F7m6GfKiJBGe2cBiB3xkcZNdt4y+IPhX9nHTBCif274wvEASBDulc9s4+6vPA/Kuc8Z/E6w+Cfhi18O+GYU1LxTeLthjQhmz/FI+OcDk5OM4wO+3xOaew8DSyeIPFuoNqvii9JkCgiSVmJwQi5+6ORngcY7Yr8xyXhvF8YVXmGb1HDBw010c7bJdorax9DxBxHTwEVgsDT1fwwju33l6+Zq3tnqnjHVJPF/wAQ9QEhgy8dm7gQ2wzwMdO4/wDr1wetfGtLTU7u/WzVreOExaSjt88bd5guOMjGM4xjjqc9F4b0O++NeoS3HiC9m0TQbONpIbe0i89t4PTHGW4c7jkDBAHXGLe/C6y0K41DxRpFtfeJdG0yZPtV5fRlDasfu7wmQRkdT3IyBkZ/Z8bhXVyyVDLKKWFppXUWrtea3sceS8L4+tVWY5nJKrL4eZ2jG+y85PY6/wCFv7TkXhfQLTTtd8PXUGnhkeO8swUJI3FmKsAHYl2YEMvJPrkfRvjXxvonjv8A4J+/G+80K7F3bw2kcL/KVKODF8pBA7Y5GRgjnqB4/YfFLxn8Rfhlqt9qWi6nc6XFbyi0ujZH7K6gbW3kLsOACB7+4NfSH/BMHTU074R+MEjA/earE3Hf9ylePlXEuMx6eX4mKSW2qb081Y+Ux2C9nVxHtYKNSm0nyy5ovm6/19x+G9fv9/w66/Zj/wCiZn/wf6p/8k18Uft4/sF/HX40/tXeOPGXgzwONZ8N6l9g+y3v9r2EHmeXYW8T/JLOrjDxuOVGcZHBBr7X/wCCo/8AyYn8Tf8AuGf+nS0r6I8M+AP+CrX7Lvwx/ZrPwu/4Vx4Z/wCEd/tr+1Pt/wDp91ded5P2Ty/9fK+3HmyfdxndznAx9AfsFfsGfAr40/sneBfGXjPwOdZ8Sal9u+1Xv9r38HmeXf3ESfJFOqDCRoOFGcZPJJrk/wDghl/zWz/uCf8At/Xyt/wVH/5Ps+Jv/cM/9NdpQAn/AA9G/ad/6KZ/5QNL/wDkavqr9hf/AI2T/wDCbf8ADR3/ABcX/hC/sP8AYP8AzC/sf2v7R9p/48fI8zf9lt/9Zu27PlxubPxX8Uf2C/jr8FvAup+MvGfgcaN4b03yvtV7/a9hP5fmSpEnyRTs5y8iDhTjOTgAmvtT/ghn8v8Awu3Pb+xP/b+gD6r/AOHXX7Mf/RMz/wCD/VP/AJJr8qv+Ho37Tv8A0Uz/AMoGl/8AyNXv/wC3p+wZ8dfjV+1j468ZeDPA39s+G9S+w/Zb3+17CDzPLsLeJ/klnVxh43HKjOMjgg1+a9AH6qfsLn/h5OfGx/aN/wCLiHwX9h/sH/mF/Y/tf2j7T/x4+R5m/wCyW/8ArN23Z8uNzZ/Sn4W/Czwx8FvAmmeDfBumf2P4b03zfstl9oln8vzJXlf55WZzl5HPLHGcDgAV+QP/AASk/ai+GP7Nn/C0f+FjeJv+Ed/tr+y/sH+gXV153k/a/M/1ET7cebH97Gd3GcHHz/8At6/FHwx8aP2sfHPjLwbqf9seG9T+w/ZL37PLB5nl2FvE/wAkqq4w8bjlRnGRwQaAP6KaKKKACiiigApD0paQ9KAPgD9qL/gq1/wzX8dfE3w4/wCFXf8ACR/2L9l/4mX/AAkH2XzvOtYp/wDVfZX2483b945254zgfK37UX/BVoftKfArxN8OP+FXf8I5/bX2b/iZ/wDCQfavJ8m6in/1X2VN2fK2/eGN2ecYPlX/AAVH/wCT7Pib/wBwz/012lcp+wV8LvDHxo/ax8DeDfGWmf2x4b1P7d9rsvtEsHmeXYXEqfPEyuMPGh4YZxg8EigDrP2Gv25v+GL/APhNv+KJ/wCExPiX7F/zFvsP2b7P9o/6Yy793n+2NvfPH1Sf2GP+Hk5/4aO/4Tb/AIV1/wAJp/zLX9lf2p9j+yf6B/x8+dD5m/7J5n+rXbv287dx8q/4KtfsvfDL9ms/C4/Djwz/AMI6da/tQ35+33V153k/ZPL/ANfK+3HmyfdxndznAx8//C79vT46/BbwLpng3wZ44GjeG9N837LZf2RYT+X5kryv88sDOcvI55Y4zgYAAoA/dP8Aaj+Bn/DSXwK8TfDn+2/+Ed/tr7L/AMTP7J9q8nybqKf/AFW9N2fK2/eGN2ecYPwCf+CGmRk/Gz/y1P8A7tr7U/b1+KPif4L/ALJ3jnxl4N1P+xvEmmfYfsl79nin8vzL+3if5JVZDlJHHKnGcjkA1+QH/D0X9pwcf8LM4/7AGl//ACNQB5X+1H8C/wDhmz46+Jvhx/bf/CRf2L9l/wCJn9k+y+d51rFP/qt77cebt+8c7c8ZwD9lz4Gf8NJ/HXwz8ODrZ8O/219q/wCJn9k+1eT5NrLP/qt6bs+Vt+8Mbs84wf1U/Zb/AGXPhj+2h8CfDPxk+Mnhn/hMfiR4l+1f2rrX9oXVj9p+z3UtrD+5tZYoU2w28SfIgztycsST9AfC79gv4FfBfx1pnjLwb4HOjeJNN837Le/2vfz+X5kTxP8AJLOyHKSOOVOM5GCAaAPyA/bm/YZ/4Yv/AOEJ/wCK2/4TH/hJftv/ADCvsP2b7P8AZ/8AptLv3ef7Y2988fqp/wAEueP2FPhn/wBxP/053dfKn/Bcz5f+FJY4x/beP/JCviv4Xft6fHX4LeBdM8G+DPHA0bw3pvm/ZbL+yLCfy/MleV/nlgZzl5HPLHGcDgAUAfqX8Jv2yU/bK/Zy+LOrP4THgtNFiS1ZTqf20SB1Lbt3kx7cY6YNfIfim9tPH+6GGaNNK0pTsBfDOQMs+Ov41q/8E67hrT9i79pCdApaMROA6K6nED9Vbg/Q15TruleItX0OPVSZL7SoEMP2yx+UwDkhJFX7oyzEZGDkgNX55xHhI1sVSqylytKyfz/M/Q+GqrjhqsFrd/LY5qy8fNoMdzcaPbPda3MpV9RuRvFsmOBGvPP+0eOOhGK2vhd8KvE/xk1C4fTT5l9ISZ9SvnzgkZ2rz1x+XbHf3P4M/G7w1ofwpj8EafZWHh3VJEZb/UL+JJf7SY5JyxQgDAHyvgdgTxXp3wH+F9pr+ieIH0q/XSfIuJJbae1dWWdjtztQKAsYZZcNn+PHAAJ+kz+hPDZBDH4XExkk1Hlva1/L/M/L8XmubUsdWwWBwvs8Q9VOeq5b9HZr03R5P4O+Cl74fgj0a51qGOZQshnUsUV1zzs4O4bj32855xXr+t/DOLw18PddhGov4o0a5glnvdHji+zySttzuzlgcEZz97jjmue8JPFZfE423iBoribTlM0KTjak7k4OQCeMbvxx64qr8TPjLZeCrrUILWZJ7hwyeRAMRKx9Oeme36ivg557xTTpxr0KsYxkkpRUI++l7t+az1tttbc/VMtwmP4syahDieHLOlK6cXyp8rspadfw8keU3XjrxJ4QtNNt7HxK8tkII5Ht4WEcNurorIpXaMkKw+7u+bI9j9L/ALNHxkT4SfsvfGT4jw6Ab6DSb9bxNM+0G3E/yxggSbGC8seikDGK+Tl0C5u4LfWtfRra3uGLafpESkSz5Y/PtAyFyewy2fl45H3f+yp8GbTxT8BvGXhbx1p8d5pGvzoLrSkmeLZCAAIy8Tgg5TPykY6cjk+zkOF58VLE0KfuRunLpd7K/VnfxXVy/wBj+4pxhN2Wis5JO93b8z50H/BcvaAP+FJ59/8AhK//ALir7/8A2pPgZ/w0n8CfE3w4/tv/AIR3+2vsv/Ey+yfavJ8m6in/ANVvTdnytv3hjdnnGD5Un/BLr9mQqM/DTPH/AEH9T/8Akmur/b1+KPif4L/sneOfGXg3U/7G8SaZ9h+yXv2eKfy/Mv7eJ/klVkOUkccqcZyOQDX6EflJyn7DH7DP/DF3/Cbf8Vt/wmP/AAkv2H/mFfYfs/2f7R/03l37vP8AbG3vnjyr9qL/AIJS/wDDSnx18TfEf/haP/COf219l/4lv/CP/avJ8m1ig/1v2pN2fK3fdGN2OcZPwB/w9F/acHA+JnH/AGANL/8Akaj/AIejftO/9FM/8oGl/wDyNQB9V/8ADc//AA8n/wCMcv8AhCf+Fdf8Jp/zMv8Aav8Aan2P7J/p/wDx7eTD5m/7J5f+sXbv3c7dpTP/AA5f/wCqxf8ACyf+4H/Z39n/APgT5vmfb/8AY2+V/Fu+X1b9qT9lz4Y/sX/AnxN8ZPg34Z/4Q74keGvsv9la1/aF1ffZvtF1FazfubqWWF90NxKnzocbsjDAEflX8c/2pPid+0mNFHxH8Tf8JF/Yvn/YP9AtbXyfO8vzf9REm7PlR/ezjbxjJyAff3/D83/qif8A5df/ANxV5X+1F/wSk/4Zr+BXib4j/wDC0f8AhI/7F+y/8Sz/AIR/7L53nXUUH+t+1Ptx5u77pztxxnI+AK/p9+KXws8MfGnwJqfg3xlpn9seG9S8r7VZfaJYPM8uVJU+eJlcYeNDwwzjB4JFAH4WfsM/sNf8Nn/8Jt/xW3/CG/8ACNfYv+YT9u+0faPtH/TeLZt+z++d3bHPlX7UfwM/4Zs+Ovib4cf23/wkf9i/Zf8AiZ/ZPsvnedaxT/6re+3Hm7fvHO3PGcD7/wD26D/w7ZPgn/hnL/i3Z8afbv7e/wCYp9s+yfZ/s3/H953l7Ptdx/q9u7f82dq49V/Zb/Zc+GP7aHwJ8M/GT4yeGf8AhMfiR4l+1f2rrX9oXVj9p+z3UtrD+5tZYoU2w28SfIgztycsSSAff9FFFABRRRQAUUUUAFeAfC79vT4FfGjx1png3wb44Os+JNS837LZf2RfweZ5cTyv88sCoMJG55YZxgZJAr37NfAH7Lv/AASm/wCGbPjr4Z+I/wDwtH/hI/7F+1f8Sz/hH/svnedaywf637U+3Hm7vunO3HGcgA+qvjj+1J8Mf2bv7E/4WN4m/wCEe/trzvsGLC6uvO8ry/M/1ET7cebH97Gd3GcHHV/C34p+GPjT4E0zxl4N1P8Atjw3qXm/Zb37PLB5nlyvE/ySqrjDxuOVGcZHBBr81f8AguX/AM0Txx/yG/8A2wryz9l3/gq1/wAM1/Arwz8OP+FXf8JH/Yv2r/iZ/wDCQfZfO866ln/1X2V9uPN2/eOdueM4AB8/fsFfFHwx8F/2sfA3jLxlqf8AY/hvTPt32u9+zyz+X5lhcRJ8kSs5y8iDhTjOTwCa+1P26P8AjZL/AMIT/wAM5f8AFxP+EK+3f29/zC/sf2v7P9m/4/vJ8zf9kuP9Xu27PmxuXPwD+y58DP8AhpP46+Gfhx/bf/COf219q/4mf2T7V5Pk2ss/+q3puz5W37wxuzzjB/af9hn9hkfsXjxt/wAVt/wmP/CS/Yf+YV9h+zfZ/tH/AE2l37vtHtjb3zwAdZ+wV8LvE/wX/ZO8DeDfGWmf2N4k0z7d9rsvtEU/l+Zf3EqfPEzIcpIh4Y4zg8givz//AGC/2DPjr8Ff2sfAvjLxn4G/sbw3pv277Ve/2vYT+X5lhcRJ8kU7OcvIg4U4zk8AmvoD9qL/AIKtf8M1/HXxN8OP+FXf8JH/AGL9m/4mX/CQfZfO861in/1X2V9uPN2/eOdueM4H3/igA6rX4Bf8FR/+T7Pib/3DP/TXaV+/vavgD9qL/glL/wANKfHXxN8R/wDhaP8Awjn9tfZf+Jb/AMI/9q8nybWKD/W/ak3Z8rd90Y3Y5xkgHv2mftI/Db9pL4U+Ob34e+IB4kstKgVL5jYXNsI9wLAETxpkFVY8ZHHNfFupfDTUPDOqHxD4Fu0068YP5+lyLm3uAWIKBDkYII+U5X7uNvWvjz9h79sG8/ZI+It9eXlhJrngvXYVtdb0iLaHkVd3lyx7uC6b3+UkKwdgSMhl/R23+P37KniWJr/T/i8mkW9yBILC8gnRrfOcoFeMEYPqW6Ag4wa7qcMvxWHnhMwp80ZeRpSxGIwtRVMPK3ddGfL/AIusfAvjGeQanpN18NvFJBYmGEzafMRxkoPmQZ4ygYD3rN0TVPiR8Do4b+ymluvDmd8d3ZyefYyrnP3xkD6Ngj0FfUOveOP2UPE1o1rqfxl0q7tyQQksDfLj0ITIPuOeBU/jX9j34NeAPD2oa/rXxV1nw9oNuymWeYL5cG91RRkJ0LMoGcnnrX53jOGlh3yYGrz0n9me69H/AJn2uGz2hVhbFQs/vX+aPk3xz42vfGV5Za2hH9uXjGfdbMd5G3Dlm4wvX5egxnI4rS8Oabo+g+Re3DJ4z8bXTFbXTLdWkt7NsZDvxiVhydg+X5SSSK+kPA37PnwA+MtrLD4O+L8+tDSY0S8awt1DZkLlGlJjGSdj4/3TXrXgj9k/4Z+Ao5PsPia6nupFCtd3EAMoGc4BCjaM46DsPxjCcP1MRKFHGz5KUekd2uy7eZ11+IcPRw/s8Ldvs9Ffuz5x8BfD+fRbuTV/EMy3niGcMzPO5zbA5yEJBBOMfN26LwTX2p+zXGy+D9YkLF1a5Qbs8bsbiOBj+IHjjkV434K8Yfs+fEDxLZ+HvDXxfi1LWLssbe0sA6ysUjZ22/Jt4UM3I4wcYr6i8KWGn6bp9rpGh2jW+k2/JkYENK3Usc8/j9OgFfrFevgaOCjgsDDlirdLf8Oz85qVK+JruvXd2z8Nf+Con/J9PxL+mmf+mu0r9Vv+Hov7Mf8A0Uw/+CDVP/kavKP2of8AglL/AMNJ/HTxL8Rj8Uf+EcOs/Zf+Jb/wj/2ryfJtYoP9b9qTdnyt33RjdjnGT+Vv7LnwM/4aT+Ovhn4cHWz4d/tr7V/xM/sn2ryfJtZZ/wDVb03Z8rb94Y3Z5xg+AUfv78Df2pfhh+0l/bf/AArnxN/wkX9i+R9v/wBAurXyfO8zy/8AXxJuz5Un3c4284yM8t8Uf29PgV8F/HWp+DfGXjg6N4k03yvtVl/ZF/P5fmRJKnzxQMhykiHhjjODggiuS/Ya/YaH7F3/AAm3/Fbf8Jj/AMJL9i/5hP2H7P8AZ/tH/TeXfu+0e2NvfPH5W/8ABUb/AJPr+JmOn/Es/wDTZaUAfKtff/8AwSk/ai+GP7Nf/C0f+Fj+Jv8AhHf7a/sv7B/oF1ded5P2vzf9RE+3Hmx/exndxnBx8AV9VfsMfsNf8NoDxt/xW3/CHf8ACNfYf+YV9u+0/aPtH/TaLZt8j3zu7Y5AP1U/4ei/sx/9FMP/AIINU/8AkavAP29f28/gV8af2TvHXg3wZ44Os+JNS+w/ZbL+yL+DzPLv7eV/nlgVBhI3PLDOMDkgV+av7UfwM/4Zs+Ovib4cDWz4i/sX7L/xM/sn2XzvOtYp/wDVb32483b945254zgff/8Aw4y/6rZ/5an/AN20AeVf8Epf2ofhj+zYfiiPiP4m/wCEdOtf2X9g/wBAurrzvJ+1+Z/qIn2482P72M7uM4OPn/8Ab1+KPhj40ftY+OfGXg3U/wC2PDep/Yfsl79nlg8zy7C3if5JVVxh43HKjOMjgg19qf8ADjT/AKrZ/wCWp/8AdtH/AA4y/wCq2f8Alqf/AHbQB+qtFFFABRRRQAUh5FLSE4BJ6CgD8gP29P28/jr8Ff2sfHXg3wZ45/sbw3pv2H7LZf2RYT+X5lhbyv8APLAznLyOeWOM4HAAo/YL/bz+Ovxq/ax8C+DfGfjn+2fDepfbvtVl/ZFhB5nl2FxKnzxQK4w8aHhhnGDwSK/QH4o/t6fAr4L+OtT8G+MvHB0bxJpvlfarL+yL+fy/MiSVPnigZDlJEPDHGcHBBFe/0AeU/HL9lv4YftJ/2J/wsbwz/wAJF/Yvn/YP9PurXyfO8vzf9RKm7PlR/ezjbxjJz5X/AMOuv2Y/+iZn/wAH+qf/ACTXyr/wXNGT8E/+43/7YV1f7BX7efwK+C37J3gXwb4z8cHRvEmm/bvtVl/ZF/P5fmX9xKnzxQMhykiHhjjODyCKAOq/ak/Zc+GP7F/wJ8TfGT4N+Gf+EO+JHhr7L/ZWtf2hdX32b7RdRWs37m6llhfdDcSp86HG7IwwBH5/n/gqL+04Rj/hZnH/AGANM/8Akav1V/4ei/sx/wDRTD/4INU/+Rq+Vf25/wDjZOfBP/DOP/Fxf+EL+3f29/zC/sf2v7P9m/4/vJ8zf9kuP9Xu27PmxuXIB+a3xS+KXif40+O9T8ZeMtT/ALZ8Sal5X2q98iKDzPLiSJPkiVUGEjQcKM4yeSTX9PtfAH7Lf7Ufwx/Yv+BPhn4N/GTxN/wh3xI8Nfav7V0X+z7q++zfaLqW6h/fWsUsL7obiJ/kc43YOGBA+gPhd+3p8CvjR460zwb4N8cHWfEmpeb9lsv7Iv4PM8uJ5X+eWBUGEjc8sM4wMkgUAe/0V+f3/BVr9l74m/tKD4XH4ceGf+EiGijVDfn7fa2vk+d9k8r/AF8qbs+VJ93ONvOMjP5B/FL4W+J/gt471Pwb4y0z+xvEmm+V9qsvPin8vzIklT54mZDlJEPDHGcHkEUAfumf+CXP7MZ/5pmf/B/qf/yTXwB/wVZ/Zc+GP7NR+F3/AArjwz/wjv8AbX9qfb839zded5P2Ty/9fI+3HmyfdxndznAx8/8A7BXxR8MfBf8Aax8DeMvGWp/2P4b0z7d9rvfs8s/l+ZYXESfJErOcvIg4U4zk8Amv1/8A+Hon7MnT/hZZz0x/YGqf/I1AHz7+wZ+wR8C/jV+yf4G8Z+MvBLav4k1L7d9qvBq99B5nl39xEnyRTKgwkaDgDOMnkk185/sqftD/ABB/bH+Pnhf4QfF7Xl8WfDzxH9q/tTR1sLaxNx9ntZrqH99bRxyptmgib5XGduDkEg+Hft6/FHwx8aP2sfHPjLwbqf8AbHhvU/sP2S9+zyweZ5dhbxP8kqq4w8bjlRnGRwQa/QD9vX9vP4FfGn9k7x14N8GeODrPiTUvsP2Wy/si/g8zy7+3lf55YFQYSNzywzjA5IFAH2P8Gf2RvhT+z9/a58BeF/7C/tfyftu6/ubrzfK3+X/rpH2481/u4zu5zgY9L/4RbTf+fcV+Nv8AwSl/ai+GP7NZ+KP/AAsfxN/wjv8AbX9l/YP9AurrzvJ+1+Z/qIn2482P72M7uM4OPv8A/wCHov7Mf/RTD/4INU/+RqAPwo+GnxL8R/B/xtp3i7wlqA0rxBp/mfZrs28U4j8yNon+SVWQ5R3HIOM5GCAa99h/4KeftMW4xH8SQg9BoGmf/I1et/st/sufE79i/wCO3hn4yfGTwz/wh3w38Nfav7V1r7fa332b7Ray2sP7m1llmfdNcRJ8iHG7JwoJHqn7dH/GyYeCf+Gcv+Lif8IX9u/t7/mF/Y/tf2f7N/x++T5m/wCyXH+r3bdnzY3LkA+Vf+Ho37Tv/RTP/KBpf/yNX7AfC79gv4FfBfx1pnjLwb4HOjeJNN837Le/2vfz+X5kTxP8ks7IcpI45U4zkYIBr8Afil8LfE/wW8d6n4N8ZaZ/Y3iTTfK+1WXnxT+X5kSSp88TMhykiHhjjODyCK/pS+KXxT8MfBbwJqfjLxlqf9j+G9N8r7Ve/Z5Z/L8yVIk+SJWc5eRBwpxnJ4BNAHxV/wAFWf2ovid+zV/wq4fDjxN/wjg1r+1Pt/8AoFrded5P2Tyv9fE+3HmyfdxndznAwv7Lf7Lnwx/bQ+BPhn4yfGTwz/wmPxI8S/av7V1r+0Lqx+0/Z7qW1h/c2ssUKbYbeJPkQZ25OWJJ+qfgb+1H8Mf2kjrY+HPib/hIjovk/b82F1a+T53meX/r4k3Z8qT7ucbecZGfxX/4Kj/8n2fE3/uGf+mu0oA+Va/VP/ghkMj42A9P+JJ/7f1+a/wt+Fvif40+O9M8G+DdM/tnxJqXm/ZbLz4oPM8uJ5X+eVlQYSNzywzjA5IFe/D/AIJdftOEZ/4Vnx/2H9M/+SaAP2A+KP7BfwK+NHjrU/GXjLwOdZ8Sal5X2q9/te/g8zy4kiT5Ip1QYSNBwozjJySTSft6/FHxP8F/2TvHPjLwbqf9jeJNM+w/ZL37PFP5fmX9vE/ySqyHKSOOVOM5HIBrwD9lv9qP4Y/sX/Anwz8G/jJ4m/4Q74keGvtX9q6L/Z91ffZvtF1LdQ/vrWKWF90NxE/yOcbsHDAgfmr8Uf2C/jr8FvAup+MvGfgcaN4b03yvtV7/AGvYT+X5kqRJ8kU7OcvIg4U4zk4AJoA/Sj/glL+1F8Tv2kx8UR8R/E3/AAkQ0X+y/sH+gWtr5Pnfa/M/1ESbs+VH97ONvGMnPgH7en7efx1+Cv7WPjrwb4M8c/2N4b037D9lsv7IsJ/L8ywt5X+eWBnOXkc8scZwOABXWf8ABDMYPxtB7f2J/wC39fKv/BUf/k+z4m/9wz/012lAH7/UUUUAFFFFABSHpS0h5FAHwB+1F/wSm/4aT+Ovib4j/wDC0f8AhHP7a+zf8Sz/AIR/7V5Pk2sUH+t+1Juz5W77oxuxzjJP2Xf+Crf/AA0n8dfDPw4/4Vf/AMI5/bX2r/iZf8JB9q8nybWWf/VfZU3Z8rb94Y3Z5xg/P/7en7efx1+Cv7WPjrwb4M8c/wBjeG9N+w/ZbL+yLCfy/MsLeV/nlgZzl5HPLHGcDgAV8BfC34peJ/gt470zxl4N1P8AsbxJpvm/Zb3yIp/L8yJ4n+SVWQ5SRxypxnI5ANAH6Uf8FzOT8E+//Ib/APbCvLP2Xf8AglL/AMNJ/Arwz8Rx8Uf+Ec/tr7V/xLP+Ef8AtXk+TdSwf637Um7PlbvujG7HOMn1P9hb/jZN/wAJr/w0b/xcT/hC/sP9g4/4lf2P7X9o+0/8ePk+Zv8Aslv/AKzdt2fLjc2f0q+Fvws8MfBbwJpng3wbpn9j+G9N837LZfaJZ/L8yV5X+eVmc5eRzyxxnA4AFAH86/7LnwN/4aT+Ovhn4cf23/wjv9tfav8AiZfZPtXk+Tayz/6rem7PlbfvDG7POMH7+4/4Iv8A/VYv+Fk/9wP+zv7P/wDAnzvM+3/7G3yv4t3y/mv8Lfil4n+C3jvTPGXg3U/7G8Sab5v2W98iKfy/MieJ/klVkOUkccqcZyOQDX6UfsLj/h5N/wAJsP2jf+LiDwX9h/sH/mF/Y/tf2j7T/wAePkeZv+yW/wDrN23Z8uNzZAPgH9qP45/8NJ/HXxN8R/7EPh3+2vsv/Es+1/avJ8m1ig/1uxN2fK3fdGN2OcZP3/8A8MMf8O2P+Mjv+E2/4WL/AMIX/wAy1/ZX9l/bPtf+gf8AHz503l7Ptfmf6tt2zbxu3D6q/wCHXX7Mf/RMz/4P9U/+Sa9/+KXws8MfGnwJqfg3xlpn9seG9S8r7VZfaJYPM8uVJU+eJlcYeNDwwzjB4JFAHz9+wz+3KP20P+E2z4J/4Q7/AIRr7F/zFvt32j7R9o/6YxbNv2f3zu7Y5/Kz/gqN/wAn1/E3/uGf+my0r6q/bp/41s/8IV/wzl/xbv8A4TT7d/b2f+Jp9s+yfZ/s3/H953l7Ptdx/q9u7f8ANnauPzX+KXxS8T/Gnx3qfjLxlqf9s+JNS8r7Ve+RFB5nlxJEnyRKqDCRoOFGcZPJJoA+1f2ov+CUv/DNfwK8TfEf/haP/CR/2L9m/wCJZ/wj/wBl87zrqKD/AFv2p9uPN3fdOduOM5HlX7DP7DP/AA2h/wAJt/xW3/CHf8I19i/5hX277T9o+0f9N4tm3yPfO7tjn90vil8LPDHxp8Can4N8ZaZ/bHhvUvK+1WX2iWDzPLlSVPniZXGHjQ8MM4weCRXKfA79lv4Y/s3f23/wrnwz/wAI9/bXk/b8391ded5XmeX/AK+V9uPNk+7jO7nOBgA/AL9qP4Gf8M2/HXxN8Of7b/4SL+xfsv8AxM/sn2XzvOtYp/8AVb32483b945254zgfVX7UX/BKX/hmz4FeJviN/wtH/hI/wCxfsv/ABLP+Ef+y+d511FB/rftT7cebu+6c7ccZyP0q+KP7BfwK+NHjrU/GXjLwOdZ8Sal5X2q9/te/g8zy4kiT5Ip1QYSNBwozjJySTX5q/st/tR/E79tD47eGfg38ZPE3/CY/DfxL9q/tXRfsFrY/afs9rLdQ/vrWKKZNs1vE/yOM7cHKkggHwDznpX39+y7/wAEpv8AhpP4FeGfiP8A8LR/4Rz+2vtX/Es/4R/7V5Pk3UsH+t+1Juz5W77oxuxzjJ+//wDh11+zHj/kmf8A5X9U/wDkmvgD9qT9qP4nfsX/AB28TfBv4N+Jv+EO+G/hr7L/AGVov2C1vvs32i1iupv311FLM+6a4lf53ON2BhQAAD9U/wBqP4Gf8NJfArxN8Of7b/4R3+2vsv8AxM/sn2ryfJuop/8AVb03Z8rb94Y3Z5xg+U/sNfsNf8MX/wDCbE+Nv+Ex/wCEl+xf8wn7D9n+z/aP+m8u/d9o9sbe+eOs/b1+KPif4L/sneOfGXg3U/7G8SaZ9h+yXv2eKfy/Mv7eJ/klVkOUkccqcZyOQDX5Af8AD0X9pwcf8LM4/wCwBpf/AMjUAL/wVGH/ABnX8TMf9Qz/ANNlpXq37UX/AAVa/wCGlPgV4m+HH/Crv+Ec/tr7L/xM/wDhIPtXk+TdRT/6r7Km7PlbfvDG7POMH6p/Zb/Zc+GP7aHwJ8M/GT4yeGf+Ex+JHiX7V/autf2hdWP2n7PdS2sP7m1lihTbDbxJ8iDO3JyxJPqv/Drr9mP/AKJmf/B/qn/yTQB8q/8ABDP/AJrZ/wBwT/2/r5V/4Kj/APJ9nxN/7hn/AKa7Sv2o+Bv7Lfwx/Zs/ts/Djwz/AMI7/bXkfb/9PurrzvJ8zyv9fK+3HmyfdxndznAx+K//AAVH/wCT7Pib/wBwz/012lAHlP7Lnxz/AOGbPjr4Z+I/9if8JF/Yv2r/AIlv2v7L53nWssH+t2Ptx5u77pztxxnI+/8A/h+YDx/wpP8A8uv/AO4q/KygHBBHUUAfqp/wwx/w8n/4yN/4Tb/hXX/Caf8AMtf2V/an2P7J/oH/AB8+dD5m/wCyeZ/q1279vO3cfv79qP4GD9pP4FeJvhx/bY8O/wBtfZf+Jn9k+1eT5N1FP/qt6bs+Vt+8Mbs84wfws+F37enx1+C3gXTPBvgzxwNG8N6b5v2Wy/siwn8vzJXlf55YGc5eRzyxxnAwABXVf8PRv2nf+imf+UDS/wD5GoA/VP8AYZ/YZ/4Yu/4Tb/itv+Ex/wCEl+xf8wr7D9m+z/aP+m8u/d5/tjb3zx+Vv/BUbn9uv4mf9wz/ANNlpSf8PRv2nf8Aopn/AJQNL/8Akav0A/Zb/Zc+GP7aHwJ8M/GT4yeGf+Ex+JHiX7V/autf2hdWP2n7PdS2sP7m1lihTbDbxJ8iDO3JyxJIB9/0UUUAFFFFABSE4BJ6ClpD0oA8B+KP7enwK+C/jrU/BvjLxwdG8Sab5X2qy/si/n8vzIklT54oGQ5SRDwxxnBwQRXKf8PRf2Y/+imH/wAEGqf/ACNX5V/8FRuP26/iZ/3DP/TZaV9Vf8OMv+q2f+Wp/wDdtAH1V/w9F/Zj/wCimH/wQap/8jUf8PRf2Y/+imH/AMEGqf8AyNXyr/w4z/6rb/5an/3bR/w4y/6rZ/5an/3bQB9Vf8PRf2Y/+imH/wAEGqf/ACNXqnwN/ak+GH7Sf9t/8K58Tf8ACRf2L5H2/wD0C6tfJ87zPK/18Sbs+VJ93ONvOMjP5W/tRf8ABKX/AIZr+BXib4jn4o/8JH/Yv2X/AIlv/CP/AGXzvOuooP8AW/an2483d905244zkeqf8EMuT8bP+4J/7f0Acn+3p+wZ8dfjV+1j468ZeDPA39s+G9S+w/Zb3+17CDzPLsLeJ/klnVxh43HKjOMjgg18rfsFfFHwx8F/2sfA3jLxlqf9j+G9M+3fa737PLP5fmWFxEnyRKznLyIOFOM5PAJr+ijFfysUAf0pfA39qP4Y/tJf22Phz4m/4SI6L5H2/wD0C6tfJ87zPL/18Sbs+VJ93ONvOMjP5q/t6fsGfHX41ftY+OvGXgzwN/bPhvUvsP2W9/tewg8zy7C3if5JZ1cYeNxyozjI4INeA/sM/tzf8MX/APCbf8UT/wAJj/wkv2L/AJiv2H7N9n+0f9MZd+77R7Y2988fVX/D83/qif8A5df/ANxUAfKv/BLj/k+z4Zf9xP8A9Nd3X1T/AMFzf+aJ/wDcb/8AbCvVf2Xf+CUv/DNfx18M/Ef/AIWj/wAJH/Yv2r/iW/8ACP8A2XzvOtZYP9b9qfbjzd33TnbjjOR5X/wXM5/4Un/3G/8A2woA/Kuv6qK/Fb9l3/glKP2k/gV4Z+I//C0f+Ec/tr7V/wASz/hH/tXk+TdSwf637Um7PlbvujG7HOMn9qM0AeV/HL9qP4Y/s2nRB8RvE3/COnWvP+wYsLq687yfL8z/AFET7cebH97Gd3GcHHVfC34p+GPjT4E0zxl4N1P+2PDepeb9lvfs8sHmeXK8T/JKquMPG45UZxkcEGvn/wDbn/Ya/wCG0P8AhCv+K2/4Q7/hGvtv/MK+3faftH2f/pvFs2/Z/fO7tjn1X9lv4Gf8M2fArwz8Of7b/wCEi/sX7V/xM/sn2XzvOupZ/wDVb32483b945254zgAH4rf8Ouf2nf+iZ/+V/S//kmvv/8A4JTfsu/E79mv/haP/Cx/DP8Awjv9tf2X9g/0+1uvO8n7X5n+olfbjzY/vYzu4zg48r/4fm/9UT/8uv8A+4q+qf2Gf25h+2ifG3/FE/8ACHf8I39h/wCYt9u+0/aPtH/TGLZt+z++d3bHIB8Vft6fsGfHX41ftY+OvGXgzwN/bPhvUvsP2W9/tewg8zy7C3if5JZ1cYeNxyozjI4INfoB+3r8LvE/xo/ZO8c+DfBumf2z4k1P7D9ksvtEUHmeXf28r/PKyoMJG55YZxgckCvf+K8q/aj+Of8Awzb8CvE3xG/sT/hIv7F+y/8AEs+1/ZfO866ig/1ux9uPN3fdOduOM5AB+AXxz/Zc+J37No0Q/Ebwz/wjo1rz/sH+n2t153k+X5n+olfbjzY/vYzu4zg48qr6q/bm/bl/4bQ/4Qr/AIon/hDj4a+2/wDMV+3faftH2f8A6YRbNvke+d3bHPyrQB/T78Uvin4Y+C3gTU/GXjLU/wCx/Dem+V9qvfs8s/l+ZKkSfJErOcvIg4U4zk8AmuU+Bv7Ufwx/aSOtj4c+Jv8AhIjovk/b82F1a+T53meX/r4k3Z8qT7ucbecZGT9qP4G/8NJ/ArxN8OP7b/4R3+2vsv8AxMvsn2ryfJuop/8AVb03Z8rb94Y3Z5xg+VfsM/sM/wDDF/8Awm3/ABW3/CY/8JL9i/5hX2H7N9n+0f8ATeXfu+0e2NvfPAB+Vn/BUf8A5Ps+Jv8A3DP/AE12lfun8Uvin4Y+C3gTU/GXjLU/7H8N6b5X2q9+zyz+X5kqRJ8kSs5y8iDhTjOTwCa/Cv8A4Kjf8n1/E3/uGf8ApstK/VX/AIKjH/jBT4mf9wz/ANOdpQB8Af8ABVv9qL4Y/tJn4X/8K58Tf8JF/Yv9qfb82F1a+T532Ty/9fEm7PlSfdzjbzjIz8AV9VfsNfsM/wDDaH/CbZ8bf8Id/wAI19i/5hX277T9o+0f9Notm37P753dsc/VP/DjL/qtn/lqf/dtAH6q0UUUAFFFFABSHpS0h6UAfgF/wVH/AOT7Pib/ANwz/wBNdpX6/ft6/FHxP8F/2TvHPjLwbqf9jeJNM+w/ZL37PFP5fmX9vE/ySqyHKSOOVOM5HIBr8gf+Co//ACfZ8Tf+4Z/6a7Sv1U/4Kj/8mJ/E3/uGf+nS0oA/Kr/h6L+04OB8TOP+wBpf/wAjUf8AD0b9p3/opn/lA0v/AORq+VqKAP3+/wCCo/8AyYn8Tf8AuGf+nS0r5V/4IY9fjZ/3BP8A2/r6q/4Kj/8AJifxN/7hn/p0tK+VP+CGXH/C7P8AuCf+39AH6q1/KvX6Uft6fsGfHX41ftY+OvGXgzwN/bPhvUvsP2W9/tewg8zy7C3if5JZ1cYeNxyozjI4INfqr8Uvin4Y+C3gTU/GXjLU/wCx/Dem+V9qvfs8s/l+ZKkSfJErOcvIg4U4zk8AmgD+YIHBr9f/ANgr9gz4FfGn9k7wL4y8Z+BzrPiTUvt32q9/te/g8zy7+4iT5Ip1QYSNBwozjJ5JNcp+3QP+Hk58Ej9nL/i4h8F/bv7e/wCYX9j+1/Z/s3/H95Hmb/slx/q923Z82Ny5+VP+HXP7Tv8A0TP/AMr+l/8AyTQB7/8AsF/t5/HX41ftY+BfBvjPxz/bPhvUvt32qy/siwg8zy7C4lT54oFcYeNDwwzjB4JFfpV8cv2W/hh+0kNE/wCFjeGf+Ei/sXz/ALB/p91a+T53l+b/AKiVN2fKj+9nG3jGTn8rP2W/2XPid+xf8dvDPxk+Mnhn/hDvhv4a+1f2rrX2+1vvs32i1ltYf3NrLLM+6a4iT5EON2ThQSP1T+Bv7Unww/aSGt/8K58Tf8JF/Yvkfb/9AurXyfO8zy/9fEm7PlSfdzjbzjIyAflZ+1J+1H8Tv2L/AI7eJvg38G/E3/CHfDfw19l/srRfsFrffZvtFrFdTfvrqKWZ901xK/zucbsDCgAeU/8AD0b9p3/opn/lA0v/AORq/YD4o/t6fAr4L+OtT8G+MvHB0bxJpvlfarL+yL+fy/MiSVPnigZDlJEPDHGcHBBFfj//AMOuf2nf+iZ/+V/S/wD5JoAP+Hov7Th4PxM4/wCwBpf/AMjV+v8A+wV8UfE/xo/ZO8DeMvGWp/2z4k1P7d9rvfs8UHmeXf3ESfJEqoMJGg4UZxk8kmvyA/4dc/tO/wDRM/8Ayv6X/wDJNH/Drn9p3/omf/lf0v8A+SaAP1V/4ddfsx/9EzP/AIP9U/8AkmvlT9uj/jWx/wAIT/wzj/xbr/hNPt39vf8AMU+2fZPs/wBm/wCP7z/L2farj/V7d2/5s7Vx8rf8EuP+T7Phl/3E/wD013dff3/BVr9l34nftJj4XH4c+Gf+EiGi/wBqfb/9PtbXyfO+yeX/AK+VN2fKk+7nG3nGRkA+AP8Ah6N+07/0Uz/ygaX/API1erfst/tR/E79tD47eGfg38ZPE3/CY/DfxL9q/tXRfsFrY/afs9rLdQ/vrWKKZNs1vE/yOM7cHKkg/pT+wV8LvE/wX/ZO8DeDfGWmf2N4k0z7d9rsvtEU/l+Zf3EqfPEzIcpIh4Y4zg8givyB/wCCXH/J9nwy/wC4n/6a7ugD9VP+HXX7MY5/4Voc/wDYf1T/AOSa/ID9vX4XeGPgv+1j458G+DdM/sfw3pn2H7JZfaJZ/L8ywt5X+eVmc5eRzyxxnA4AFf0Udq/AL/gqP/yfZ8Tf+4Z/6a7SgBP+Ho37Tv8A0Uz/AMoGl/8AyNQf+Cov7ThGD8TMj/sAaX/8jV7/APsF/sGfHX4K/tY+BfGXjPwN/Y3hvTft32q9/tewn8vzLC4iT5Ip2c5eRBwpxnJ4BNe//wDBVr9l34nftJj4XH4ceGf+EiGi/wBqfb/9PtbXyfO+yeX/AK+VN2fKk+7nG3nGRkA/IP4pfFLxP8afHep+MvGWp/2z4k1LyvtV75EUHmeXEkSfJEqoMJGg4UZxk8kmvtT9lv8Aaj+J37aHx28M/Bv4yeJv+Ex+G/iX7V/aui/YLWx+0/Z7WW6h/fWsUUybZreJ/kcZ24OVJB+K/il8LfE/wW8d6n4N8ZaZ/Y3iTTfK+1WXnxT+X5kSSp88TMhykiHhjjODyCK/dP8A4Kj/APJifxN/7hn/AKdLSgD5U/bn/wCNbI8E/wDDOX/Fu/8AhNPt39vf8xT7Z9k+z/Zv+P7zvL2fa7j/AFe3dv8AmztXH2r+wV8UfE/xo/ZO8DeMvGWp/wBs+JNT+3fa737PFB5nl39xEnyRKqDCRoOFGcZPJJr8LPgb+y58Tv2khrZ+HPhn/hIhovkfb839ra+T53meX/r5U3Z8qT7ucbecZGeV+KXwt8T/AAW8d6n4N8ZaZ/Y3iTTfK+1WXnxT+X5kSSp88TMhykiHhjjODyCKAP6faKKKACiiigApD0paQ9KAPwC/4Kj/APJ9nxN/7hn/AKa7Sv2o/aj+Bv8Aw0n8CvE3w4/tv/hHf7a+y/8AEy+yfavJ8m6in/1W9N2fK2/eGN2ecYP4r/8ABUf/AJPs+Jv/AHDP/TXaUn/D0b9p3/opn/lA0v8A+RqAPqr/AIcZf9Vs/wDLU/8Au2j/AIcZf9Vs/wDLU/8Au2vlX/h6N+07/wBFM/8AKBpf/wAjUf8AD0b9p3/opn/lA0v/AORqAP1V/wCCo3P7CnxM/wC4Z/6c7SvlT/ghl1+Nn/cE/wDb+viv4o/t6fHX40+BdT8G+M/HA1nw3qXlfarL+yLCDzPLlSVPnigVxh40PDDOMHIJFfav/BDI5PxsJ/6gn/t/QB+qeK/Ff9qL/gq3/wANKfArxN8OP+FXf8I5/bX2X/iZ/wDCQfavJ8m6in/1X2VN2fK2/eGN2ecYP7U1/KvQB+qf/BDQ/wDJbM/9QT/2/r1X9qL/AIKs/wDDNnx18TfDj/hV3/CR/wBi/Zv+Jn/wkH2XzvOtYp/9V9lfbjzdv3jnbnjOB+VnwM/ak+J37Ng1sfDjxN/wjv8AbXkfb/8AQLW687yfM8r/AF8T7cebJ93Gd3OcDH6qfst/sufDH9tD4E+GfjJ8ZPDP/CY/EjxL9q/tXWv7QurH7T9nupbWH9zayxQptht4k+RBnbk5YkkA+qv2o/gZ/wANJ/ArxN8Of7a/4R3+2vsv/Ez+yfavJ8m6in/1W9N2fK2/eGN2ecYPlH7DX7DX/DF//CbZ8bf8Jj/wkv2L/mE/Yfs/2f7R/wBNpd+7z/bG3vnj6sr8/wD/AIKtftR/E79ms/C7/hXHib/hHf7a/tT7f/oFrded5P2Tyv8AXxPtx5sn3cZ3c5wMAHwD/wAFRv8Ak+v4mY6f8Sz/ANNlpX1T/wAPzf8Aqif/AJdf/wBxV6t+y3+y58Mf20PgT4Z+Mnxk8M/8Jj8SPEv2r+1da/tC6sftP2e6ltYf3NrLFCm2G3iT5EGduTliSfzV/YK+F3hj40ftY+BvBvjLTP7Y8N6n9u+12X2iWDzPLsLiVPniZXGHjQ8MM4weCRQB9q/8PzM/80S/8uv/AO4q+/v2XPjn/wANJ/Arwz8Rv7EHh3+2vtX/ABLPtf2ryfJupYP9bsTdnyt33RjdjnGT5X/w66/ZjPP/AArQ5/7D+qf/ACTXwB+1J+1H8Tv2L/jt4m+Dfwb8Tf8ACHfDfw19l/srRfsFrffZvtFrFdTfvrqKWZ901xK/zucbsDCgAAHqo/YY/wCHbB/4aO/4Tb/hYv8Awhf/ADLX9lf2X9s+1/6B/wAfPnTeXs+1+Z/q23bNvG7cPqj9hn9uYftof8JtnwT/AMId/wAI19i/5i3277T9o+0f9MYtm3yPfO7tjn8gvij+3p8dfjT4F1Pwb4z8cDWfDepeV9qsv7IsIPM8uVJU+eKBXGHjQ8MM4wcgkVyvwN/ak+J/7N39t/8ACufE3/CO/wBteT9v/wBAtbrzvJ8zy/8AXxPtx5sn3cZ3c5wMAH9KQr8Av+CXH/J9nwy/7if/AKa7uv1+/YK+KPif40fsneBvGXjLU/7Z8San9u+13v2eKDzPLv7iJPkiVUGEjQcKM4yeSTX5A/8ABLj/AJPs+GX/AHE//TXd0Afqn+3N+3N/wxf/AMIT/wAUT/wmP/CS/bf+Yt9h+zfZ/s//AEwl37vtHtjb3zx+K/7Unxz/AOGk/jr4m+I/9if8I7/bX2X/AIlv2v7V5Pk2sUH+t2Juz5W77oxuxzjJ/f345fsufDH9pL+xD8RvDP8AwkR0Xz/sH+n3Vr5PneX5n+olTdnyo/vZxt4xk5/Cz9vX4XeGPgv+1j458G+DdM/sfw3pn2H7JZfaJZ/L8ywt5X+eVmc5eRzyxxnA4AFAH9FHFIQMV+AX/D0b9p3/AKKZ/wCUDS//AJGo/wCHo37Tv/RTP/KBpf8A8jUAff8A+1F/wSl/4aT+Ovib4j/8LR/4Rz+2vsv/ABLf+Ef+1eT5NrFB/rftSbs+Vu+6Mbsc4yfK/wDhuf8A4eT/APGOP/CE/wDCuv8AhNP+Zl/tX+1Psf2T/T/+PbyYfM3/AGTy/wDWLt37udu0/Kn/AA9G/ad/6KZ/5QNL/wDkav2A+F37BfwK+C/jrTPGXg3wOdG8Sab5v2W9/te/n8vzInif5JZ2Q5SRxypxnIwQDQByX7DP7DI/Yv8A+E2/4rb/AITH/hJfsX/MJ+w/Z/s/2j/ptLv3ef7Y2988eV/tRf8ABKX/AIaT+Ovib4j/APC0f+Ec/tr7L/xLf+Ef+1eT5NrFB/rftSbs+Vu+6Mbsc4yT/gq1+1F8Tv2av+FXD4ceJv8AhHBrX9qfb/8AQLW687yfsnlf6+J9uPNk+7jO7nOBj4A/4ejftO/9FM/8oGl//I1AH7/0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9k=";
    const jstext = "扫码关注公众号获取更多资讯!<br>点击左侧通道即可免费观看,卡顿或失败切换通道即可!"
    const videoSites = [
        "qq.com",
        "sohu.com",
        "iqiyi.com",
        "youku.com",
        "mgtv.com",
        "le.com",
        "1905.com",
        "pptv.com",
        "bilibili.com",
        "miguvideo.com"
    ];
    const currentUrl = document.location.href;
    if (self != top) {
        return;
    }
    var result = videoSites.some(site=>{
        if (currentUrl.match(site)) {
            return true;
        }
        return false;
    })
    if(!result){
        return;
    }
    if(iconWidth<30){
        iconWidth=30;
    }
    if(developMenuHeight<(iconWidth*2.6)){
        developMenuHeight=iconWidth*2.6;
    }
    var uaLogo="pc";
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        uaLogo="mobile";
    }
    const globalStyle = "cursor:pointer;width:auto;height:auto;position:fixed;left:"+iconMarginLeft+"px;top:"+iconMarginTop+"px;z-index:2147483647;";
    const mainIconStyle = "height:"+iconHeight+"px;width:"+iconWidth+"px;background:"+iconbg+";border-radius:"+(iconFilletPercent*iconWidth)+"px;box-sizing:border-box;box-shadow:-4px 4px 4px 0px rgba(0,0,0,0.4);";
    const triangleStyle = "border-left:"+(iconWidth*0.3)+"px solid "+secondColor+";border-top:"+(iconHeight*0.2)+"px solid transparent;border-bottom:"+(iconHeight*0.2)+"px solid transparent;position:absolute;right:31%;top:30%;";
    const squareStyle = "background:"+secondColor+";width:"+(iconWidth*0.26)+"px;height:"+(iconWidth*0.26)+"px;position:absolute;right:37%;top:37%;";
    const inMenuBoxStyle = "width:110%;height:110%;overflow-y:scroll;overflow-x:hidden;";
    const outMenuBoxStyle = "background:"+mianColor+";height:0px;overflow:hidden;font-size:"+(iconWidth*0.2)+"px;width:"+(iconWidth*6)+"px;position:absolute;left:0px;top:"+iconHeight+"px;box-shadow:-4px 4px 4px 0px rgba(0,0,0,0.4);border-radius:13px 0 1px 13px;transition:height "+developMenuSecond+"s;-moz-transition:height "+developMenuSecond+"s;-webkit-transition:height "+developMenuSecond+"s;-o-transition:height "+developMenuSecond+"s;";
    const MenuItemsStyle = "color:"+fontsColor+";display: block;padding:"+(iconWidth*0.12)+"px "+(iconWidth*0.12)+"px "+(iconWidth*0.12)+"px "+(iconWidth*0.2)+"px ;width:"+(iconWidth*1.5)+"px;";
    const IframeStyle = "frameborder='no' width='100%' height='100%' allowfullscreen='true' allowtransparency='true' frameborder='0' scrolling='no';";
    const imgbase64style = "width: 160px;height: 160px;";
    const ggwei = "position: absolute;right: 0;width: 160px;";
    const jsstyle = "color:#ffffff;";
    var classAndIDMap	= {
        "pc":
        {
            "qq.com":"mod_player｜tenvideo_player|player-container|player__container",
            "iqiyi.com":"flashbox",
            "youku.com":"ykPlayer",
            "mgtv.com":"mgtv-player-wrap",
            "sohu.com":"sohuplayer|x-player",
            "le.com":"fla_box",
            "1905.com":"player",
            "pptv.com":"pplive-player",
            "miguvideo.com":"mod-player",
            "bilibili.com":"bilibili-player|bpx-player-container｜bilibili-player-video-wrap|player-limit-mask"
        },
        "mobile":{
            "qq.com":"mod_player｜tenvideo_player|player-container|player__container",
            "iqiyi.com":"m-box",
            "youku.com":"h5-detail-player",
            "mgtv.com":"video-area",
            "sohu.com":"sohuplayer|player-view",
            "le.com":"playB",
            "1905.com":"player",
            "pptv.com":"pp-details-video",
            "miguvideo.com":"mod-player",
            "bilibili.com":"bilibili-player|bpx-player-video-wrap｜bpx-player-container｜bilibiliPlayer|player-wrapper"}
    };
    createIcon();
    document.onreadystatechange = function(){
        if(document.readyState == 'complete'){
            if(!document.getElementById("mainIcon")){
                createIcon();
            }
        }
    }
    function createIcon(){
        try{
            var div = document.createElement("div");
            div.style.cssText = globalStyle;
            div.setAttribute("id","mainIcon");
            var html = "<div id='mainButton' style='"+mainIconStyle+"'><div id='triangle' style='"+triangleStyle+"'></div></div><div id='dropDownBox' style='"+outMenuBoxStyle+"'><div style='"+ggwei+"'><img style='"+imgbase64style+"' src="+imgbase64+" /><p style='"+jsstyle+"'>"+jstext+"</p></div><div style="+inMenuBoxStyle+">";
            for(var i in parseInterfaces){
                if(i==parseInterfaces.length-1){
                    html += "<span class='spanStyle' style='"+MenuItemsStyle+"' url='"+parseInterfaces[i].url+"'>"+parseInterfaces[i].name+"</span>";
                }else{
                    html += "<span class='spanStyle' style='"+MenuItemsStyle+"border-bottom-style:solid;' url='"+parseInterfaces[i].url+"'>"+parseInterfaces[i].name+"</span>";
                }
            }
            html += "<br/><br/></div></div>";
            div.innerHTML = html;
            document.body.insertBefore(div,document.body.firstChild);
            div.onclick = function() {
                var dropDownBox = document.getElementById("dropDownBox").style.height;
                var mainButton = document.getElementById("mainButton");
                var triangle = document.getElementById("triangle");
                if(dropDownBox == "0px"){
                    mainButton.style.borderRadius = (iconFilletPercent*iconWidth)+"px "+(iconFilletPercent*iconWidth)+"px 0 0";
                    triangle.removeAttribute("style");
                    triangle.setAttribute("style",triangleStyle);
                    document.getElementById("dropDownBox").style.height = developMenuHeight+"px";
                }else{
                    document.getElementById("dropDownBox").style.height = "0px";
                    triangle.removeAttribute("style");
                    triangle.setAttribute("style",triangleStyle);
                    mainButton.style.borderRadius = (iconFilletPercent*iconWidth)+"px";
                }
            }
            var elements = document.getElementsByClassName("spanStyle");
            for(var j in elements){
                elements[j].addEventListener('click',function(){
                    this.style.color = clkColor;
                    var parseInterface = this.getAttribute("url");
                    for(let key in classAndIDMap[uaLogo]){
                        if (document.location.href.match(key)) {
                            var values = classAndIDMap[uaLogo][key].split("|");
                            var labelType = "";
                            var class_id = "";
                            for(let value in values){
                                if(document.getElementById(values[value])){
                                    class_id = values[value];
                                    labelType = "id";
                                    break;
                                }
                                if(document.getElementsByClassName(values[value]).length>0){
                                    class_id = values[value];
                                    labelType = "class";
                                    break;
                                }
                            }
                            if(class_id!=""){
                              //  var iframe = "<iframe id='iframePlayBox' src='"+parseInterface+document.location.href+"' "+IframeStyle+" ></iframe>";
                              //  if(labelType=="id"){
                              //      document.getElementById(class_id).innerHTML="";
                               //     document.getElementById(class_id).innerHTML=iframe;
                               // }else{
                               //     document.getElementsByClassName(class_id)[0].innerHTML="";
                               //     if(uaLogo=="mobile"){
                                //        document.getElementsByClassName(class_id)[0].style.height="225px";
                                //    }
                                 //   document.getElementsByClassName(class_id)[0].innerHTML=iframe;
                               // }
                                GM_openInTab(`${parseInterface}${document.location.href}`, { active: true });
                                return;
                            }
                        }
                    }
                })
            }
        }catch(error){
        }
    }
    // Your code here...
})();