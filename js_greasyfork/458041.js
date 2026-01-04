// ==UserScript==
// @name         仙灵
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  仙灵  角色导入
// @author       hhzxxx
// @include *seelie.inmagi.com*
// @match        https://seelie.inmagi.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inmagi.com
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458041/%E4%BB%99%E7%81%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/458041/%E4%BB%99%E7%81%B5.meta.js
// ==/UserScript==

$(document).ready(function(){
    var i, c, fl, fk, x, a, b, mo = 0,
        glzs = 0,
        ver=0;

    setInterval(() => {
        for (let index = 0; index < document.getElementsByTagName('a').length; index++) {
            document.getElementsByTagName('a')[index].setAttribute('rel','noreferrer')
        }
    },300)




    //--------------左下角按钮--设置界面------   111-------
    let wdstyle = document.createElement('style');
    wdstyle.innerHTML = `
.xfsz {
transition: all 0.3s;
    height:60px;
    width: 60px;
    position: fixed;
    z-index: 10;
    opacity: 0;
    left: 0px;
    bottom: 0px;
  }
  .xfsz:hover{
    opacity: 1;
  }
  .xfck {
    display: none;
    background: #222;
    width: 300px;
    height: 100px;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 99999;
    border: solid 3px #000000;
  }
  .xfsc {
    background: #444;
    right: 20px;
    border-radius: 35px;
    margin-bottom: 13px;
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
    border: solid 5px #444;
    white-space: nowrap;
    float: left;
  }
  .xfsc:hover {
    background: #000;
    border: solid 5px #000;
  }
  .xfan {
    width: 100px;
    height: 40px;
  }
  .xfyy {
    overflow: auto;
    width: 700px;
    height: 430px;
    margin: auto;
  }
  #xf_sr {
    width: 580px;
    height: 32px;
    margin: auto;
  }
  #xf_dc {
    margin-left: 40px;
    margin-right: 40px;
  }
  .xfgb {
    position: absolute;
    right: 3px;
    top: 3px;
    cursor: pointer;
    font-size: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .xfgb:hover {
    background: #f00;
  }
  .tabbox ul {
    list-style: none;
    display: table;
    margin: 0;
    padding-left: 70px;
    width: 1000px;
  }
  .tabbox ul li {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border: 1px solid #aaccff;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
  }

  .tabbox ul li:hover{
    background-color: #111;
    color: white;
    font-weight: bold;
  }
  .tabbox ul li.active {
    background-color: #004f69;
    color: white;
    font-weight: bold;
  }
  .xfan,
  #xf_sr {
    background: #333;
    color: #ddd;
  }
  .xfan:hover,
  #xf_sr:focus {
    background: #111;
    color: #fff;
  }


.xfsz_an {
pointer-events:auto;
    left: 10px;
    bottom:10px;
cursor: pointer;
 --glow-color: rgb(217, 176, 255);
 --glow-spread-color: rgba(191, 123, 255, 0.781);
 --enhanced-glow-color: rgb(231, 206, 255);
 --btn-color: rgb(100, 61, 136);
 border: 3px solid var(--glow-color);
 color: var(--glow-color);
 font-size: 16px;
 font-weight: bold;
 background-color: var(--btn-color);
 border-radius: 50%;
 text-align: center;
 outline: none;
 box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
 text-shadow: 0 0 .5em var(--glow-color);
 position:absolute;
 display: block;
 transition: all 0.3s;
     width:40px;
    height:40px;
    line-height: 40px;
}

.xfsz_an:hover {
 color: var(--btn-color);
 background-color: var(--glow-color);
 box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 2em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
}

.xfsz_an:active {
 box-shadow: 0 0 0.6em .25em var(--glow-color),
        0 0 2.5em 2em var(--glow-spread-color),
        inset 0 0 .5em .25em var(--glow-color);
}
  `;
    let wddiv = `
<div class="xfsz">
    <div class="xfsz_an xfsz_sz" title="过滤设置">0</div>

</div>
<div class="xfck">
    <div>仙灵角色上传    GOOD导入</div>
    <div class="xfgb">X
    </div>
    <div>
        <input type="file" id="files" class="xfan" value="导入">
    </div>
</div>
`;


    document.body.appendChild(wdstyle);
    setTimeout(() => {
        document.querySelector("body").innderHTML += wddiv;
        $(wddiv).appendTo($("body"));
        //关闭
        $(".xfgb").click(function () {
            $(".xfck").toggle();
        })
        $(".xfsz_an").click(function () {
            $(".xfck").toggle();
        });

        var inputElement = document.getElementById("files");
        inputElement.addEventListener("change", handleFiles, false);
        function handleFiles() {
            var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
            var name = selectedFile.name;//读取选中文件的文件名
            var size = selectedFile.size;//读取选中文件的大小
            console.log("文件名:"+name+"大小："+size);
            var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
            reader.readAsText(selectedFile);//读取文件的内容
            let levelTextList = {
                0:"1",
                10:"1",
                20:"20",
                21:"20 A",
                31:"20 A",
                41:"40",
                42:"40 A",
                52:"50",
                53:"50 A",
                63:"60",
                64:"60 A",
                74:"70",
                75:"70 A",
                85:"80",
                86:"80 A",
                96:"90"
            }

            let levelList = [1,1,20,20,40,50,60,70,80,90]
            reader.onload = function(){
                let json = JSON.parse(this.result);
                if(json.characters){
                    let goals = JSON.parse(localStorage.getItem('main-goals'))
                    let newGoals = []
                    let id = 1
                    let character = null
                    let nameList = []
                    json.characters.filter(a => a.key != "TravelerDendro").forEach(c => {
                        //久七人   九条沙罗
                        let name = c.key.toLowerCase().replace("kukishinobu","shinobu").replace("kujousara","sara").replace("raidenshogun","shogun")
                        if(nameList.indexOf(name) < 0){
                            nameList.push(name)
                        }
                        character = {
                            "type": "character",
                            "character": name,
                            "current": {
                                "level": Math.round(c.level/10)*10,
                                "asc": c.ascension,
                                "text": levelTextList[Math.round(c.level/10)*10+c.ascension]
                            },
                            "goal": {
                                "level": Math.round(c.level/10)*10,
                                "asc": c.ascension,
                                "text": levelTextList[Math.round(c.level/10)*10+c.ascension]
                            },
                            "cons": c.constellation,
                            "id":id
                        }
                        let talent=	{
                            "type": "talent",
                            "character": name,
                            "normal": {
                                "current": c.talent.auto,
                                "goal": c.talent.auto
                            },
                            "skill": {
                                "current": c.talent.skill,
                                "goal": c.talent.skill
                            },
                            "burst": {
                                "current": c.talent.burst,
                                "goal": c.talent.burst
                            },
                            "id":id+1
                        }
                        let weapon = null
                        if(goals){
                            let existGoals = goals.filter(g => {
                                return g.character == name
                            }).forEach(e => {
                                if(e.type == "character"){
                                    if((e.goal.level + e.goal.asc) > (character.goal.level + character.goal.asc)){
                                        character.goal = e.goal
                                    }
                                }
                                if(e.type == "talent"){
                                    talent.normal.goal = Math.max(e.normal.goal,talent.normal.goal)
                                    talent.skill.goal = Math.max(e.skill.goal,talent.skill.goal)
                                    talent.burst.goal = Math.max(e.burst.goal,talent.burst.goal)
                                }
                                if(e.type == "weapon"){
                                    weapon = e
                                    weapon.id = id+2
                                }
                            })
                            }

                        character.current.level = levelList[Math.round(character.current.level/10)]
                        character.goal.level = levelList[Math.round(character.goal.level/10)]
                        newGoals.push(character)
                        newGoals.push(talent)

                        id = id + 2
                        if(weapon != null){
                            newGoals.push(weapon)
                            id = id + 1
                        }
                    })
                    if(goals){
                        let existGoals = goals.filter(g => {
                            return nameList.indexOf(g.character) < 0
                        }).forEach(e => {
                            e.id = id
                            newGoals.push(e)
                            console.log(e,"old");
                            id++
                        })
                        }
                    console.log(newGoals);
                    localStorage.setItem('main-goals',JSON.stringify(newGoals))
                    setTimeout(() => {
                        location.reload()
                    }, 1000);
                }

            };

        }

    }, 1000);
});