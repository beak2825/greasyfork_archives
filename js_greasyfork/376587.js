// ==UserScript==
// @name        Samatika Movie Fix
// @namespace   negev
// @author      negev
// @include     https://www.samatika.com/bbs/board.php*
// @include     https://samatika.com/bbs/board.php*
// @version     0.3.1
// @grant       none
// @description Samatika 네이버 영화정보를 고칩니다.
// @downloadURL https://update.greasyfork.org/scripts/376587/Samatika%20Movie%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/376587/Samatika%20Movie%20Fix.meta.js
// ==/UserScript==
(function() {
    var movieposter = document.getElementsByClassName('poster');
    var section1 = movieposter.item(0);
    var imglink = section1.getAttribute('src');
    var strArray=imglink.split('/');
    var movieid= strArray[7].split('_');
    var str;
    if(isFinite(movieid[0])){
        str = "<a target=\"_blank\" href=\"http://movie.naver.com/movie/bi/mi/basic.nhn?code="+movieid[0]+"\">네이버 영화정보</a>&nbsp;";
    }else{
        var newid = strArray[6].substr(1, 3);
        newid += movieid[0].substr(3, 2);
        str = "<a target=\"_blank\" href=\"http://movie.naver.com/movie/bi/mi/basic.nhn?code="+newid+"\">네이버 영화정보</a>&nbsp;";
    }
    var movieinfo = document.getElementsByClassName('nv_info');
    var section2 = movieinfo.item(0);
    section2.innerHTML=str;
})();