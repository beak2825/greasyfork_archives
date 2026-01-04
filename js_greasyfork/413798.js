// ==UserScript==
// @name          Fancy text script
// @version        clipboard.js v2.0.0
// @description  Fancy text script Editor
// @include        *://*.facebook.com/*
// @author       unknown (https://zenorocha.github.io/clipboard.js)
// @namespace https://greasyfork.org/users/307290
// @downloadURL https://update.greasyfork.org/scripts/413798/Fancy%20text%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/413798/Fancy%20text%20script.meta.js
// ==/UserScript==

    // CRAZY TEXT
    function fullCrazy(text) {
      if(text.trim() === "") return "";
      return randomSymbols(2) +"  "+ crazifyText(text) +"  "+ randomSymbols(2)
    }
    function crazifyText(text) {
      text = text.split("");
      for(var i = 0; i < text.length; i++) { text[i] =  crazifyCharacter(text[i]); }
      return text.join("");
    }
    function crazifyCharacter(c) {
      c = c.toLowerCase();
      var map = {"&":"⅋","%":["⅍","℀","℁","℆","℅"],"0":["０","Ѳ","ʘ"],"1":["➀","❶","１"],"2":["２","❷","➁"],"3":["３","❸","➂"],"4":["４","❹","➃"],"5":["❺","➄","５"],"6":["６","❻","➅"],"7":["７","❼","➆"],"8":["８","➇","❽"],"9":["➈","❾","９"],"<":["≼","≺","≪","☾","≾","⋜","⋞","⋐","⊂","⊏","⊑","《","＜","❮","❰","⫷"],">":"☽≫≻≽≿⋝⋟⋑⊃⊐⊒⫸》＞❯❱","[":"【〖〘〚［","]":"】〗〙〛］","*":"✨✩✪✫✬✭✮✯✰✦✱✲✳✴✵✶✷֍֎✸✹✺✻✼✽✾✿❀❁❂❃❄★☆＊","a":["Ⓐ","ⓐ","α","Ａ","ａ","ᗩ","卂","Δ","ค","α","ά","Ã","𝔞","𝓪","𝒶","𝓐","𝐀","𝐚","𝔸","𝕒","ᵃ"],"b":["Ⓑ","ⓑ","в","Ｂ","乃","ｂ","ᗷ","β","๒","в","в","β","𝔟","𝓫","𝒷","𝓑","𝐁","𝐛","𝔹","𝕓","ᵇ"],"c":["Ⓒ","ⓒ","匚","¢","Ｃ","ｃ","ᑕ","Ć","ς","c","ς","Č","℃","𝔠","𝓬","𝒸","𝓒","𝐂","𝐜","ℂ","𝕔","ᶜ"],"d":["Ⓓ","ⓓ","∂","Ｄ","ｄ","ᗪ","Đ","๔","∂","đ","Ď","𝔡","𝓭","𝒹","𝓓","𝐃","ᗪ","𝐝","𝔻","𝕕","ᵈ"],"e":["Ⓔ","乇","ⓔ","є","Ｅ","ｅ","ᗴ","€","є","ε","έ","Ẹ","𝔢","𝒆","𝑒","𝓔","𝐄","𝐞","𝔼","𝕖","ᵉ"],"f":["Ⓕ","ⓕ","ƒ","Ｆ","ｆ","千","ᖴ","ℱ","Ŧ","ғ","ғ","Ƒ","𝔣","𝒇","𝒻","𝓕","𝐅","𝐟","𝔽","𝕗","ᶠ"],"g":["Ⓖ","ⓖ","ق","g","Ｇ","ｇ","Ǥ","Ꮆ","ﻮ","g","ģ","Ğ","𝔤","𝓰","𝑔","𝓖","𝐆","𝐠","𝔾","𝕘","ᵍ","Ꮆ"],"h":["Ⓗ","卄","ⓗ","н","Ｈ","ｈ","ᕼ","Ħ","ђ","н","ħ","Ĥ","𝔥","𝓱","𝒽","𝓗","𝐇","𝐡","ℍ","𝕙","ʰ"],"i":["Ⓘ","ⓘ","ι","Ｉ","ｉ","Ꭵ","丨","Ɨ","เ","ι","ί","Į","𝔦","𝓲","𝒾","𝓘","𝐈","𝐢","𝕀","𝕚","ᶤ"],"j":["Ⓙ","ⓙ","נ","Ｊ","ڶ","ｊ","ᒎ","Ĵ","ן","נ","ј","Ĵ","𝔧","𝓳","𝒿","𝓙","𝐉","𝐣","𝕁","𝕛","ʲ"],"k":["Ⓚ","ⓚ","к","Ｋ","ｋ","ᛕ","Ҝ","к","к","ķ","Ќ","𝔨","𝓴","𝓀","𝓚","𝐊","𝐤","𝕂","𝕜","ᵏ","Ҝ"],"l":["Ⓛ","ⓛ","ℓ","ㄥ","Ｌ","ｌ","ᒪ","Ł","l","ℓ","Ļ","Ĺ","𝔩","𝓵","𝓁","𝓛","𝐋","𝐥","𝕃","𝕝","ˡ"],"m":["Ⓜ","ⓜ","м","Ｍ","ｍ","ᗰ","Μ","๓","м","м","ϻ","𝔪","𝓶","𝓂","𝓜","𝐌","𝐦","𝕄","𝕞","ᵐ","爪"],"n":["Ⓝ","几","ⓝ","η","Ｎ","ｎ","ᑎ","Ň","ภ","η","ή","Ň","𝔫","𝓷","𝓃","𝓝","𝐍","𝐧","ℕ","𝕟","ᶰ"],"o":["Ⓞ","ㄖ","ⓞ","σ","Ｏ","ｏ","ᗝ","Ø","๏","σ","ό","Ỗ","𝔬","𝓸","𝑜","𝓞","𝐎","𝐨","𝕆","𝕠","ᵒ"],"p":["Ⓟ","ⓟ","ρ","Ｐ","ｐ","卩","ᑭ","Ƥ","ק","ρ","ρ","Ƥ","𝔭","𝓹","𝓅","𝓟","𝐏","𝐩","ℙ","𝕡","ᵖ"],"q":["Ⓠ","ⓠ","q","Ｑ","ｑ","Ɋ","Ω","ợ","q","q","Ǫ","𝔮","𝓺","𝓆","𝓠","𝐐","𝐪","ℚ","𝕢","ᵠ"],"r":["Ⓡ","ⓡ","я","尺","Ｒ","ｒ","ᖇ","Ř","г","я","ŕ","Ř","𝔯","𝓻","𝓇","𝓡","𝐑","𝐫","ℝ","𝕣","ʳ"],"s":["Ⓢ","ⓢ","ѕ","Ｓ","丂","ｓ","ᔕ","Ş","ร","s","ş","Ŝ","𝔰","𝓼","𝓈","𝓢","𝐒","𝐬","𝕊","𝕤","ˢ"],"t":["Ⓣ","ⓣ","т","Ｔ","ｔ","丅","Ŧ","t","т","ţ","Ť","𝔱","𝓽","𝓉","𝓣","𝐓","𝐭","𝕋","𝕥","ᵗ"],"u":["Ⓤ","ⓤ","υ","Ｕ","ｕ","ᑌ","Ữ","ย","υ","ù","Ǘ","𝔲","𝓾","𝓊","𝓤","𝐔","𝐮","𝕌","𝕦","ᵘ"],"v":["Ⓥ","ⓥ","ν","Ｖ","ｖ","ᐯ","V","ש","v","ν","Ѷ","𝔳","𝓿","𝓋","𝓥","𝐕","𝐯","𝕍","𝕧","ᵛ"],"w":["Ⓦ","ⓦ","ω","Ｗ","ｗ","ᗯ","Ŵ","ฬ","ω","ώ","Ŵ","𝔴","𝔀","𝓌","𝓦","𝐖","𝐰","𝕎","𝕨","ʷ","山"],"x":["Ⓧ","ⓧ","χ","Ｘ","乂","ｘ","᙭","Ж","א","x","x","Ж","𝔵","𝔁","𝓍","𝓧","𝐗","𝐱","𝕏","𝕩","ˣ"],"y":["Ⓨ","ㄚ","ⓨ","у","Ｙ","ｙ","Ƴ","¥","ץ","ү","ч","Ў","𝔶","𝔂","𝓎","𝓨","𝐘","𝐲","𝕐","𝕪","ʸ"],"z":["Ⓩ","ⓩ","z","乙","Ｚ","ｚ","Ƶ","Ž","z","z","ž","Ż","𝔷","𝔃","𝓏","𝓩","𝐙","𝐳","ℤ","𝕫","ᶻ"]};
      if(map[c]) { return randomElement(map[c]); }
      else { return c; }
    }
    function randomElement(array) {
      return array[Math.floor(Math.random() * array.length)]
    }
    function randomSymbols(n) {
      var symbols = ["🐙","🐉","🐊","🐒","🐝","🐜","🐚","🐲","🐳","🐸","👑","👹","👺","👤","💲","💣","💙","💚","💛","💜","💝","💗","💘","💞","💔","💥","🐯","🐼","🐻","🐺","👌","🐍","🐧","🐟","🐠","🐨","🎯","🏆","🎁","🎀","🎉","🎈","🍮","🍭","🍬","🍫","🍪","🍧","🌷","🍓","😺","😾","✎","😎","😝","😂","😈","😡","😲","😳","🍔","🍟","🍩","🎃","🎄","🎅","🐣","🐤","👍","👊","👻","👽","👮","💎","💋","👣","💀","💢","🔥","♔","♕","♖","♗","♘","♙","♚","♛","♜","♝","♞","♟","♠","♡","♢","♣","♤","♥","♦","♧","♨","♩","♪","♬","★","☆","☺","☹","☯","☮","☢","☠","☟","☞","☝","☜","✌","✋","✊","⛵","ൠ","✌","ඏ"];
      var s = [];
      for(var i = 0; i < n; i++) s.push( randomElement(symbols) );
      return s.join("");
    }
    function randInt(min, max) {
      return min + Math.floor(Math.random()*(max-min+1));
}

                
reverseIsDisabled = true;
function backward(text) { return $('#english-text').val(); }                //]]>
            //} catch(e) {
            //    alert("There's an error in the custom script of this translator. Error:"+e);
            //}


			try {
			

			var jsonData = {"phrases1":"","phrases2":"","words1":"","words2":"","intraword1":"","intraword2":"","prefixes1":"","prefixes2":"","suffixes1":"","suffixes2":"","regex1":"","regex2":"","rev_regex1":"","rev_regex2":"","ordering1":"","ordering2":""};
			phrases1 = jsonData.phrases1.split("\n");
			phrases2 = jsonData.phrases2.split("\n");
			words1 = jsonData.words1.split("\n");
			words2 = jsonData.words2.split("\n");
			intraword1 = jsonData.intraword1.split("\n");
			intraword2 = jsonData.intraword2.split("\n");
			prefixes1 = jsonData.prefixes1.split("\n");
			prefixes2 = jsonData.prefixes2.split("\n");
			suffixes1 = jsonData.suffixes1.split("\n");
			suffixes2 = jsonData.suffixes2.split("\n");
			regex1 = jsonData.regex1.split("\n");
			regex2 = jsonData.regex2.split("\n");
			rev_regex1 = jsonData.rev_regex1.split("\n");
			rev_regex2 = jsonData.rev_regex2.split("\n");
            ordering1 = jsonData.ordering1.split("\n");
            ordering2 = jsonData.ordering2.split("\n");

			} catch(err) {
				alert("Ahh an error! Please contact me via hello@josephrocca.com and I'll fix it asap. Error log: "+err.message);
			}

			evenUpSizes(phrases1,phrases2);
			evenUpSizes(words1,words2);
			evenUpSizes(intraword1,intraword2);
			evenUpSizes(prefixes1,prefixes2);
			evenUpSizes(suffixes1,suffixes2);

			//fix for mysql trailing newline deletion problem
			function evenUpSizes(a,b) {
				if(a.length > b.length) {
					while(a.length > b.length) b.push("");
				} else if(b.length > a.length) {
					while(b.length > a.length) a.push("");
				}
			}

			handleDuplicates(words1, words2);
			/* Initial translate for default text */
			if($('#english-text').val() != "") {
				var english = $('#english-text').val();
				var ghetto = translate(english);
				$('#ghetto-text').val(ghetto);
			}
		


