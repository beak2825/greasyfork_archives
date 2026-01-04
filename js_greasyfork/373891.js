// ==UserScript==
// @name         Filmezz.eu Komment szűrő
// @namespace    http://tampermonkey.net/
// @version      0.4.9.3 Alpha
// @description  Eltávolítja a más oldalakat hírdető kommenteket, amik az utóbbi időben nagyon elszapordtak az oldalon...
// @author       Reklám Gyűlülő
// @grant        none
// @include      *://filmezz.eu/online/*
// @downloadURL https://update.greasyfork.org/scripts/373891/Filmezzeu%20Komment%20sz%C5%B1r%C5%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373891/Filmezzeu%20Komment%20sz%C5%B1r%C5%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cucc="article:contains('89FILM.BLOGSPOT.COM'),article:contains('amazonfilm88'),article:contains('AMAZONFILM88.BLOGSPOT.COM'),article:contains('ａｍｂｅｒｗａｔｉ.ｂｌｏｇｓｐｏｔ.ｃｏｍ'),article:contains('ANDROIDFILMFR.BLOGSPOT.COM'),article:contains('article.media/hassanah'),article:contains('article.media/movie5'),article:contains('article.media/watch6'),article:contains('articles.watch/show6'),article:contains('ｂｉｔ.ｌｙ/２ＣｄＬｎＥ７'),article:contains('BOXCINEMART26.BLOGSPOT.COM'),article:contains('ＢＯＸＣＩＮＥＭＡＲＴ２６.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('CINEMAZONE11.BLOGSPOT.COM'),article:contains('CINEMAZONK26.BLOGSPOT.COM'),article:contains('cutt.us'),article:contains('cutt.us/MSdq8'),article:contains('cutt.us/pbFVM'),article:contains('DAILYPRO88.BLOGSPOT.COM'),article:contains('FILMCOMPLETENSTREAM.BLOGSPOT.COM'),article:contains('FILMESON8.BLOGSPOT.COM'),article:contains('ＦＩＬＭＥＳＯＮ８.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('FILMEZ25.BLOGSPOT.COM'),article:contains('FILMEZZ1EU.BLOGSPOT.COM'),article:contains('FILMEZSTREAM.BLOGSPOT.COM'),article:contains('FILMEZZSTREAM26.BLOGSPOT.COM'),article:contains('FILMSONLINE7.BLOGSPOT.COM'),article:contains('FREE WATCH'),article:contains('full.watch'),article:contains('full.watch/filmez'),article:contains('full.watch/filmezz'),article:contains('full.watch/filmzstream'),article:contains('full.watch/kanazawa'),article:contains('fullmovies12018.blogspot.com'),article:contains('great.social/'),article:contains('great.social/aryapm'),article:contains('great.social/stars1moviefilmez'),article:contains('https://netmozi.com/'),article:contains('https://tinyurl.com/y9ae6bho'),article:contains('HULUBOTAKSTREAM.BLOGSPOT.COM'),article:contains('HULUBOTASTREAM.BLOGSPOT.COM'),article:contains('IMAXSTREAMING.BLOGSPOT.COM'),article:contains('KINGSMOVIE25.BLOGSPOT.COM'),article:contains('life.movie'),article:contains('life.movie/production'),article:contains('media.movie/filmez'),article:contains('METIJUANTI66.BLOGSPOT.COM'),article:contains('Mocskos féreg a filmezz eu!'),article:contains('movies21extream.blogspot.com'),article:contains('MOVIESIN.BLOGSPOT.COM'),article:contains('MOVIESTREAM10VF.BLOGSPOT.COM'),article:contains('NEWSTREAMING21.BLOGSPOT.COM'),article:contains('pages.today'),article:contains('pages.today/watchfilmezz'),article:contains('PAPYSTREAMHD.BLOGSPOT.COM'),article:contains('Play & Download No Buffering'),article:contains('po.st/iDBHsi'),article:contains('production.movie'),article:contains('production.movie/watchfilmezz'),article:contains('putlocker10.master'),article:contains('putlocker10.master-movies'),article:contains('putlocker10.master-movies.ᴄᴏᴍ'),article:contains('PUTLOCKERVMOVIES21.BLOGSPOT.COM'),article:contains('RAIHANDARELHILMY.BLOGSPOT.COM'),article:contains('ray.watch/senjufimezz'),article:contains('ＳＡＮＭＯＶＥ.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('ｓｅｎｊｕｍｏｖｉｅ.ｂｌｏｇｓｐｏｔ.ｃｏｍ'),article:contains('SENJUMOVIE.BLOGSPOT.COM'),article:contains('STARCOMPLETE21.BLOGSPOT.COM'),article:contains('STARFILMEN.BLOGSPOT.COM'),article:contains('STARFILMSTROMING.BLOGSPOT.COM'),article:contains('STREAM MOVIE & TV SHOW'),article:contains('Stream or Download your Favorite MOVIE & TV SHOW Full Acces'),article:contains('STREAMING FULL VERTION'),article:contains('STREAMINGVF21.BLOGSPOT.COM'),article:contains('STREAMMOVIE24.BLOGSPOT.COM'),article:contains('streammovies'),article:contains('STREAMWAY10.BLOGSPOT.COM'),article:contains('STREAMZT.BLOGSPOT.COM'),article:contains('Szuper film. de ez egy rossz példány!'),article:contains('t.co/0KcXKvhsBe'),article:contains('t.co/9ymgk0thpq'),article:contains('t.co/NirdnF45FY'),article:contains('t.co/so6i65ElSS'),article:contains('telegra.ph'),article:contains('TODOPELIS4K.BLOGSPOT.COM'),article:contains('VERPELICULASTAVAS.BLOGSPOT.COM'),article:contains('watch.email/movie5'),article:contains('watches.movie'),article:contains('watches.movie/streaming7'),article:contains('watches.movie/streaming9'),article:contains('WATCHFILMEZZ.BLOGSPOT.COM'),article:contains('ＷＡＴＣＨＦＩＬＭＥＺＺ.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('ZONECINEMART.BLOGSPOT.COM'),article:contains('ＺＯＮＥＣＩＮＥＭＡＲＴ.ＢＬＯＧＳＰＯＴ.ＣＯＭ')";

    var badDivs = $(cucc);
    //Write out the amount of blocked comment in the title
    if (badDivs.length!=0){
            document.title="("+badDivs.length+"🙈) "+document.title;
    }
    //Block number end
    badDivs.remove ();
    //Ugyanolyan kommentek törlése START
    function SameDeleter()
    {
        var articles = document.getElementsByClassName("row comment ");
        var temp1;
        var temp2;
        var i=0;
        var j;
        for (i = 0; i < articles.length-1; i++)
        {
            temp1=articles[i].innerHTML;
            //Get the comment text
            temp1=temp1.substring(temp1.lastIndexOf("<div"));
            temp1=temp1.substring(0, temp1.indexOf("</div>"));
            temp1=temp1.substring(temp1.indexOf(">")+1);
            //END
            for (j=i+1; j < articles.length; j++)
            {
                temp2=articles[j].innerHTML;
                //Get the comment text
                temp2=temp2.substring(temp2.lastIndexOf("<div"));
                temp2=temp2.substring(0, temp2.indexOf("</div>"));
                temp2=temp2.substring(temp2.indexOf(">")+1);
                //END
                if (temp1==temp2)
                {
                    articles[j].remove();
                }
            }
        }
    };
    //Ugyanolyan kommentek törlése VÉGE
    SameDeleter();
    SameDeleter();
    //Kommentek számozásának javítás(alapból nem működöttt jól az oldalon...)
        var comments=document.getElementsByClassName("col-xs-3 no-gutter num");
        var pluszkommentekszama= document.getElementById("tobbihsz").innerHTML;
        var idk=Number(pluszkommentekszama.substring(pluszkommentekszama.indexOf("(")+1,pluszkommentekszama.indexOf(")")));
        var i;
        for (i = 0; i < comments.length; i++) {
            comments[i].innerHTML="<span>"+(comments.length-i+idk)+"</span>";
        }
    //Kommentke számozásának javítása vége

    //Other thing

         //injection
              //String operation to modify onclick event
    var div1=document.getElementById('tobbihsz').innerHTML;
    var string1=div1.substring(0,div1.indexOf("morehsz()"))
    var string2="morehsz();SameDeleter();SameDeleter();Deleter();CommentNumber();\" />";
    var AllString=string1+string2;
    document.getElementById("tobbihsz").innerHTML = AllString;
              //Inject thesse functions
    var c=function ClickDelete()
    {
        var cucc="article:contains('89FILM.BLOGSPOT.COM'),article:contains('amazonfilm88'),article:contains('AMAZONFILM88.BLOGSPOT.COM'),article:contains('ａｍｂｅｒｗａｔｉ.ｂｌｏｇｓｐｏｔ.ｃｏｍ'),article:contains('ANDROIDFILMFR.BLOGSPOT.COM'),article:contains('article.media/hassanah'),article:contains('article.media/movie5'),article:contains('article.media/watch6'),article:contains('articles.watch/show6'),article:contains('ｂｉｔ.ｌｙ/２ＣｄＬｎＥ７'),article:contains('BOXCINEMART26.BLOGSPOT.COM'),article:contains('ＢＯＸＣＩＮＥＭＡＲＴ２６.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('CINEMAZONE11.BLOGSPOT.COM'),article:contains('CINEMAZONK26.BLOGSPOT.COM'),article:contains('cutt.us'),article:contains('cutt.us/MSdq8'),article:contains('cutt.us/pbFVM'),article:contains('DAILYPRO88.BLOGSPOT.COM'),article:contains('FILMCOMPLETENSTREAM.BLOGSPOT.COM'),article:contains('FILMESON8.BLOGSPOT.COM'),article:contains('ＦＩＬＭＥＳＯＮ８.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('FILMEZ25.BLOGSPOT.COM'),article:contains('FILMEZZ1EU.BLOGSPOT.COM'),article:contains('FILMEZSTREAM.BLOGSPOT.COM'),article:contains('FILMEZZSTREAM26.BLOGSPOT.COM'),article:contains('FILMSONLINE7.BLOGSPOT.COM'),article:contains('FREE WATCH'),article:contains('full.watch'),article:contains('full.watch/filmez'),article:contains('full.watch/filmezz'),article:contains('full.watch/filmzstream'),article:contains('full.watch/kanazawa'),article:contains('fullmovies12018.blogspot.com'),article:contains('great.social/'),article:contains('great.social/aryapm'),article:contains('great.social/stars1moviefilmez'),article:contains('https://netmozi.com/'),article:contains('https://tinyurl.com/y9ae6bho'),article:contains('HULUBOTAKSTREAM.BLOGSPOT.COM'),article:contains('HULUBOTASTREAM.BLOGSPOT.COM'),article:contains('IMAXSTREAMING.BLOGSPOT.COM'),article:contains('KINGSMOVIE25.BLOGSPOT.COM'),article:contains('life.movie'),article:contains('life.movie/production'),article:contains('media.movie/filmez'),article:contains('METIJUANTI66.BLOGSPOT.COM'),article:contains('Mocskos féreg a filmezz eu!'),article:contains('movies21extream.blogspot.com'),article:contains('MOVIESIN.BLOGSPOT.COM'),article:contains('MOVIESTREAM10VF.BLOGSPOT.COM'),article:contains('NEWSTREAMING21.BLOGSPOT.COM'),article:contains('pages.today'),article:contains('pages.today/watchfilmezz'),article:contains('PAPYSTREAMHD.BLOGSPOT.COM'),article:contains('Play & Download No Buffering'),article:contains('po.st/iDBHsi'),article:contains('production.movie'),article:contains('production.movie/watchfilmezz'),article:contains('putlocker10.master'),article:contains('putlocker10.master-movies'),article:contains('putlocker10.master-movies.ᴄᴏᴍ'),article:contains('PUTLOCKERVMOVIES21.BLOGSPOT.COM'),article:contains('RAIHANDARELHILMY.BLOGSPOT.COM'),article:contains('ray.watch/senjufimezz'),article:contains('ＳＡＮＭＯＶＥ.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('ｓｅｎｊｕｍｏｖｉｅ.ｂｌｏｇｓｐｏｔ.ｃｏｍ'),article:contains('SENJUMOVIE.BLOGSPOT.COM'),article:contains('STARCOMPLETE21.BLOGSPOT.COM'),article:contains('STARFILMEN.BLOGSPOT.COM'),article:contains('STARFILMSTROMING.BLOGSPOT.COM'),article:contains('STREAM MOVIE & TV SHOW'),article:contains('Stream or Download your Favorite MOVIE & TV SHOW Full Acces'),article:contains('STREAMING FULL VERTION'),article:contains('STREAMINGVF21.BLOGSPOT.COM'),article:contains('STREAMMOVIE24.BLOGSPOT.COM'),article:contains('streammovies'),article:contains('STREAMWAY10.BLOGSPOT.COM'),article:contains('STREAMZT.BLOGSPOT.COM'),article:contains('Szuper film. de ez egy rossz példány!'),article:contains('t.co/0KcXKvhsBe'),article:contains('t.co/9ymgk0thpq'),article:contains('t.co/NirdnF45FY'),article:contains('t.co/so6i65ElSS'),article:contains('telegra.ph'),article:contains('TODOPELIS4K.BLOGSPOT.COM'),article:contains('VERPELICULASTAVAS.BLOGSPOT.COM'),article:contains('watch.email/movie5'),article:contains('watches.movie'),article:contains('watches.movie/streaming7'),article:contains('watches.movie/streaming9'),article:contains('WATCHFILMEZZ.BLOGSPOT.COM'),article:contains('ＷＡＴＣＨＦＩＬＭＥＺＺ.ＢＬＯＧＳＰＯＴ.ＣＯＭ'),article:contains('ZONECINEMART.BLOGSPOT.COM'),article:contains('ＺＯＮＥＣＩＮＥＭＡＲＴ.ＢＬＯＧＳＰＯＴ.ＣＯＭ')";

        var Shit = $(cucc);
        //Write out the amount of blocked comments in the title
            if (isNaN(document.title.substring(1,2))==true)
                {
                  if (Shit.length!=0)
                  {
                      document.title="("+Shit.length+"🙈) "+document.title;
                  }
                  else
                  {

                  }
                }
            else
                {
                    document.title="("+(Number(document.title.substring(1,document.title.indexOf("🙈")))+Shit.length)+document.title.substring(document.title.indexOf("🙈"));
                }
        //Block number end
            Shit.remove ();
        SameDeleter();
        SameDeleter();
        //Kommentek számozásának javítás(alapból nem működöttt jól az oldalon...)
        var comments=document.getElementsByClassName("col-xs-3 no-gutter num");
        var i;
        for (i = 0; i < comments.length; i++) {
            comments[i].innerHTML="<span>"+(comments.length-i)+"</span>";
        }
        //Kommentke számozásának javítása vége
    };
    var t=function Timer()
    {
           document.removeEventListener('mouseover', ClickDelete);
    };
    var s=function Deleter()
    {
           document.addEventListener('mouseover', ClickDelete);
           setTimeout(function(){ Timer(); }, 3000);
    };
    var p=function SameDeleter()
    {
        var articles = document.getElementsByClassName("row comment ");
        var temp1;
        var temp2;
        var i=0;
        var j;
        for (i = 0; i < articles.length-1; i++)
        {
            temp1=articles[i].innerHTML;
            //Get the comment text
            temp1=temp1.substring(temp1.lastIndexOf("<div"));
            temp1=temp1.substring(0, temp1.indexOf("</div>"));
            temp1=temp1.substring(temp1.indexOf(">")+1);
            //END
            for (j=i+1; j < articles.length; j++)
            {
                temp2=articles[j].innerHTML;
                //Get the comment text
                temp2=temp2.substring(temp2.lastIndexOf("<div"));
                temp2=temp2.substring(0, temp2.indexOf("</div>"));
                temp2=temp2.substring(temp2.indexOf(">")+1);
                //END
                if (temp1==temp2)
                {
                    articles[j].remove();
                }
            }
        }
    };
    var q=function CommentNumber()
    {
        var comments=document.getElementsByClassName("col-xs-3 no-gutter num");
        var i;
        for (i = 0; i < comments.length; i++)
        {
            comments[i].innerHTML="<span>"+(comments.length-i)+"</span>";
            console.log(comments[i]);
        }
    };
               //Injection procedure(inject to head)
    var script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML=(String(c)+"\n"+String(t)+"\n"+String(s)+"\n"+String(p)+"\n"+String(q));

    document.getElementsByTagName('body')[0].appendChild(script1);


    // Your code here...

})();