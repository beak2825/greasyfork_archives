// ==UserScript==
// @name           Show Youth SI
// @version        20220122047
// @author         VC ，太原FC Fix it 
// @description    Trophymanager,Youth Players
// @include	    *trophymanager.com/youth-development/
// @namespace https://greasyfork.org/zh-CN/scripts/29180-show-youth-si

// @downloadURL https://update.greasyfork.org/scripts/29180/Show%20Youth%20SI.user.js
// @updateURL https://update.greasyfork.org/scripts/29180/Show%20Youth%20SI.meta.js
// ==/UserScript==







function FixSkill(skillstr)
{
    if(skillstr.indexOf("star.png")>0)return 20;
    if(skillstr.indexOf("star_silver.png")>0)return 19;
    var skillvalue=parseInt(skillstr);
    if(skillvalue<=2)return skillvalue+0.2;
    if(skillvalue<=3)return skillvalue+0.4;    
    if(skillvalue<=4)return skillvalue+0.6;
    if(skillvalue>=5)
        return skillvalue+0.8;
    return 0;
}

function Skill2SI(skill2)
{
    
    skill2=parseFloat(skill2);
    return Math.round(3.79438*Math.pow(10,-12)*Math.pow(skill2,7));
    
}

//估算skill
function SkillEST(skill2,age,section)
{
    skill2=parseFloat(skill2);
    age= parseInt(age);
    section = parseInt(section);
    
    
    switch(age)
    {
        case 15:
            skill2+=18;
        case 16:
            skill2+=17;
        case 17:
            skill2+=17;
        case 18:
            skill2+=17;
        case 19:
            skill2+=8;
        case 20:
            skill2+=8;
            
    }
    
    switch(section)
    {
        case 1:
            skill2+=10;
        case 2:
            skill2+=10;
        case 3:
            skill2+=10;
    }
    
    return skill2;
}

//乐观估算skill
function SkillESTO(skill2,age,section)
{
    
    skill2=parseFloat(skill2);
    age= parseInt(age);
    section = parseInt(section);
    
    
    switch(age)
    {
        case 15:
            skill2+=22;
        case 16:
            skill2+=22;
        case 17:
            skill2+=20;
        case 18:
            skill2+=18;
        case 19:
            skill2+=9;
        case 20:
            skill2+=9;
            
    }
    
    switch(section)
    {
        case 1:
            skill2+=16;
        case 2:
            skill2+=16;
        case 3:
            skill2+=16;
    }
    
    return skill2;    
    
}



function formatSI(si2)
{
    if(si2>40000)return "<b><font color=\"#FF7744\">"+si2+"</font></b>";
    if(si2>20000)return "<b><font color=\"#FFAA33\">"+si2+"</font></b>";
    if(si2>7500)return "<b>"+si2+"</b>";
    
    
    return si2;
    
    
    
}


function ShowSI(){

        
        //var playerdivs=$(".background_gradient&.youth_player");
    	var playerdivs=document.getElementsByClassName("youth_player");
        var isGK;
        var playertd;
        var skillnum;
        var i;
        var j;  
        var displaybox;
        var agestr;
        var age;
        var tempstr
        
        if(playerdivs.length>0)
        {
            for(i=0;i<playerdivs.length;i++)       
            {
                
                displaybox=playerdivs[i].getElementsByClassName("youth_player_name")[0].getElementsByTagName("div")[3];
                agestr=displaybox.innerHTML;
                if(agestr.indexOf("SI")>0)return;
                
                age=parseInt(agestr.substr(agestr.search(/\d\d/),2));
                
                if(playerdivs[i].getElementsByClassName("favposition long")[0].innerHTML.indexOf("gk")>0)
                    isGK=true;
                else
                    isGK=false;
                
                
                
                
                skillnum=0;
                playertd=playerdivs[i].getElementsByTagName("td");
                for(j=0;j<playertd.length;j++)
                    skillnum=skillnum+FixSkill(playertd[j].innerHTML);
                skillnum=skillnum.toFixed(1);
                
                if(isGK)
                {   tempstr="<span style=\"border-bottom: 2px solid #6C9922; padding: 5px 0 5px 3px; margin: 0 0 5px 0;\">【年龄:"+age+"】&nbsp;【SI:" +Skill2SI(skillnum*14/11)+"】&nbsp;【技能总和:"+skillnum + "】&nbsp;【技能平均:"+(skillnum/11).toFixed(1)+"】</span><br><br>";
                
                }
                else
                {
                    tempstr="<span style=\"border-bottom: 2px solid #6C9922; padding: 5px 0 5px 3px; margin: 0 0 5px 0;\">【年龄:"+age+"】&nbsp;【SI:" +Skill2SI(skillnum)+"】&nbsp;【技能总和:"+skillnum + "】&nbsp;【技能平均:"+(skillnum/14).toFixed(1)+"】</span><br><br>";
                  
                    
                }
                
                
                
                displaybox.innerHTML=tempstr;
                
                
                
                
            }
            
        }        

}//end ShowSI()


if (location.href.indexOf("youth-development") != -1)
    setInterval(ShowSI,700);

    