$(function() { 
 /*if($.trim($("#fancytext").val())!='') { 
    generateFancy($("#fancytext").val());
  } else {
   generateFancy("Preview Text");
  }*/
  
$(".fancytext").keyup(function() { 
   $(".fancytext").val($(this).val());
   if($.trim($(this).val())!='') { 
   generateFancy($(this).val());
   } else {
   generateFancy("Preview Text");
   }
 });
var ct = 89;
function generateFancy(txt) {
  var fancyText = '';
     var result = forward(txt);
         var finalRes =  result.split('\n\n');
         var sn=1;
        $.each(finalRes,function(inx, vl) { 
            $("#copy_"+inx).val(vl);
            
         // fancyText  +=  '<div class="input-group mb-3"><input type="text" class="form-control text-'+sn+'" value="'+vl+'" id="copy_'+inx+'" readonly="readonly"><div class="input-group-append"><span class="input-group-text copybutton" style="cursor:pointer;" data-clipboard-action="copy" data-clipboard-target="#copy_'+inx+'">Copy</span></div></div>';
          sn++;
        });
        
        
        for(k=89; k<=ct; k++) {
            //console.log(k);
            $("#copy_"+k).val(crazyWithFlourishOrSymbols(txt));
        }
           //$("#result").html(fancyText); 
}
 
 $(".loadmore").click(function(){
   $(this).html('Loading...');
    var text = $.trim($(".fancytext").val());
   if(text=='') {
     text = 'Preview Text';
   } 
   var that = $(this);
   var intvl = setInterval(function(){  that.html('Load More');clearInterval(intvl); }, 1000);
   for(var i=1;i<=10;i++){
    fancyText  =  '<div class="input-group mb-3"><input type="text" class="form-control" value="'+crazyWithFlourishOrSymbols(text)+'" id="copy_'+ct+'" readonly="readonly"><div class="input-group-append"><span class="input-group-text copybutton" style="cursor:pointer;" data-clipboard-action="copy" data-clipboard-target="#copy_'+ct+'">Copy</span></div></div>';
      ct++;
    $("#result").append(fancyText);
    }
 });

});
$(function(){
var intv = setInterval(function(){ $(".copybutton").html('Copy'); }, 2000);
  $("body").on('click',".copybutton",function() { 
$(".copybutton").html('Copy');
$(this).html('Copied'); 
clearInterval(intv);
});
});

    var clipboard = new ClipboardJS('.copybutton');
    clipboard.on('success', function(e) {
        //console.log(e);
    });
    clipboard.on('error', function(e) {
        //console.log(e);
    });
