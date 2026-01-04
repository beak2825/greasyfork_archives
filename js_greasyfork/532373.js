// ==UserScript==
// @name        Smali to Dalvik OpCode
// @namespace   StephenP
// @match       http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html*
// @match       https://quantiti.github.io/dalvik-opcodes/
// @grant       none
// @version     1.2.1
// @author      StephenP
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @description Helper script to translate parts of the smali code of an application to the corresponding Dalvik opcodes, leaving wildcards for the variable parts of the code (variables, parameters, etc.). The output is formatted to be easily transformed in a LuckyPatcher patch.
// @downloadURL https://update.greasyfork.org/scripts/532373/Smali%20to%20Dalvik%20OpCode.user.js
// @updateURL https://update.greasyfork.org/scripts/532373/Smali%20to%20Dalvik%20OpCode.meta.js
// ==/UserScript==
const table=document.getElementsByTagName("TABLE")[0]
const names=["nop","move","move/from16","move/16","move-wide","move-wide/from16","move-wide/16","move-object","move-object/from16","move-object/16","move-result","move-result-wide","move-result-object","move-exception","return-void","return","return-wide","return-object","const/4","const/16","const","const/high16","const-wide/16","const-wide/32","const-wide","const-wide/high16","const-string","const-string-jumbo","const-class","monitor-enter","monitor-exit","check-cast","instance-of","array-length","new-instance","new-array","filled-new-array","filled-new-array-range","fill-array-data","throw","goto","goto/16","goto/32","packed-switch","sparse-switch","cmpl-float","cmpg-float","cmpl-double","cmpg-double","cmp-long","if-eq","if-ne","if-lt","if-ge","if-gt","if-le","if-eqz","if-nez","if-ltz","if-gez","if-gtz","if-lez","unused_3E","unused_3F","unused_40","unused_41","unused_42","unused_43","aget","aget-wide","aget-object","aget-boolean","aget-byte","aget-char","aget-short","aput","aput-wide","aput-object","aput-boolean","aput-byte","aput-char","aput-short","iget","iget-wide","iget-object","iget-boolean","iget-byte","iget-char","iget-short","iput","iput-wide","iput-object","iput-boolean","iput-byte","iput-char","iput-short","sget","sget-wide","sget-object","sget-boolean","sget-byte","sget-char","sget-short","sput","sput-wide","sput-object","sput-boolean","sput-byte","sput-char","sput-short","invoke-virtual","invoke-super","invoke-direct","invoke-static","invoke-interface","unused_73","invoke-virtual/range","invoke-super/range","invoke-direct/range","invoke-static/range","invoke-interface-range","unused_79","unused_7A","neg-int","not-int","neg-long","not-long","neg-float","neg-double","int-to-long","int-to-float","int-to-double","long-to-int","long-to-float","long-to-double","float-to-int","float-to-long","float-to-double","double-to-int","double-to-long","double-to-float","int-to-byte","int-to-char","int-to-short","add-int","sub-int","mul-int","div-int","rem-int","and-int","or-int","xor-int","shl-int","shr-int","ushr-int","add-long","sub-long","mul-long","div-long","rem-long","and-long","or-long","xor-long","shl-long","shr-long","ushr-long","add-float","sub-float","mul-float","div-float","rem-float","add-double","sub-double","mul-double","div-double","rem-double","add-int/2addr","sub-int/2addr","mul-int/2addr","div-int/2addr","rem-int/2addr","and-int/2addr","or-int/2addr","xor-int/2addr","shl-int/2addr","shr-int/2addr","ushr-int/2addr","add-long/2addr","sub-long/2addr","mul-long/2addr","div-long/2addr","rem-long/2addr","and-long/2addr","or-long/2addr","xor-long/2addr","shl-long/2addr","shr-long/2addr","ushr-long/2addr","add-float/2addr","sub-float/2addr","mul-float/2addr","div-float/2addr","rem-float/2addr","add-double/2addr","sub-double/2addr","mul-double/2addr","div-double/2addr","rem-double/2addr","add-int/lit16","sub-int/lit16","mul-int/lit16","div-int/lit16","rem-int/lit16","and-int/lit16","or-int/lit16","xor-int/lit16","add-int/lit8","sub-int/lit8","mul-int/lit8","div-int/lit8","rem-int/lit8","and-int/lit8","or-int/lit8","xor-int/lit8","shl-int/lit8","shr-int/lit8","ushr-int/lit8","unused_E3","unused_E4","unused_E5","unused_E6","unused_E7","unused_E8","unused_E9","unused_EA","unused_EB","unused_EC","unused_ED","execute-inline","unused_EF","invoke-direct-empty","unused_F1","iget-quick","iget-wide-quick","iget-object-quick","iput-quick","iput-wide-quick","iput-object-quick","invoke-virtual-quick","invoke-virtual-quick/range","invoke-super-quick","invoke-super-quick/range","unused_FC","unused_FD","unused_FE","unused_FF"];
const cmdLength=[2,2,4,0,2,4,0,2,4,6,2,2,2,2,2,2,2,2,2,4,6,4,4,6,10,4,4,0,4,2,2,4,4,2,4,4,6,6,6,2,2,4,0,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,0,6,6,6,6,6,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,6,0,6,0,4,4,4,4,4,4,6,6,6,6,0,0,0,0];

