// ==UserScript==
// @name         Aftership notes
// @namespace    tech.myip.jess.aftership.notes
// @version      1.0.1
// @description  Attach notes to tracking numbers on Aftership
// @author       J. Jones
// @license      CC-BY-NC-SA-4.0
// @match        https://www.aftership.com/track/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aftership.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442046/Aftership%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/442046/Aftership%20notes.meta.js
// ==/UserScript==

var blankSticky='data:image/png;base64,'+
                'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAACGVBMVEUAAADv6LTp3Lrv5rDv5rTw6Lvw57jt5Kjt5Knt46nu5q/v57Du5q7x6sD08c/s4qTu5avw6bf079Dv57bx7MTw5sny7b/s4qPv6LTt5Knu5q/08tH289Pu5q3078vz7s3v5rbw577z7sz18tr1'+
                '8dPx7bzo14/x7Lzw6rfw6bbp2JPs4qXv6LPt5Kju5q3q257x6rzu5rH189Lz8svu5q318tfw6r329Njw6Lzgzsf189ru5q/x68X19Nnw6rbr4aDy78Px7b3w6rbt46rw6rXy7sLq25np2JTt46jy7sHs4qPUrpbu56/q2pnTn4jPqp3v57HKlIXv57P18tD18tH08tDp'+
                '2Zjw6LvMpZf189Xr3KLx8bn39N7z7Mnu6rX29d/v57P189fz8dfy7Mb289rt46Lz8Mft46Px7b7t46Ts4qDy78Lu5aju5qrw6rbv56/v6LHx7bvt5aby78Tw67js4p/w67ny7sDv567v563u5qzv6bTw6bLw6rTt5Kf19M3t4qPw6LPw6rXt5aXt5aPo1o3v6bPk0o3f'+
                'zYb08sjt56Xk2qDXxH3JiGvw7Lrq3Z/dy4XZxoDTwHi9gG3y7bzs57Xo3qfg2J3r4Jzl2Zvm0oi7rITUjG3MhGuacmKTbWGMa1/q4KXg0JfRyJXYxpTczo/GuIzUqYXYmn3SmnfMj3a0iHDbkG6ge2rAfGm5e2iueGegcWOBaV3EQCFqAAAAZXRSTlMAbASqazog593J'+
                'uYFwbyHugmxNNhMO+fHizsCBfXlYSj4sJxgJ7u7o5tvZ1tHFsqyqp42Ef3h1c2FdT0VANvj28fHw8Ozo5OPg2tnTxMS5tq2nnZuYjIqAcnBvbWpkZF1GQDUvK01hMnMAAANKSURBVEjH1dZnUxNRFAbgBQIqVapUpUkTpQsi2HvvvWu2JrskYYEAgdClhA7Swd7rL/Tc'+
                'e3ezcUMSnPGLZ2cgQ/LMe97NhUD9u9l38VbwX4qp71OXE30+XRcBU7kVJqIyIyMjEubu2W8u1/KFB0F4DEGxsQaDIdYQG1lHyM2DMgzP80aeDDz4uLz0xfXjVS+PnpDhgoEvc1cI2bvNqBtm7MOnJdfKypsh3c/lMpXwetP7fmrt19rXYQa9jjHCBcNxjBxCSNQ65MXn'+
                'n6ur7yAEE45RHvB7FBIDxMssLr7u1Tbi8DfO6Ic4maEhVaDFOLyZkwnXEf8DpINLJcQQE/DV6HJyVpPpHDkS9zfxAQn0AGE2pxBSE5AAwqLVXpyLyfZABJqTjJaWwo0RspTJbG+RGpITN0QYRUgNXe0FCZjEnfJH8K0C0Co19Dva8nMI2cz7zehBxWGp9rZucWe0QmQ/'+
                'xNljNStCbGxSyA4/KU7G6iksh58FJFADhCR1ObqRYJPqCfG1mPpuSFK7Q2xEgk2qxWT/Gd53cZMZLdUvio0AmgXhNiaPdimEYbwy1Bpi0zTLsoIgVJEUH6THREQ/Ko4zbDSdhklmyjqLObkeqGHHGaoQaJq+phGv4h1WOLiS1NAmahkwVzEJ3UKIvoYdnSpUY5R1C1u5'+
                'D6IVd4CwoOJE0EK1QmR9CCqur4FDkh6vQxiGHHWo4cCCRJAMNj9Hvxgpjn5j0VLazR3sREPbxFIKT/xuD0JECyoOp8qCM2hhfn54eHb25diJbG/i9HzHSQRksOMjk5MTzxfyMimFpMqM2sNq1ReHHp0zIyMT4wN9J0MpZZ6Gy4qApUx2u17QncMQMdBXlEWpk6UQfKug'+
                'uO5UAXk7AuJ8GOWe7Esyo94q/HfEQY66KgaFcRAlnp+c0SGIYIGXckCEJoDMgLjxx+dzWIgMxclRJxlaDRgbPbaQV+MJMIHiVpLh6NafEcHSVxRPeRFco1WCrVThPiPN7FxJAqUnZUZSQyuuCXb06B2o4ZVitOJz2N4PGaMAQCgRFjE8i/KehKjw1OLC5OSCY0cONDZN'+
                'u0+u7dDx06VxPv+TCU5MyInOflJ7ryo9Pa2i/HpFWnr1w/roXOp/mt/3WeStcwjOZQAAAABJRU5ErkJggg==';
