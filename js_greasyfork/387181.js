// ==UserScript==
// @name         Password Generator
// @description  When triggered by visiting a specific web address, the script generates a password, copies it to the clipboard and closes the tab. Default trigger is to google the word "password"
// @author       Hagbard Hednig
// @include      http://google.*q=password&*
// @include      https://google.*q=password&*
// @include      http://www.google.*q=password&*
// @include      https://www.google.*q=password&*
// @include      http://google.*q=password
// @include      https://google.*q=password
// @include      http://www.google.*q=password
// @include      https://www.google.*q=password
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.close
// @grant        GM_log
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// @icon         data:image/jpeg;base64,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
// @version      1.02
// @namespace https://greasyfork.org/users/295378
// @downloadURL https://update.greasyfork.org/scripts/387181/Password%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/387181/Password%20Generator.meta.js
// ==/UserScript==


function randomstring() {
    var length=60; //length of password
    var ArryBuilder=[
        [1], //if set to 1, password will contain capital (upper case) letters
        [1], //if set to 1, password will contain miniscule (lower case) letters
        [1], //if set to 1, password will contain symbols (symbols like #, % and so on.)
        [1], //if set to 1, password will contain numbers
        [0], //if set to 1, password will contain capital special letters (Ë, É and so on)
        [0]]; //if set to 1, password will contain miniscule special letters (ë, é and so on)
    var StrOut; //StringOut is the string the output string
    var Arry=[['a']];
    function rand(range){
        var x=0;
        while(x<1){
            x=Math.round(Math.random()*(range+1));
            if(x==(range+1)){
                x=0;}}
        var y=x-1;
        return y;}
    var Cap=[
        ['A'],
        ['B'],
        ['C'],
        ['D'],
        ['E'],
        ['F'],
        ['G'],
        ['H'],
        ['I'],
        ['J'],
        ['K'],
        ['L'],
        ['M'],
        ['N'],
        ['O'],
        ['P'],
        ['Q'],
        ['R'],
        ['S'],
        ['T'],
        ['U'],
        ['V'],
        ['W'],
        ['X'],
        ['Y'],
        ['Z']];
    var Min=[
        ['a'],
        ['b'],
        ['c'],
        ['d'],
        ['e'],
        ['f'],
        ['g'],
        ['h'],
        ['i'],
        ['j'],
        ['k'],
        ['l'],
        ['m'],
        ['n'],
        ['o'],
        ['p'],
        ['q'],
        ['r'],
        ['s'],
        ['t'],
        ['u'],
        ['v'],
        ['w'],
        ['x'],
        ['y'],
        ['z']];
    var Sym=[
        ['“'],
        ['/'],
        ["'"],
        ['!'],
        ['@'],
        ['¨'],
        ['^'],
        ['~'],
        ['"'],
        ['='],
        ['½'],
        ['§'],
        ['½'],
        ['('],
        [')'],
        [']'],
        ['&'],
        ['}'],
        ['<'],
        ['>'],
        ['.'],
        [','],
        [':'],
        ['#'],
        [';'],];
    var Num=[
        ['0'],
        ['1'],
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
        ['7'],
        ['8'],
        ['9']];
    var Euc=[
        ['Á'],
        ['À'],
        ['Ä'],
        ['Â'],
        ['Ã'],
        ['Å'],
        ['É'],
        ['È'],
        ['Ë'],
        ['Ê'],
        ['Í'],
        ['Ì'],
        ['Ï'],
        ['Î'],
        ['Ó'],
        ['Ò'],
        ['Ö'],
        ['Ô'],
        ['Õ'],
        ['Ú'],
        ['Ù'],
        ['Ü'],
        ['Û'],
        ['Ý']];
    var Eum=[
        ['á'],
        ['à'],
        ['ä'],
        ['â'],
        ['ã'],
        ['å'],
        ['é'],
        ['è'],
        ['ë'],
        ['ê'],
        ['í'],
        ['ì'],
        ['ï'],
        ['î'],
        ['ó'],
        ['ò'],
        ['ö'],
        ['ô'],
        ['õ'],
        ['ú'],
        ['ù'],
        ['ü'],
        ['û'],
        ['ý']];
    var p=0;
    if(ArryBuilder[0]==1){
        p=0;
        while(p<Cap.length){
            Arry[Arry.length]=Cap[p];
            p++;}}
    if(ArryBuilder[1]==1){
        p=0;
        while(p<Min.length){
            Arry[Arry.length]=Min[p];
            p++;}}
    if(ArryBuilder[2]==1){
        p=0;
        while(p<Sym.length){
            Arry[Arry.length]=Sym[p];
            p++;}}
    if(ArryBuilder[3]==1){
        p=0;
        while(p<Num.length){
            Arry[Arry.length]=Num[p];
            p++;}}
    if(ArryBuilder[4]==1){
        p=0;
        while(p<Euc.length){
            Arry[Arry.length]=Euc[p];
            p++;}}
    if(ArryBuilder[5]==1){
        p=0;
        while(p<Eum.length){
            Arry[Arry.length]=Eum[p];
            p++;}}
    StrOut=Arry[rand(Arry.length)];
    while(StrOut.length<length){
        StrOut=StrOut+Arry[rand(Arry.length)];}
    GM_setClipboard(StrOut, {type:'text'});
    window.close();}
window.addEventListener('load', randomstring());