var st=document.createElement("STYLE");
const styleStr=`
fieldset>button{
  margin-left: 1em;
  margin-right: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
#container{
  flex-direction: row;
  border: 5px solid red;
}
textarea{
  width: 50%;
}
@media (max-width: 1220px) {
  #container {
    flex-direction: column;
    border: 5px solid blue;
  }
  textarea{
    width: 100%;
    font-size: 2em;
  }
`;
st.innerHTML=styleStr;
document.getElementsByTagName("HEAD")[0].appendChild(st);
var container=document.createElement("DIV");
container.style.display="flex";
container.style.flexDirection="row";
container.style.flexWrap="wrap";
table.parentNode.insertBefore(container,table)
var smali=document.createElement("TEXTAREA");
smali.style.minWidth="600px";
smali.style.height="300px";
smali.id="smali";
smali.placeholder="Paste here the original smali code.";
container.appendChild(smali);
var dalvik=document.createElement("TEXTAREA");
dalvik.style.minWidth="600px";
dalvik.style.height="300px";
dalvik.readOnly=true
dalvik.id="dalvik";
dalvik.placeholder="The dalvik bytecode will appear here.";
container.appendChild(dalvik);
var codeVersion=document.createElement("FIELDSET");
var original=document.createElement("INPUT");
original.id="isOriginal";
original.type="radio";
original.name="codeVersion";
original.checked=true;
var labelO=document.createElement("LABEL");
labelO.innerText="Original";
labelO.for="isOriginal";
var patched=document.createElement("INPUT");
patched.id="isPatched";
patched.type="radio";
patched.name="codeVersion";
patched.checked=false;
var labelP=document.createElement("LABEL");
labelP.innerText="Patched";
labelP.for="isPatched";
codeVersion.appendChild(original);
codeVersion.appendChild(labelO);
codeVersion.appendChild(patched);
codeVersion.appendChild(labelP);
var convert=document.createElement("BUTTON");
convert.innerText="CONVERT";
convert.addEventListener("click",smali2davik);
codeVersion.appendChild(convert);
table.parentNode.insertBefore(codeVersion,table);

function smali2davik(){
  var hasPreciseLength=true;
  var preciseLength=0;
  var output="";
  var lines=document.getElementById("smali").value.split("\n");
  var instructions=[];
  for(let i=0;i<lines.length;i++){
    let line=lines[i].trim().split(" ")[0];
    if(line.length>0){
      if((line[0]!==":")&&(line[0]!==".")){
        instructions.push(line);
      }
    }
  }
  console.log(instructions);
  for(let instr of instructions){
    let i=names.indexOf(instr);
    if(i>=0){
      let wholeInstr=" "+i.toString(16).padStart(2, "0");
      for(let j=0;j<cmdLength[i]-1;j++){
        wholeInstr+=" ??";
      }
      if(cmdLength[i]==0){
        wholeInstr+=" ■Unknown bytecode length for instruction \'"+instr+"\'■";
        hasPreciseLength=false;
      }
      console.log(wholeInstr);
      output+=wholeInstr;
    }
    else{
      output+=(" ■Instruction \'"+instr+"\' not found■");
      hasPreciseLength=false;
    }
  }
  if(hasPreciseLength){
    preciseLength=output.length/3;
  }
  var lineHeader="original";
  if(document.getElementById("isPatched").checked){
    lineHeader="replaced"
  }
  output="{\""+lineHeader+"\":\""+output.trim()+"\"}";
  if(hasPreciseLength){
    dalvik.value=output+"\n\nTotal length: "+preciseLength+" bytes.";
  }
  else{
    dalvik.value=output;
  }
}