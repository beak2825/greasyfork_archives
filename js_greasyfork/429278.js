// ==UserScript==
// @name          球员比较雷达图 Raydar Pictures in the "compare players" page
// @version       v1.01
// @description   在球员比较页面增加球员雷达图的比较 Add raydar pictures of players'skills in the "compare players" page.
// @author        魔力联
// @include		    http://trophymanager.com/players/compare/*
// @exclude		    http://trophymanager.com/players
// @exclude		    http://trophymanager.com/players/compare
// @exclude		    http://trophymanager.com/players/compare/
// @include		    https://trophymanager.com/players/compare/*
// @exclude		    https://trophymanager.com/players
// @exclude		    https://trophymanager.com/players/compare
// @exclude		    https://trophymanager.com/players/compare/

// @grant none
// @namespace https://greasyfork.org/users/792929
// @downloadURL https://update.greasyfork.org/scripts/429278/%E7%90%83%E5%91%98%E6%AF%94%E8%BE%83%E9%9B%B7%E8%BE%BE%E5%9B%BE%20Raydar%20Pictures%20in%20the%20%22compare%20players%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/429278/%E7%90%83%E5%91%98%E6%AF%94%E8%BE%83%E9%9B%B7%E8%BE%BE%E5%9B%BE%20Raydar%20Pictures%20in%20the%20%22compare%20players%22%20page.meta.js
// ==/UserScript==
	  var MR = Math.round;
    var MP = Math.pow;
    var ML = Math.log;
      const funFix1 = (i) => {
        i = (MR(i * 10) / 10).toFixed(1);
        return i;
    }

    const funFix2 = (i) => {
        i = (MR(i * 100) / 100).toFixed(2);
        return i;
    }

    const funFix3 = (i) => {
        i = (MR(i * 1000) / 1000).toFixed(3);
        return i;
    }

	  var skills= new Array;

	  var a = document.getElementsByClassName("skill_table zebra")[0];