var writeSticky='data:image/png;base64,'+
                'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAC91BMVEUAAAD963z96oP+6mT+63P+7nrz2Yj+6mX+7HP88Kf89Kv96oL775f884v9+LH+7HD87o7765T+6V7+8H3+62n69bT24bH+84j+6mT+6mX+73z+73b+7XH+7G797HP+7HD962z89rz986P69Lz+'+
                '7HT86XT59L/+95D+6V3/8Xz+2D3+9pL920f+6WL974f9+K38+LD8+KX77or7+LT89sf663zZsaP87pj88qv+6Ff96V3+2Tn88oT+6WX+2DjWgkz920naZzPJeVv73lv82krKUjD963f8+Kv82kn8+KL87IbHcFH83Fv//4P97p/98JX797n/6Fr++Zz/6FX/6Fj/7Wz+'+
                '+Zn+9pP+9Ij++Jf/7Wn95lr+9Y7+8X3/7Wf/6Vv98n7++JT/8Xr/7nH+9IX+6l3+62H+9pD/73OQgzP+9Yr/7m7+62OViDX/8Hf/7GT44lj+8oH/8Hb+6mD/9Yzs11Pfy0/Ou0j65Fjy3Va5qUOBdS3+84L652P131bjz1DZxkyKfjJtZCfSv0nJt0eaizZ3bCvvxypz'+
                'aSlLRBw3Mxf//qf34Fjn1FKVjkutnT2kljt7cSxZUyZqYCVlXCRfVyJTTB3/+5/463zg13n/8Fzu2FirolX/6FK4rFHGtEaqnkW/rkSpmjydkDmfkTj/1zRTTSTjux5GQBksKBHRQwbw5Xz46XK+t2vTx2O5sWD/8l7/7FvNwFnHuljay1e+slWNiVPcyE2OhkS2pkCw'+
                'oD6Rhz13cDpuaDpuZi5CPyFBOxhpHQHHwnfv4nPo2WqopGjj013/6lj94VGDgE6elUqflEKGfj+unj371DX30DWEeTLnvyLgthUxLREnIw4REAgICAPoRwD/9pLw6Izc1oPk3H3Y0HHd026vq2n24mfw3GL12E3LuUfDsUSyoj9bVzH80SvjXxe0Lgi9MwTWNgCFHwCU'+
                'kVzryUvYv0lzcEeTiUHBoT6ykje/pjKrhjHbfiw8NxWoSBKFMg6hKgN7KgFRHQHBKwBfnmHNAAAAUXRSTlMAazzbqWwEyIFMISAR+39wbyvu5YI1C+zs5tzPwbu3sXl2WE5FNxjx8e7n4d/OqpqNgnVxY2NdQC328fDp4NfTxLm2rKunnYyKhYByb21kYEBNJiyOAAAF'+
                'QUlEQVRIx9XVVXATURQG4ODaQnF3d3d3hxttumkjDYWlDQ0SJ9o0JKHu7tRwd9ri7u7u7vbAXUm6IfDADC/8k8lkZufL2XPu2YT27zJo3PSqfymePHk6sdEfLw+ujqUBTPXqbdq0qQMzc/SP4uJnYwdWwVMBvojUGUyQaUPTGQwGk5LDhx8/u3y5+OvLFIZLmOmTCNKv'+
                'CxO4ZsORx8WXi789f7X+lyvplUky7FfCTPn4tOx72RfVBuoVPh8wSFKXrEItI/v8vKzsraMIH5BhtCZJPezKvehYablJCX/3ISQFFwQi61AJIvlU6FJn/foUPnAEScXFXH4rahUDatNY8zSZiug8Q65JI2fqDCqFTK/IRnRqeWipZJtOrlqypAVBKkCCmC3WC/bYBEX8'+
                'pUtFsZrohMg84/koY05eoRXsLAyNl9hKrejm4OAWxErMasIEMs1ORIXoZSfjd+iwllThelWYEiBAD4AyLFyOSFNVAX4+Ps0JMhsSBGAJsyYYwO/DXxLk58NikaRdU8dkZDnAGcRFzMWET2Bgs0YkYQAsUlCeMIme/CQPwUYVEAxrBM6fX782hehCd5aLEFRN1sqJMyPS'+
                'uQFBxzey/OcvXkiSGiOZQBeJZofIEIMBB8ZYVB+5TR4VknO+MCrKaMrSGvOP529ZKPId0YkglRjAfMEYa9PsKM2FIrQo4UFoJioxWS1x6kxNnCRKbSndG3PigMhX0LgmTtpDIjXsMCsRgD6Awi4HlEgDtNqsvRm7t8Mai5ZB4qjiiBKAbUqXUQXAUW3K2JKBCbF35yFu'+
                'xGXIzlH5H9su8sWEt0fDPxLDGSl+fpgIhKMS+a7anZa8lMdrj5MOlZjOr5aCzJNKII+SmGVAKsNqHNqVtTptU5LgRMQqDx5nXv9yogoJVWuyNSb0jCU6ugiV2Ox5cfFL/Hx25dtiYmJK0iL2eC/lcYTCtk6ijI+xSCy22DhUrjahip2SbbJwtUXrw9qYcWD1Td9Vq9at'+
                '4V3hcNlsT5xU7AlJJtauLBy+K/WOUd2BOwJPXCRYJvZesHQeR8ims3uTxK19OKqgID8WC28cF7x5sAadTidJNSfROVcdPhyYWEgRdBhuH1eiQtWk0GfBNgL9F+MC3hTvihDWgBH2dyEK431yR3JMxzERsV20f/c6RxswbK7HHAq5nxAfFylBFabI3EJ79CGW/4H8kohj'+
                'uy+uwwSXEEJe405OIjWelyjUCnNkLpor2bR5y23/+Rv3pK27Kb7ugbWRuAImMZEr6EXD07EaE5xMCAfAuVWsQKLxRd6wcXhTnLt3U1Pv3NYe6eHlIAwQVv6MB1Max0+cm+ixvODcubPLH3WrSCPSsAXDMVt81aHYskkkwBYXa5xLX5FUUHB2+emVUJAZ0pLhrBHsp4Wn'+
                'ccK+VrAoKS1iDS7oK1LPYWKUF80Rr1aQ6OQ77mUHBG3eu3H12pKitTcE4u1H12zden3ri30Hj74vgGJMLZozNVunA0WRKcZqy9p1Ye+bY/kXI+wX9zx8uM++5+jWS68PHrxVsPzUyvG1aRRSOR2YsxFEe2jzrjMZa/ev3p+UnJx8I/nqtavXSm7R2YlJUExx+X+uVZlB'+
                'POPOUYnFxKjo+9bAtWKHPRo+kApwwsd+QIlVh6exTEzdEY73qR4daW4EjgoKf0Jgi0vZkQVHJpBtUAmTPPHFInexrMkM2IYbORwECVUIuQSYJ/Zt5UVzT+26LVs2b9asfv2uXQnB4XDxLjp3796rBlnCPVUb1e5U06th+wFtPT37Tu0zua+nZ9sBDWs2ov1P+QmmeAAx'+
                'ryHkfQAAAABJRU5ErkJggg==';

