// ==UserScript==
// @name         Menu Editor (Console).
// @version      0.2
// @description  Menu Editor
// @author       Zpayer./.AMiNE.
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

const SetEditor=(ConfigColor='#9598c5',ConfigFont='monospace')=>{
let make=(cl)=>top.document.createElement(cl);
let html=(id)=>top.document.getElementById(id);
window.Editor=top.Editor={
    addCate:(name='unknown',clss='unknown')=>{
		let el=make('div');
		el.id=name+'_cate';
		el.textContent=name;
		el.className='_cate';
		el.style=`
        border-bottom:2px solid ${ConfigColor};
        width:98%;
        cursor:default;
        padding:4px;
        color:${ConfigColor};
        margin:10px 2px 2px 4px;
        transition: 0.5s;
        `;
		clss.appendChild(el);

        return el;
	},
    addButton:(name='unknown',clss='unknown',func=()=>{},long=false)=>{
		let el=make('input');
		el.id='_button';
        el.button_name=name;
		el.value=name;
		el.className=clss+'_element';
		el.type='button';
        el.style=`color:#aaa;background-color:#4f545c;border-radius:5px;border:none;height:23px;width:${long?'98.5%':'49%'};margin:1px;`;
		el.addEventListener('click',func);
		clss.appendChild(el);
        return el;
	},
     addRange:(text,clss,value,Min,Max,func)=>{
         let div = document.createElement("div")
        div.className = "CheatRangeDiv"
    div.style= ` width: 100%;`
        let txt = document.createElement("div")
        txt.style = `
font-family: ${ConfigFont};
    display: inline-block;
    width: 7%;
    font-size: 16px;
    left: 0%;
    color: rgb(219, 220, 220);
    position: relative;
    margin-right: 5%;
    text-align: left;
`
        txt.textContent = text
		let el=document.createElement('input');
		el.id=text+'slider';
		el.value=value;
		el.className='slider';
		el.type='range';
        el.max = Max
        el.min = Min
		el.style=``;
        let num=make('input');
        num.value = value
        num.id=text+' num';
        num.type='number';
        num.max = Max
        num.min = Min
        num.style=`
    color:${ConfigColor};
    background-color: rgba(255, 255, 255, 0.06);
    border-radius: 1px;
    border: 1px solid;
    height: 25px;
    width: 35%;
    right: 0%;
    position: relative;
    display: inline;
    margin: 0px 1px;
    text-align: center;
        `;
        num.addEventListener('input',function(){
el.value = num.value
        func()
        });
        el.addEventListener("input",function(){
num.value = el.value
        func()
        });
        div.appendChild(txt);
        div.appendChild(el);
        div.appendChild(num);
        clss.appendChild(div);
return {Number:num,Range:el,}
	},
     addField:(name='unknown',clss='unknown',n,Height=100,Width=95,top='l')=>{
          	let field = document.createElement("fieldset")
            field.id = n+'field_box'
          field.className = 'scroller'
           field.style=`
           width:${Width}%;
    top: ${top}%;
    height:${Height}%;
position: relative;
background: transparent;
    border: 1px solid rgb(255 255 255 / 86%);
    display: inline-block;
           `
	 clss.appendChild(field);
			let leg=make('legend');
		leg.id=name+'legend';
        leg.textContent =name
		leg.className='legend';
          leg.style=`
    font-size: 15px;
    font-weight: bold;
    text-align: left;
    text-transform: uppercase;
    padding: 3px;
    font-family:${ConfigFont};
    cursor: default;
    color:rgb(255 255 255 / 86%);
    width: 23%;
        `;
     field.appendChild(leg);
return field
	},
     addToggle:(name='unknown',clss='unknown',func2=()=>{},func1=()=>{},check=false)=>{
         let div = document.createElement("div")
        div.className = "CheatRangeDiv"

        let txt = document.createElement("h2")
        txt.style = `
    font-family: ${ConfigFont};
    display: inline-block;
    font-size: 16px;
    position: relative;
    text-align: left;
    /* left: -22%; */
    margin-left: -54%;
}`
        txt.textContent = name
		let el=make('label');
        el.className = 'switcher'
        let checkbox=make('input');
        checkbox.type = 'checkbox'
        checkbox.checked=check
        checkbox.id = name+'_Switcher'
        el.onclick=()=>{
             if(checkbox.checked){
            func2()
checkbox.checked=false;
        }else{
            func1()
checkbox.checked=true;
        }

    }
el.appendChild(checkbox);

        let slider=make('span');
        slider.className = 'toggle'
el.appendChild(slider);

 div.appendChild(txt);
div.appendChild(el);
		clss.appendChild(div);

	},
     addSelect:(txt, options, tab, confirm)=>{
            let div = document.createElement("div")
            div.className = "CheatSelectDiv"
            let select = document.createElement("select")
            select.className = "CheatSelect"
            select.defaultState = function(){
                select.options[0].selected = true
            }
            select.updateOptions = function(options){
                select.options.length = 0
                let option = document.createElement("option")
                option.textContent = txt
                option.disabled = true
                option.selected = true
                select.appendChild(option)
                options.forEach((opt)=>{
                    let option = document.createElement("option")
                    option.textContent = opt
                    select.appendChild(option)
                })
            }
            let option = document.createElement("option")
            option.selected = true
            option.disabled = true
            option.textContent = txt
            select.appendChild(option)
            options.forEach((opt) => {
                let option = document.createElement("option")
                option.textContent = opt
                select.appendChild(option)
            })
            let input = document.createElement("input")
            input.className = "CheatButton"
            input.style = `
            height: 40px;
            width: 40px;
            margin-left: 10px;
            `
            input.type = "button"
            input.value = "✓"
            input.onclick = confirm
            div.appendChild(select)
            div.appendChild(input)
            tab.appendChild(div)
    return select
        },
     addPlaceHolder:(txt,clss,id,func=()=>{})=>{//----------------------------------------- super "All" Chat
		let el= make('input');
		el.id=id;
        el.type='placeholder';
        el.style=`
    color: rgb(219, 220, 220);
    background-color: rgba(163, 165, 167, 0.07);
    border-radius: 1px;
    border: 1px solid;
    height: 30px;
    width: 95%;
    margin: 1px 11px;`;
    el.placeholder = txt;
    el.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
func()
            el.value = "";
        }
    });
     clss.appendChild(el);
    return el
},
     addLister:(txt,options,tab,func)=>{
     let div = document.createElement("div")
     let div2_ = document.createElement("div")
var divslist=[]
//var ListOfSelected=[]
var ListerSelector = addSelect(txt,options,tab,()=>{
const Selected=GetSelected(ListerSelector)
ListerSelector.Lister.push(Selected)
let div2 = document.createElement("div")
var tt = addButton(Selected,div2,()=>{})
tt.style.width='80%'
var yoptov= addButton("X",div2,()=>{
const index = ListerSelector.Lister.indexOf(Selected);
if (index > -1) { // only splice array when item is found
  ListerSelector.Lister.splice(index, 1); // 2nd parameter means remove one item only
}
    div2.remove()
})
yoptov.style.width='15%'
div2_.appendChild(div2);
divslist.push(div2)
})
ListerSelector.Lister=[]
 div.appendChild(div2_);
 var ApplyButton=addButton('Apply',div,()=>{
 func()
ListerSelector.Lister=[]
 divslist.forEach(k=>k.remove())
 },true)
    tab.appendChild(div);
        return ListerSelector
    },
	 addBB:(name='unknown',id='unknown',box='unknown_box',choosen=0)=>{
		let el=make('div');
        var jo = el
        el.className='scroller'
		el.id=box;
		el.style=`
			position:absolute;
			display:${choosen?'block':'none'};
			width:75%;height:90%;
			top:10%;
			right:0px;
		`;
		html('console').appendChild(el);
		el=make('div');
		el.id='console_bar_'+id;
		el.className='bar_element bar_element_'+(choosen?'on':'off');
		el.textContent=name;
		el.addEventListener('click',function(e){
			if(this!=html('console_bar').cur){
				html(box).style.display='block';
				html('console').cur.style.display='none';
				html('console').cur=html(box);
				this.className='bar_element bar_element_on';
				html('console_bar').cur.className='bar_element bar_element_off';
				html('console_bar').cur=this;
			}
		});
		html('console_bar').appendChild(el);
        return jo
	},
     addColorPicker:(clss='unknown',value)=>{
	let el=make('input');
	el.className='color'+clss;
    el.value = value
    el.type='color';
    el.style=`
    background-color: rgb(192 192 192);
    border-radius: 2px;
    border: none;
    height: 37%;
    width: 40%;
`;
		clss.appendChild(el);
        return el;
	},
     addFile:(clss='unknown')=>{
		let el=make('input');
    el.className='fileClass';
	el.type='file';
    el.id = 'fileu'
    el.style = 'position: fixed;right: 20000000000000%;'
		clss.appendChild(el);
       	let button=make('input');
		button.className='NewfileClass';
		button.type='button';
       button.id = 'filebutton';
       button.value = 'Choose image';
       button.onclick = function(){el.click()}
       button.style = `
       color: ${ConfigColor};
    background-color: rgb(35 35 35);
    border-radius: 5px;
    border: 1px solid ${ConfigColor};
    height: 25px;
    width: 25%;
    margin: 1px;`
		clss.appendChild(button);
        return el;
	},
     addSwitcher:(name='unknown',clss='unknown',state=[],func=[],funcint=[],time=0,vehicle='')=>{
        let a=make('div');
        a.id=vehicle+name+'_switcher_settings';
        a.style=`
        display:flex;
        justify-content:center;
        align-items:center;
        margin:3px 0;
        `;
        clss.appendChild(a);
		let elm=make('div');
		elm.id=vehicle+name+'_switcher_attribute';
        elm.style=`
        color:#aaa;
        width:49%;
        display:flex;
        align-items:center;
        justify-content:center;
        margin:1px 11px;
        `;
        elm.textContent=name;
		a.appendChild(elm);
		var el=make('input');
        var switchinterval=0;
        var i=0;
		el.id=vehicle+name+'_switcher';
        el.button_name=vehicle+name;
		el.value=state[0];
		el.className=clss+'_element';
		el.type='button';
        el.style=`
        color:#aaa;
        background-color:#4f545c;
        border-radius:5px;
        border:none;
        height:23px;
        width:49%;
        margin:1px 11px;
        `;
		el.addEventListener('click',function(){
        if(i)clearInterval(switchinterval);
        i=++i%(state.length);
        el.value=state[i];
        if(func[i])func[i]();
        if(i&&funcint[i])switchinterval=setInterval(funcint[i],time);
        });
		a.appendChild(el);
        return a;
	},
     addList:(name,clss,list=[],func=[],Lists=Console_.Lists)=>{
    let edl=make('div');
	edl.id=name+'_list';
    edl.className='scroller'
edl.setAttribute('style', `
	display:none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(35 35 35 / 94%);
    direction: rtl;
    border: 1px solid rgb(54, 57, 63);
`);
    clss.appendChild(edl);
    addCate(name,edl)
    edl.CurrentButtons=[]
    /*edl.UpdateFunctions=function(NewFunc){
    edl.CurrentButtons.forEach(m=>m.remove())
    edl.CurrentButtons=[]
  for (var i=0;i>=Math.min(list.length,func.length); i++) {
var CB = addButton(list[i],edl,()=>{edl.style.display='none';NewFunc[i]();})
edl.CurrentButtons.push(CB)
            }
    }
    edl.UpdateList=function(NewList){
    edl.CurrentButtons.forEach(m=>m.remove())
    edl.CurrentButtons=[]
  for (var i=0;i>=Math.min(list.length,func.length); i++) {
var CB = addButton(NewList[i],edl,()=>{edl.style.display='none';func[i]();})
edl.CurrentButtons.push(CB)
            }
    }*/
    edl.UpdateAll=function(NewList,NewFunc,time=10){
if(Math.min(NewList.length,NewFunc.length)!=0){
      var i = 0
var ButtonMakerInter = setInterval(()=>{
    if(i>=Math.min(NewList.length,NewFunc.length)){
clearInterval(ButtonMakerInter);ButtonMakerInter=0;
       }else{
           i++
var CB = addButton(NewList[i],edl,()=>{edl.style.display='none';NewFunc[i]();})
edl.CurrentButtons.push(CB)
        }
},time)
        }
    }
        if(Lists.Lists[name]==undefined){
    Lists.Lists[name]=[]
        }
    Lists.Lists[name].push(edl)
        if(Math.min(list.length,func.length)!=0){
      var i = 0
var ButtonMakerInter = setInterval(()=>{
    if(i>=Math.min(list.length,func.length)){
clearInterval(ButtonMakerInter);ButtonMakerInter=0;
       }else{
            i++
var CB = addButton(list[i],edl,()=>{edl.style.display='none';func[i]();})
edl.CurrentButtons.push(CB)
        }
},10)
        }
    return edl
    },
}
var sheet=top.document.head.appendChild(make('style')).sheet;
	sheet.insertRules=rules=>rules.replace(/\}/g,'}^').split('^').map(r=>(r.indexOf('{')+1)&&sheet.insertRule(r));
	sheet.insertRules(`
		.scroller{overflow-y:auto;}
		.scroller::-webkit-scrollbar{
			width:10px;
		}
		.scroller::-webkit-scrollbar-thumb{
			background-color:rgba(0,0,0,.4);
			-webkit-box-shadow:inset 0 0 2px rgba(0,0,0,.5);
			box-shadow:inset 0 0 2px rgba(0,0,0,.5);
		}
		.scroller::-webkit-scrollbar-track{
			background-color:rgba(0,0,0,.3);
		}
		.scroller::-webkit-scrollbar-thumb{
			background:#000;
		}
		.bar_element:hover{
			opacity:0.9;
			background:#40444bAA;
			transition-duration: 0.3s;
		}
		.bar_element{
			color:#FFF;
			line-height: 200%;
			cursor:pointer;
			height:10%;
			width:100%;
		}
		.cheat_element:hover{
			color:#FFF !important;
		}
		.bar_element_off{
			opacity:0.5;
			background:#0000;
		}
		.bar_element_on{
			opacity:1;
			background:#40444b;
		}
               .CheatSelect {
    background-color: rgb(38 38 38 / 0%);
    color: rgb(219 220 220);
    height: 40px;
    box-sizing: border-box;
    border: 1px solid;
    width: 61%;
    opacity: 0.7;
    transition: all 0.5s ease 0s;
    display: inline-block;
    font-family: ${ConfigFont};
}
.CheatSelect:hover {
opacity: 1;
}
.CheatButton {
background-color: rgb(38 38 38 / 0%);
    color: rgb(219, 220, 220);
    height: 40px;
    width: 140px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid;
    outline: none;
    opacity: 0.7;
    transition: all 0.5s ease 0s;
}
.CheatButton:hover {
opacity: 1;
}
.slider {
    appearance: none;
    width: 46%;
    height: 5px;
    background: rgb(219, 220, 220);
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s ease 0s;
    display: inline;
    margin: 6px;
}
.slider:hover {
  opacity: 1;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 15px;
  background:${ConfigColor};
  cursor: pointer;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.switcher {
    position: absolute;
    display: inline-block;
    width: 57px;
    height: 23px;
    left: 74%;

}

.switcher input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.toggle:before {
position: absolute;
    content: "";
    height: 21px;
    width: 20px;
    left: 8px;
    border-radius: 4px;
    bottom: 1px;
    background-color: white;
    transition: all 0.4s ease 0s;
}

input:checked + .toggle {
    background-color:${ConfigColor};
}

input:focus + .toggle {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .toggle:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
	`);
return window.Editor
}