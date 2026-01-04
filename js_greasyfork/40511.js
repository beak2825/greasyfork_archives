// ==UserScript==
// @name        巴哈，文章文字顏色反轉
// @namespace   color
// @description 巴哈姆特，文章文字顏色反轉
// @include     http://forum.gamer.com.tw/*
// @include     http://guild.gamer.com.tw/guild.php?*
// @include     http://forum.gamer.com.tw/post1.php?*
// @include     https://forum.gamer.com.tw/*
// @include     https://guild.gamer.com.tw/guild.php?*
// @include     https://forum.gamer.com.tw/post1.php?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40511/%E5%B7%B4%E5%93%88%EF%BC%8C%E6%96%87%E7%AB%A0%E6%96%87%E5%AD%97%E9%A1%8F%E8%89%B2%E5%8F%8D%E8%BD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/40511/%E5%B7%B4%E5%93%88%EF%BC%8C%E6%96%87%E7%AB%A0%E6%96%87%E5%AD%97%E9%A1%8F%E8%89%B2%E5%8F%8D%E8%BD%89.meta.js
// ==/UserScript==



/*
* 巴哈姆特，文章文字顏色反轉
* 將巴哈姆特文章的顏色反轉
* 例如:黑色文字→白色文字、深藍色→淺黃色
* 可避免「深色主題」的深色文字看不清楚的問題
*
* 最後修改日期：2018 / 04 / 12
* 作者：hbl917070(深海異音)
* http://home.gamer.com.tw/homeindex.php?owner=hbl917070
*/

//--------------------------------------------------------------



var m =new Main();

m.fun_文字底色與顏色();
m.fun_表格tr();
m.fun_表格td();


//--------------------------------------------------------------


