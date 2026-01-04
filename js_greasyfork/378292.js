// ==UserScript==
// @name         PregChan Download Button
// @namespace    https://twitter.com/goawaynowgan
// @version      1.2
// @description  Adds a button to image posts to download the image with it's original filename.
// @author       GanBat
// @include      https://pregchan.com/*
// @include      http://pregchan.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wIaEjM3ShSQNgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAOFSURBVGje7Zp/SJVXGMc/51Wudn316prVqP0GxbwYWc3Jqm0yphEZRbOgwf6K3ASj3AaDQa5/gzbaXUVCjf1g7I79YK4hhqQhajcKLGW6cIuJk7JM7y+9V+rsD03YvMv33ntevS/c75/v+/Kc7/ec5zzP93BeASAH3UsIP9iCFLUI1oOwA4LEggQmgSvI+y5CKedEYZVfyL8b7QSDRxDiHWAJ1kAYHnyJd+LdVCYCFQjtbQuRB7CBthc9o01DiFrAjvWQjib3ayA2YF0UpyLVpc747Xt0ffwNXndrxPdZu1+l9OAesnJzFI0o0jWV1ab/vOd/yQN4v71A//nLKldAaCqjTfmD85cPX0BpDmlYHEkBSQFJAUkBi4vUOZ5VSvN9cYxjCCHmFxDpI9VQOUZyDyTcHngUAmM++po9hLyR/czdrt55Y9zt6qUjJSXiuzSHTsHrL2B36OYI6Gu+xB8fnI5rxkIXrzF08doj9gcU7yozJ4Uee26l6SkR7RhRCXh2fQGrT9SZRj7/+AGeKc43dxMXlpeYIiL/+AGKtr60MFVItQij5CM1wJjLqCoR0cx8pAYYVx+IV0SsaaO0kcUqQgV5ZZ04WhGqyCu1EkZFqCSv3AsVlpew+mTdgpEHEHLAPac2jdwcpsfdQnjMZyiIzaFTUr1j1sP0NHXxW82xf31T4DqIc0spAMFxP5dO/Uh43G8sfnYmzt2vkfv0CmNeyHP0a4JNnqhmonX4Dq98tA+7Q8dZ8SJ8dmhWxH/Jtx5uINDYGVV8z+Attn5aZ2wFvnu+KqblzNhWOisCYPj3vwB4Iu+puMg/xBsD7vjc6Lx2u7GTVuDl+n1kZOuzxKetuJ+2+tjJK7HTRkW03PPhrNnF0pmcvXNzmN4T3xNq71ncA41hz9/ewxUTyCbkkVLk2A09SzgBYrmDsjYXOz1nyPukFoDMnZvY1v05le2nebx6e2IL0DetYemqZWiaxpMzh5gVG9eQrtuxpdtYWeo0107HC9+5TgavDxD0BrjRMn1rM/hLO6NDI3hHxvjz147YO/HPbx0xpWLEg7TNRVSe/TDiCswRUPz+m6RtdCYU+XXv7Y14SBNywB3AmvfEgJzQgKtYFYJuDXnfBYSsN/lyCkmDhl1vREoXMGEh+mGE/AIt+IMAkDe+ygLbdjS5H8Rapn/8SLzfbQSTILuRNDApfhKFVaP/ANE1OUsaW1/TAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/378292/PregChan%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/378292/PregChan%20Download%20Button.meta.js
// ==/UserScript==

// This script and its icon use FontAwesome icons, licensed under Creative Commons Attribution 4.0 International.
// https://fontawesome.com/license
// The only change made to the icon is color.

(function() {
    'use strict';
    var $ = window.jQuery;
    $("head").append ('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/solid.css" integrity="sha384-r/k8YTFqmlOaqRkZuSiE9trsrDXkh07mRaoGBMoDcmA58OHILZPsk29i2BsFng1B" crossorigin="anonymous">');
    $("head").append ('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/fontawesome.css" integrity="sha384-4aon80D8rXCGx9ayDt85LbyUHeMWd3UiBaWliBlJ53yzm9hqN21A+o1pqoyK04h+" crossorigin="anonymous">');

    $('.fileinfo').each(function() {
        var $dlsrc = $(this).children("a").first();
        var fnorig
        if ( $(this).find("span.postfilename").attr('title') == undefined ) {
            fnorig = $(this).find("span.postfilename").html();
        } else {
            fnorig = $(this).find("span.postfilename").attr('title');
        }
        $dlsrc.after(' <a href="'+ $dlsrc.attr('href') +'" download="'+ fnorig +'"><i class="fas fa-download"></i></a>');
    });

})();