// @require https://raw.githubusercontent.com/cougar1/dashboard/main/global.js

function addSkillTab()
{
  var tab = document.getElementById("myTabDiv");

  if ( tab )
  {
    var myTabBtn = document.createElement("a");
		myTabBtn.setAttribute("class","tablinks");
		myTabBtn.innerText = "Skill Tokens";
		myTabBtn.href = "#";
		myTabBtn.id = "tabskills";

		tab.appendChild(myTabBtn);

    myTabBtn.addEventListener( 'click', function(e){doTab(e,"skills");}, true );
    addSkillContent();
  }
}

function addSkillContent()
{
  var box = document.getElementById("myDemonBox");
  
  if ( box )
  {
  	var myTabDiv = document.createElement("div");
  	myTabDiv.setAttribute("class","tabcontent");
  	myTabDiv.id = "skills";
  	box.appendChild(myTabDiv);
    
    var fs = document.createElement("fieldset");
    fs.style.boxSizing = "border-box";
    fs.style.width = "80%";
    fs.style.borderRadius = "5px";

    var legend = document.createElement ("legend");
    legend.innerHTML = "Distribute";
    legend.style.padding = "5px";

    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		legend.appendChild(t);  

    var myNumber = document.createElement("input");
    myNumber.id = "TotalSkillTokens";
    myNumber.type = "number";
    myNumber.value = "25";
    myNumber.step = "1";
    legend.appendChild(myNumber);
    
    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		legend.appendChild(t);  
    
    myLbl = document.createElement("label");
    myLbl.setAttribute('class', 'myLabel');
    myLbl.style.width = "155px";
    myLbl.innerText = "skill token(s) as follows";              
    legend.appendChild(myLbl); 
    
    fs.appendChild (legend);
    myTabDiv.appendChild(fs);
    
    var myBr = document.createElement("br");
    fs.appendChild(myBr);
    var myBr = document.createElement("br");
    fs.appendChild(myBr);
    
    var mySpan = document.createElement("span");
    mySpan.setAttribute("class","attack");
    mySpan.innerText = "\u00A0\Attack";
    fs.appendChild(mySpan);
    
    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		fs.appendChild(t);  
    
    var myNumber = document.createElement("input");
    myNumber.id = "AttackSkill";
    myNumber.type = "number";
    myNumber.value = "5";
    myNumber.step = "1";
    fs.appendChild(myNumber);
    
    var myBr = document.createElement("br");
    fs.appendChild(myBr);
    
    var mySpan = document.createElement("span");
    mySpan.setAttribute("class","defense");
    mySpan.innerText = "\u00A0\Defense";
    fs.appendChild(mySpan);
    
    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		fs.appendChild(t);  

    var myNumber = document.createElement("input");
    myNumber.id = "DefenseSkill";
    myNumber.type = "number";
    myNumber.value = "5";
    myNumber.step = "1";
    fs.appendChild(myNumber);
    
    var myBr = document.createElement("br");
    fs.appendChild(myBr);
    
    var mySpan = document.createElement("span");
    mySpan.setAttribute("class","health");
    fs.appendChild(mySpan);
    
    myLbl = document.createElement("label");
    myLbl.setAttribute('class', 'myLabel');
    myLbl.innerText = "Health ";              
    fs.appendChild(myLbl); 

    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		fs.appendChild(t);  

    var myNumber = document.createElement("input");
    myNumber.id = "HealthSkill";
    myNumber.type = "number";
    myNumber.value = "50";
    myNumber.step = "10";
    fs.appendChild(myNumber);
    
    var myBr = document.createElement("br");
    fs.appendChild(myBr);
    
    var mySpan = document.createElement("span");
    mySpan.setAttribute("class","energy");
    fs.appendChild(mySpan);
    
    myLbl = document.createElement("label");
    myLbl.setAttribute('class', 'myLabel');
    myLbl.innerText = "Energy ";              
    fs.appendChild(myLbl); 

    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		fs.appendChild(t);  

    var myNumber = document.createElement("input");
    myNumber.id = "EnergySkill";
    myNumber.type = "number";
    myNumber.value = "5";
    myNumber.step = "1";
    fs.appendChild(myNumber);
    
    var myBr = document.createElement("br");
    fs.appendChild(myBr);
    
    var mySpan = document.createElement("span");
    mySpan.setAttribute("class","stamina");
    fs.appendChild(mySpan);
    
    myLbl = document.createElement("label");
    myLbl.setAttribute('class', 'myLabel');
    myLbl.innerText = "Stamina ";              
    fs.appendChild(myLbl); 

    var t = document.createTextNode("\u00A0\u00A0");     // Create a text node
		fs.appendChild(t);  

    var myNumber = document.createElement("input");
    myNumber.id = "StaminaSkill";
    myNumber.type = "number";
    myNumber.value = "5";
    myNumber.step = "1";
    fs.appendChild(myNumber);
  }
}