function Main() {


  this.fun_文字底色與顏色 = function(){

    var obj;
    if(location.href.indexOf("http://forum.gamer.com.tw/post1.php?") > -1){// 進入【編輯文章時也將文章反轉顏色
     // obj = editor.document.getElementsByTagName("font"); //google Chrome不用
    }else{
      obj = document.getElementsByTagName("font");
    }


    for(var i=0 ; i<obj.length ; i++){

      var b = turnColor_rgb(obj[i].style.backgroundColor) ;//文字背景色
      if(b!= "" ){
        obj[i].style.backgroundColor =  b ;
      }

      var c = turnColor(obj[i].color)+"";//文字顏色
      if(c!= "" ){
        obj[i].color =   c ;
      }
    }

  }


  this.fun_表格tr = function(){

    var obj = document.getElementById("BH-master").getElementsByTagName("tr");
    for(var i=0 ; i<obj.length ; i++){
      var b = turnColor_rgb(obj[i].bgColor ) ;//表格背景色
      if(b!= "" ){
        obj[i].bgColor  =  b ;
      }
    }

  }

  this.fun_表格td = function(){

    var obj = document.getElementById("BH-master").getElementsByTagName("td");
    for(var i=0 ; i<obj.length ; i++){
      var b = turnColor_rgb(obj[i].bgColor ) ;//表格背景色
      if(b!= "" ){
        obj[i].bgColor  =  b ;
      }
    }

  }



  function turnColor(c) {/*文字顏色*/

    var cc = [
      new Array("windowtext","#000000"), new Array("black","#000000"),new Array("aliceblue","#f0f8ff"),new Array("cadetblue","#5f9ea0"),new Array("lightyellow","#ffffe0"),new Array("coral","#ff7f50"),new Array("dimgray","#696969"),new Array("lavender","#e6e6fa"),new Array("darkcyan","#008b8b"),new Array("lightgoldenrodyellow","#fafad2"),new Array("tomato","#ff6347"),new Array("gray","#808080"),new Array("lightslategray","#778899"),new Array("teal","#008080"),new Array("lemonchiffon","#fffacd"),new Array("orangered","#ff4500"),new Array("darkgray","#a9a9a9"),new Array("slategray","#708090"),new Array("seagreen","#2e8b57"),new Array("wheat","#f5deb3"),new Array("red","#ff0000"),new Array("silver","#c0c0c0"),new Array("darkslategray","#2f4f4f"),new Array("darkolivegreen","#556b2f"),new Array("burlywood","#deb887"),new Array("crimson","#dc143c"),new Array("lightgrey","#d3d3d3"),new Array("lightsteelblue","#b0c4de"),new Array("darkgreen","#006400"),new Array("tan","#d2b48c"),new Array("mediumvioletred","#c71585"),new Array("gainsboro","#dcdcdc"),new Array("steelblue","#4682b4"),new Array("green","#008000"),new Array("khaki","#f0e68c"),new Array("deeppink","#ff1493"),new Array("white","#ffffff"),new Array("royalblue","#4169e1"),new Array("forestgreen","#228b22"),new Array("yellow","#ffff00"),new Array("hotpink","#ff69b4"),new Array("snow","#fffafa"),new Array("midnightblue","#191970"),new Array("mediumseagreen","#3cb371"),new Array("gold","#ffd700"),new Array("palevioletred","#db7093"),new Array("ghostwhite","#f8f8ff"),new Array("navy","#000080"),new Array("darkseagreen","#8fbc8f"),new Array("orange","#ffa500"),new Array("pink","#ffc0cb"),new Array("whitesmoke","#f5f5f5"),new Array("darkblue","#00008b"),new Array("mediumaquamarine","#66cdaa"),new Array("sandybrown","#f4a460"),new Array("lightpink","#ffb6c1"),new Array("floralwhite","#fffaf0"),new Array("mediumblue","#0000cd"),new Array("aquamarine","#7fffd4"),new Array("darkorange","#ff8c00"),new Array("thistle","#d8bfd8"),new Array("linen","#faf0e6"),new Array("blue","#0000ff"),new Array("palegreen","#98fb98"),new Array("goldenrod","#daa520"),new Array("magenta","#ff00ff"),new Array("antiquewhite","#faebd7"),new Array("dodgerblue","#1e90ff"),new Array("lightgreen","#90ee90"),new Array("peru","#cd853f"),new Array("fuchsia","#ff00ff"),new Array("papayawhip","#ffefd5"),new Array("cornflowerblue","#6495ed"),new Array("springgreen","#00ff7f"),new Array("darkgoldenrod","#b8860b"),new Array("violet","#ee82ee"),new Array("blanchedalmond","#ffebcd"),new Array("deepskyblue","#00bfff"),new Array("mediumspringgreen","#00fa9a"),new Array("chocolate","#d2691e"),new Array("plum","#dda0dd"),new Array("bisque","#ffe4c4"),new Array("lightskyblue","#87cefa"),new Array("lawngreen","#7cfc00"),new Array("sienna","#a0522d"),new Array("orchid","#da70d6"),new Array("moccasin","#ffe4b5"),new Array("skyblue","#87ceeb"),new Array("chartreuse","#7fff00"),new Array("saddlebrown","#8b4513"),new Array("mediumorchid","#ba55d3"),new Array("navajowhite","#ffdead"),new Array("lightblue","#add8e6"),new Array("greenyellow","#adff2f"),new Array("maroon","#800000"),new Array("darkorchid","#9932cc"),new Array("peachpuff","#ffdab9"),new Array("powderblue","#b0e0e6"),new Array("lime","#00ff00"),new Array("darkred","#8b0000"),new Array("darkviolet","#9400d3"),new Array("mistyrose","#ffe4e1"),new Array("paleturquoise","#afeeee"),new Array("limegreen","#32cd32"),new Array("brown","#a52a2a"),new Array("darkmagenta","#8b008b"),new Array("lavenderblush","#fff0f5"),new Array("lightcyan","#e0ffff"),new Array("yellowgreen","#9acd32"),new Array("firebrick","#b22222"),new Array("purple","#800080"),new Array("seashell","#fff5ee"),new Array("cyan","#00ffff"),new Array("olivedrab","#6b8e23"),new Array("indianred","#cd5c5c"),new Array("indigo","#4b0082"),new Array("oldlace","#fdf5e6"),new Array("aqua","#00ffff"),new Array("olive","#808000"),new Array("rosybrown","#bc8f8f"),new Array("darkslateblue","#483d8b"),new Array("ivory","#fffff0"),new Array("turquoise","#40e0d0"),new Array("darkkhaki","#bdb76b"),new Array("darksalmon","#e9967a"),new Array("blueviolet","#8a2be2"),new Array("honeydew","#f0fff0"),new Array("mediumturquoise","#48d1cc"),new Array("palegoldenrod","#eee8aa"),new Array("lightcoral","#f08080"),new Array("mediumpurple","#9370db"),new Array("mintcream","#f5fffa"),new Array("darkturquoise","#00ced1"),new Array("cornsilk","#fff8dc"),new Array("salmon","#fa8072"),new Array("slateblue","#6a5acd"),new Array("azure","#f0ffff"),new Array("lightseagreen","#20b2aa"),new Array("beige","#f5f5dc"),new Array("lightsalmon","#ffa07a"),new Array("mediumslateblue","#7b68ee")
    ];

    if (color == "")
       return "";

     for( var i =0; i<cc.length ;i++ ){//把英文名字的顏色轉成色碼
      if(c.toLowerCase()==cc[i][0].toLowerCase()) {
        c=cc[i][1];
        break;
      }
     }

    color = c.replace("#","");
    var color=(0xFFFFFF-Math.floor("0x"+color)).toString(16);
    var len = 6-color.length;
    for(var i=0; len!=i; i++) {
      color = "0"+color;
    }


    if (color == "000NaN")
      return "";
    else
      return ( "#" +color);


  }


  function turnColor_rgb(color){/*文字底色*/

    if(color=="")
      return "";

    if(color.toLowerCase().indexOf("rgb")>-1){
      var c = color;
      c = c.replace( " " , "" );
      c = c.replace( " " , "" );
      c = c.replace( "rgb(" , "" );
      c = c.replace( ")" ,"" );
      var ar =c.split( "," );

      var x1 = 255 - Number( ar[0] +"");
      var x2 = 255 - Number( ar[1] +"");
      var x3 = 255 - Number( ar[2] +"");

      var x = "rgb(" + x1 + "," + x2 + "," + x3 + ")";

      return x;
    }

    return turnColor(color);//如果不是rgb模式，就用一般的反轉
  }



}