var docURL = document.URL;
var tslash = docURL.lastIndexOf('track/')+6;
var tID = docURL.substring(tslash).replace('/','-');
var noteId = 'sticky_'+tID;

var note=GM_getValue(noteId, '');


$(window).ready(function() {
    var nav = $('nav');
    var body = $('body');
    $(nav).prepend('<span id="stickyNote"></span>');
    $(body).prepend('<span id="stickyBox" style="display:none; position:fixed; width:200px; height:150px; z-index:9999; background-color:#ff9; padding:10px; border: 1px solid #cc0;"></span>');
    var stickyCtrl = $('#stickyNote');
    var stickyBox = $('#stickyBox');
    var img = blankSticky;
    if (note != '') img = writeSticky;
    $(stickyCtrl).prepend('<img src="'+img+'" id="stickyImage">');
    var stickyImage = $('#stickyImage');
    $(stickyCtrl).mouseover(function(e) {
        stickyBox.innerHTML = "LOREM IPSUM";
        $(stickyBox).css('top',e.pageY - window.scrollY - 5 + "px");
        $(stickyBox).css('left',e.pageX - window.scrollX - 5 + "px");
        $(stickyBox).css('display','block');
    });
    $(stickyBox).mouseleave(function() {
        $(stickyBox).css('display','none');
    });
    $(stickyBox).prepend('<textarea id="stickyText" style="font-family:Ink Free; font-size:16pt; font-weight:bold; background:transparent; width:180px; height:130px; border:0; outline:none; resize:none;"></textarea>');
    var stickyText = $('#stickyText');
    if (note != '') $(stickyText).val(note);
    $(stickyText).keyup(function() {
        var oldnote = note;
        note = $(stickyText).val();
        if (note == '' && oldnote != '') $(stickyImage).attr('src',blankSticky);
        if (note != '' && oldnote == '') $(stickyImage).attr('src',writeSticky);
        GM_setValue(noteId, note);
    });
});