//删除class=subtle类的span标签
	  var subtleSpans = a.getElementsByClassName('subtle');
    var subtleSpanContent, subtleSpanParent, newSubtleSpanContent;
    while (subtleSpans.length) {
        subtleSpanContent = subtleSpans[0].innerHTML; 
        subtleSpanParent = subtleSpans[0].parentNode;
        newSubtleSpanContent = document.createTextNode(subtleSpanContent);
        subtleSpanParent.insertBefore(newSubtleSpanContent, subtleSpans[0]);
        subtleSpanParent.removeChild(subtleSpans[0]);
    }
    var b = a.getElementsByTagName("span").length; //技能个数
	  for (i=0;i<b;i++){
		  skills[i]=a.getElementsByTagName("span")[i];
		  if (0 < parseFloat(skills[i].innerHTML) && parseFloat(skills[i].innerHTML) < 19) {
                skills[i] = parseFloat(skills[i].innerHTML);
            } else {
                skills[i] = parseFloat(skills[i].innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
            } 
	
	
	  }


//获取经验
    var routineDiv = document.getElementsByClassName("odd align_center")[0];
	  var dSpans = routineDiv.getElementsByTagName("span");
	  var rou1 = dSpans[1].innerHTML;
	  var rou2 = dSpans[2].innerHTML;
    
	  var skBonus1 = funFix3((3/100) * (100-(100) * Math.pow(Math.E, -rou1*0.035)));
    var skBonus2 = funFix3((3/100) * (100-(100) * Math.pow(Math.E, -rou2*0.035)));


//雷达图
	  var altezzagrafico=200;
    var larghezzagrafico=250;
    var centrox=90;
    var centroy=95;
    var raggio=80;
    var ot=raggio/10;
    var grafico='<svg height="'+altezzagrafico+'" width="'+larghezzagrafico+'">';
    



		grafico+='<rect width="'+larghezzagrafico+'" height="'+altezzagrafico+'" style="fill:#275502;stroke-width:3;stroke:#275502" />';//方框
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+raggio+'" stroke="#41631f" stroke-width="1" fill="#41631f" />';
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+(0.707*raggio)+'" stroke="#578229" stroke-width="1" fill="#578229" />';
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+(0.5*raggio)+'" stroke="#41631f" stroke-width="1" fill="#41631f" />';
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+(0.353*raggio)+'" stroke="#578229" stroke-width="1" fill="#578229" />';
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+(0.25*raggio)+'" stroke="#41631f" stroke-width="1" fill="#41631f" />';
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="'+(0.1*raggio)+'" stroke="#578229" stroke-width="1" fill="#578229" />';
    grafico+='<circle cx="'+centrox+'" cy="'+centroy+'" r="1" stroke="#578229" stroke-width="1" />';

  

    if (b>=28){//不是守门员
  
  
		
      var gPHY1=funFix2((skills[0]*1+skills[4]*1+skills[8]*1+skills[14]*1+3*skBonus1)/80)*1;
      var gPHY2=funFix2((skills[1]*1+skills[5]*1+skills[9]*1+skills[15]*1+3*skBonus2)/80)*1;
  
      var gTAC1=funFix2((skills[12]*1+skills[16]*1+skills[20]*1+skills[24]*1+4*skBonus1)/80)*1;
      var gTAC2=funFix2((skills[13]*1+skills[17]*1+skills[21]*1+skills[25]*1+4*skBonus2)/80)*1;
          
      var gTEC1=funFix2((skills[2]*1+skills[6]*1+skills[10]*1+skills[18]*1+skills[22]*1+skills[26]*1+6*skBonus1)/120)*1;
      var gTEC2=funFix2((skills[3]*1+skills[7]*1+skills[11]*1+skills[19]*1+skills[23]*1+skills[27]*1+6*skBonus2)/120)*1;
          
      var gDEF1=funFix2((skills[0]*0.121481481+skills[4]*0.040740741+skills[8]*0.111111111+skills[12]*0.202962963+skills[16]*0.2+skills[20]*0.071111111+skills[24]*0.071111111+skills[14]*0.181481481+0.95*skBonus1)/22.91)*1;
      var gDEF2=funFix2((skills[1]*0.121481481+skills[5]*0.040740741+skills[9]*0.111111111+skills[13]*0.202962963+skills[17]*0.2+skills[21]*0.071111111+skills[25]*0.071111111+skills[15]*0.181481481+0.95*skBonus2)/22.91)*1;
          
      var gASS1=funFix2((skills[0]*0.01+skills[4]*0.1+skills[8]*0.2+skills[20]*0.09+skills[24]*0.07+skills[2]*0.22+skills[6]*0.13+skills[10]*0.18+0.9*skBonus1)/22.91)*1;
      var gASS2=funFix2((skills[1]*0.01+skills[5]*0.1+skills[9]*0.2+skills[21]*0.09+skills[25]*0.07+skills[3]*0.22+skills[7]*0.13+skills[11]*0.18+0.9*skBonus2)/22.91)*1;
          
      var gSHO1=funFix2((skills[0]*0.082813522+skills[8]*0.038541421+skills[20]*0.087757535+skills[24]*0.126339391+skills[10]*0.104203341+skills[14]*0.104949572+skills[18]*0.301067794+skills[22]*0.154327424+1*skBonus1)/22.91)*1;
      var gSHO2=funFix2((skills[1]*0.082813522+skills[9]*0.038541421+skills[21]*0.087757535+skills[25]*0.126339391+skills[11]*0.104203341+skills[15]*0.104949572+skills[19]*0.301067794+skills[23]*0.154327424+1*skBonus2)/22.91)*1;
      grafico+='<polygon points="';        
	    grafico+=(centrox)+','+(centroy+raggio*gTAC1*gTAC1)+' ';
      grafico+=(centrox-raggio*0.866025404*gDEF1*gDEF1)+','+(centroy+raggio*0.5*gDEF1*gDEF1)+' ';
      grafico+=(centrox-raggio*0.866025404*gASS1*gASS1)+','+(centroy-raggio*0.5*gASS1*gASS1)+' ';
      grafico+=(centrox)+','+(centroy-raggio*gSHO1*gSHO1)+' ';
      grafico+=(centrox+raggio*0.866025404*gTEC1*gTEC1)+','+(centroy-raggio*0.5*gTEC1*gTEC1)+' ';
      grafico+=(centrox+raggio*0.866025404*gPHY1*gPHY1)+','+(centroy+raggio*0.5*gPHY1*gPHY1)+'" ';
	    grafico+='style="fill:#00BFFF;stroke:#00FFFF;fill-opacity:0.4;stroke-width:1.5"></polygon>';
	
	    grafico+='<polygon points="';	
      grafico+=(centrox)+','+(centroy+raggio*gTAC2*gTAC2)+' ';
      grafico+=(centrox-raggio*0.866025404*gDEF2*gDEF2)+','+(centroy+raggio*0.5*gDEF2*gDEF2)+' ';
      grafico+=(centrox-raggio*0.866025404*gASS2*gASS2)+','+(centroy-raggio*0.5*gASS2*gASS2)+' ';
      grafico+=(centrox)+','+(centroy-raggio*gSHO2*gSHO2)+' ';
      grafico+=(centrox+raggio*0.866025404*gTEC2*gTEC2)+','+(centroy-raggio*0.5*gTEC2*gTEC2)+' ';
      grafico+=(centrox+raggio*0.866025404*gPHY2*gPHY2)+','+(centroy+raggio*0.5*gPHY2*gPHY2)+'" ';  
      grafico+='style="fill:#FFB6C1;stroke:#FF1493;fill-opacity:0.4;stroke-width:1.5"></polygon>';	
	
      grafico+='<text x="'+(centrox-2.45*ot+7)+'" y="'+(centroy+raggio+0.2*ot+2)+'" fill="#ddd">战术</text>';
      grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">防守</text>';
      grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">助攻</text>';
      grafico+='<text x="'+(centrox-2.45*ot+7)+'" y="'+(centroy-raggio+2*ot-12)+'" fill="#ddd">射门</text>';
	    grafico+='<text x="'+(centrox+raggio*0.58+7)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">技术</text>';
      grafico+='<text x="'+(centrox+raggio*0.58+7)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">身体</text></svg>';	
    }
		
    else if (b<28)  {//是守门员
      
			var gPHY1=funFix2((skills[0]*1+skills[4]*1+skills[8]*1+skills[14]*1+skBonus1*3)/80)*1;
      var gPHY2=funFix2((skills[1]*1+skills[5]*1+skills[9]*1+skills[15]*1+skBonus2*3)/80)*1;
      
      var gTAC1=funFix2((skills[6]*1+skills[12]*1+skills[16]*1+skBonus1*3)/60)*1;
      var gTAC2=funFix2((skills[7]*1+skills[13]*1+skills[17]*1+skBonus2*3)/60)*1;
      
      var gTEC1=funFix2((skills[2]*1+skills[10]*1+skills[18]*1+skills[20]*1+skBonus1*4)/80)*1;
      var gTEC2=funFix2((skills[3]*1+skills[11]*1+skills[19]*1+skills[21]*1+skBonus2*4)/80)*1;
      
      var gSAV1=funFix2((skills[0]*0.092691271+skills[4]*0.007577625+skills[8]*0.104277679+skills[2]*0.278073812+skills[6]*0.069518453+skills[10]*0.278073812+skills[12]*0.069518453+skills[14]*0.092691271+skills[16]*0.007577625+0.99*skBonus1)/22.91)*1;
      var gSAV2=funFix2((skills[1]*0.092691271+skills[5]*0.007577625+skills[9]*0.104277679+skills[3]*0.278073812+skills[7]*0.069518453+skills[11]*0.278073812+skills[13]*0.069518453+skills[15]*0.092691271+skills[17]*0.007577625+0.99*skBonus2)/22.91)*1;
      
      var gCOU1=funFix2((skills[0]*0.046345635+skills[4]*0.003788813+skills[8]*0.052138840+skills[2]*0.139036906+skills[6]*0.034759226+skills[10]*0.139036906+skills[12]*0.034759226+skills[14]*0.046345635+skills[16]*0.003788813+skills[18]*0.25+skills[20]*0.25+0.997*skBonus1)/22.91)*1;
      var gCOU2=funFix2((skills[1]*0.046345635+skills[5]*0.003788813+skills[9]*0.052138840+skills[3]*0.139036906+skills[7]*0.034759226+skills[11]*0.139036906+skills[13]*0.034759226+skills[15]*0.046345635+skills[17]*0.003788813+skills[19]*0.25+skills[21]*0.25+0.997*skBonus2)/22.91)*1;
      
      grafico+='<polygon points="';	
      grafico+=(centrox)+','+(centroy+raggio*gSAV1*gSAV1)+' ';
      grafico+=(centrox-raggio*0.866025404*gTEC1*gTEC1)+','+(centroy+raggio*0.5*gTEC1*gTEC1)+' ';
      grafico+=(centrox-raggio*0.866025404*gPHY1*gPHY1)+','+(centroy-raggio*0.5*gPHY1*gPHY1)+' ';
      grafico+=(centrox+raggio*0.866025404*gTAC1*gTAC1)+','+(centroy-raggio*0.5*gTAC1*gTAC1)+' ';
      grafico+=(centrox+raggio*0.866025404*gCOU1*gCOU1)+','+(centroy+raggio*0.5*gCOU1*gCOU1)+'" ';
      grafico+='style="fill:#00BFFF;stroke:#00FFFF;fill-opacity:0.4;stroke-width:1.5"></polygon>';
      
      
      grafico+='<polygon points="';	
      grafico+=(centrox)+','+(centroy+raggio*gSAV2*gSAV2)+' ';
      grafico+=(centrox-raggio*0.866025404*gTEC2*gTEC2)+','+(centroy+raggio*0.5*gTEC2*gTEC2)+' ';
      grafico+=(centrox-raggio*0.866025404*gPHY2*gPHY2)+','+(centroy-raggio*0.5*gPHY2*gPHY2)+' ';
      grafico+=(centrox+raggio*0.866025404*gTAC2*gTAC2)+','+(centroy-raggio*0.5*gTAC2*gTAC2)+' ';
      grafico+=(centrox+raggio*0.866025404*gCOU2*gCOU2)+','+(centroy+raggio*0.5*gCOU2*gCOU2)+'" ';
      grafico+='style="fill:#FFB6C1;stroke:#FF1493;fill-opacity:0.4;stroke-width:1.5"></polygon>';	
      
      
      
      grafico+='<text x="'+(centrox-2.45*ot+7)+'" y="'+(centroy+raggio+0.2*ot+2)+'" fill="#ddd">扑救</text>';
      grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">技术</text>';
      grafico+='<text x="'+(centrox-raggio*0.8-2.5*ot)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">身体</text>';
      grafico+='<text x="'+(centrox+raggio*0.58+7)+'" y="'+(centroy-raggio*0.3-ot)+'" fill="#ddd">战术</text>';
      grafico+='<text x="'+(centrox+raggio*0.58+7)+'" y="'+(centroy+raggio*0.5+ot)+'" fill="#ddd">反击</text></svg>';
      }			

//图表   
    var column =" <div id=\"column_content\" class=\"content_menu\"></div>";
    $(".column1").append(column);
	  var content1 = grafico;
	  $("#column_content").append(content1);
//改球员名称颜色
	  var u1 = document.getElementsByClassName("large")[0].getElementsByClassName("normal")[0].style.color="#00FFFF";
	  var u2 = document.getElementsByClassName("large")[2].getElementsByClassName("normal")[0].style.color="#FF1493";