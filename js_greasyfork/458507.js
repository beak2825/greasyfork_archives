// ==UserScript==
// @name         Dark Deception Map Tool （remake by vicent in box3）
// @namespace    https://box3.codemao.cn/u/vicent
// @version      0.1
// @description  在游戏界面左下角显示小地图
// @author       Vicent轩
// @match        https://box3.codemao.cn/e/6e53a3686727fe6a0f27
// @match        https://box3.codemao.cn/p/ddeception
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codemao.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/458507/Dark%20Deception%20Map%20Tool%20%EF%BC%88remake%20by%20vicent%20in%20box3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/458507/Dark%20Deception%20Map%20Tool%20%EF%BC%88remake%20by%20vicent%20in%20box3%EF%BC%89.meta.js
// ==/UserScript==

async function main(){
    function unpackData(data){
        let all = data.split("|")
        let doneData = []
        for(const c of all){
            let aC = c.split(",")
            doneData.push(aC)
        }
        return doneData
    }
    let mk_cData = "3,0,9|3,0,14|3,0,91|3,0,97|3,0,103|3,0,130|3,0,136|3,0,146|3,0,151|3,0,243|7,0,140|9,0,124|9,0,156|10,0,251|11,0,2|13,0,140|13,0,162|13,0,168|13,0,174|13,0,180|13,0,186|13,0,196|13,0,202|13,0,208|13,0,214|13,0,220|13,0,226|13,0,232|14,0,17|14,0,23|14,0,29|14,0,35|14,0,41|14,0,47|14,0,53|14,0,59|14,0,65|14,0,71|14,0,77|14,0,83|14,0,89|14,0,95|14,0,101|14,0,113|14,0,119|18,0,2|19,0,140|19,0,190|19,0,241|20,0,11|23,0,7|25,0,140|25,0,190|25,0,241|26,0,11|26,0,91|26,0,97|26,0,103|31,0,140|31,0,190|31,0,241|32,0,11|37,0,140|37,0,190|37,0,241|38,0,11|43,0,140|43,0,190|43,0,241|44,0,11|49,0,140|49,0,190|49,0,241|50,0,11|55,0,107|55,0,113|55,0,119|55,0,134|55,0,190|55,0,241|56,0,11|61,0,140|61,0,153|61,0,190|61,0,241|62,0,11|64,0,85|64,0,91|64,0,95|65,0,125|65,0,190|67,0,140|68,0,11|70,0,159|70,0,165|70,0,171|70,0,177|70,0,183|70,0,195|70,0,207|70,0,213|70,0,219|70,0,225|70,0,231|70,0,237|70,0,247|71,0,125|73,0,101|73,0,140|74,0,11|76,0,201|76,0,251|77,0,125|79,0,101|79,0,140|79,0,153|80,0,11|82,0,100|82,0,201|82,0,251|84,0,16|84,0,22|84,0,70|84,0,88|84,0,95|84,0,105|84,0,111|86,0,11|86,0,244|88,0,201|90,0,29|90,0,64|91,0,101|91,0,140|92,0,11|92,0,238|95,0,192|96,0,29|96,0,64|97,0,101|97,0,140|98,0,11|98,0,238|101,0,35|101,0,41|101,0,47|101,0,53|101,0,59|101,0,185|103,0,101|103,0,140|104,0,11|104,0,238|107,0,47|108,0,185|109,0,101|109,0,140|110,0,11|110,0,238|113,0,47|115,0,101|115,0,140|115,0,179|115,0,191|115,0,197|115,0,243|115,0,247|116,0,11|119,0,54|121,0,101|121,0,140|121,0,173|121,0,201|121,0,251|122,0,11|125,0,36|125,0,58|127,0,101|127,0,173|127,0,201|127,0,251|130,0,146|131,0,16|131,0,22|131,0,28|131,0,64|131,0,70|131,0,76|131,0,82|131,0,88|131,0,94|131,0,106|131,0,112|131,0,118|131,0,124|131,0,130|133,0,173|133,0,201|133,0,251|135,0,205|135,0,211|135,0,217|135,0,223|135,0,229|135,0,235|135,0,241|136,0,150|137,0,36|137,0,58|137,0,134|139,0,101|139,0,201|139,0,251|140,0,11|140,0,156|140,0,162|140,0,167|143,0,36|143,0,58|145,0,101|145,0,173|145,0,201|145,0,251|146,0,11|146,0,140|151,0,101|151,0,173|151,0,201|151,0,251|152,0,11|152,0,47|152,0,101|152,0,144|156,0,246|157,0,101|158,0,11|158,0,144|160,0,47|162,0,240|163,0,101|164,0,11|164,0,144|165,0,187|166,0,47|168,0,240|170,0,11|170,0,144|171,0,52|171,0,58|171,0,85|171,0,91|171,0,187|174,0,240|176,0,144|177,0,66|177,0,79|177,0,187|178,0,47|180,0,3|180,0,21|180,0,240|182,0,144|183,0,79|183,0,187|184,0,47|184,0,66|186,0,3|186,0,21|189,0,51|189,0,57|189,0,87|189,0,93|189,0,99|189,0,105|189,0,111|189,0,117|189,0,123|189,0,129|189,0,135|189,0,141|189,0,147|189,0,153|189,0,159|189,0,165|189,0,171|189,0,177|189,0,183|189,0,195|189,0,201|189,0,207|189,0,213|189,0,219|189,0,225|189,0,231|189,0,235|192,0,3|192,0,21|194,0,133|194,0,144|194,0,156|195,0,79|196,0,47|198,0,240|199,0,139|199,0,151|201,0,79|202,0,47|204,0,240|206,0,11|206,0,144|207,0,79|208,0,47|209,0,86|209,0,92|210,0,240|212,0,11|212,0,144|214,0,47|215,0,101|216,0,240|218,0,11|218,0,144|220,0,47|221,0,101|222,0,240|224,0,11|224,0,144|225,0,195|225,0,201|225,0,207|226,0,47|227,0,101|228,0,240|230,0,11|230,0,144|231,0,189|231,0,216|232,0,47|232,0,245|233,0,101|234,0,240|236,0,11|236,0,144|238,0,251|240,0,3|240,0,17|240,0,23|240,0,29|240,0,35|240,0,41|240,0,53|240,0,59|240,0,65|240,0,71|240,0,77|240,0,83|240,0,89|240,0,95|240,0,107|240,0,113|240,0,119|240,0,169|240,0,175|240,0,181|240,0,184|240,0,220|240,0,226|240,0,232|240,0,235|242,0,144|244,0,251|246,0,3|246,0,17|249,0,189|249,0,216|251,0,131|251,0,137|251,0,149|251,0,155|251,0,195|251,0,201|251,0,207|251,0,241|251,0,247"
    let agf_cData = "2,8,38|2,8,51|6,8,57|9,8,38|12,8,61|12,8,72|12,8,82|18,8,52|21,8,88|24,8,52|29,8,88|34,8,45|34,8,96|40,8,39|40,8,102|42,8,52|47,8,24|47,8,31|47,8,59|47,8,66|47,8,73|47,8,81|47,8,89|47,8,96|47,8,116|52,8,39|52,8,102|53,8,123|54,8,52|55,8,17|58,8,39|58,8,102|59,8,123|61,8,45|64,8,17|65,8,123|67,8,88|69,8,23|71,8,123|75,8,31|75,8,39|75,8,74|76,8,88|77,8,67|77,8,123|80,8,88|81,8,74|82,8,94|82,8,102|82,8,111|82,8,118|82,8,131|84,8,88|85,8,67|89,8,138|90,8,31|90,8,88|93,8,39|93,8,74|94,8,66|96,8,24|96,8,58|96,8,129|102,8,88|108,8,88|109,8,38|110,8,3|110,8,17|110,8,31|115,8,38|116,8,3|116,8,17|116,8,31|117,8,61|117,8,68|117,8,82|122,8,3|122,8,17|122,8,31|123,8,53|124,8,74|128,8,17|129,8,53|130,8,81|132,8,88|135,8,53|135,8,124|138,8,17|138,8,88|141,8,53|141,8,124|144,8,88|146,8,17|147,8,53|147,8,124|150,8,88|152,8,23|152,8,34|152,8,49|152,8,60|152,8,70|152,8,78|152,8,99|152,8,112|156,8,88|159,8,53|159,8,124|162,8,88|165,8,53|165,8,124|168,8,88|171,8,53|171,8,124|173,8,62|173,8,130|174,8,88|179,8,138|180,8,88|186,8,80|186,8,97|186,8,105|186,8,112|186,8,119|186,8,125|191,8,138|192,8,88|193,8,67|198,8,88|198,8,138|200,8,60|200,8,131|204,8,88|206,8,53|210,8,88|214,8,110|214,8,124|214,8,138|215,8,53|216,8,88|220,8,102|220,8,110|220,8,124|220,8,138|221,8,59|221,8,71|221,8,79|221,8,94|226,8,110|226,8,124|226,8,138|227,8,83|227,8,103|232,8,124|233,8,83|233,8,88|233,8,95|233,8,102"
    let duck_cData = "15,16,98|15,16,112|15,16,125|15,16,142|15,16,155|28,16,98|28,16,125|29,16,153|41,16,98|41,16,109|42,16,43|42,16,58|42,16,70|42,16,83|42,16,117|42,16,125|42,16,140|42,16,153|42,16,170|42,16,184|42,16,198|42,16,208|53,16,208|55,16,97|55,16,153|67,16,153|68,16,43|68,16,208|69,16,16|69,16,28|69,16,223|69,16,236|72,16,97|78,16,208|79,16,16|79,16,154|95,16,81|95,16,208|96,16,16|96,16,42|96,16,59|96,16,71|96,16,97|96,16,109|96,16,126|96,16,140|96,16,154|96,16,164|96,16,175|96,16,187|96,16,198|108,16,42|109,16,16|109,16,153|111,16,208|112,16,97|121,16,42|122,16,55|122,16,70|123,16,86|123,16,97|123,16,155|123,16,165|123,16,198|124,16,176|124,16,187|124,16,208|134,16,98|135,16,42|136,16,154|136,16,208|137,16,15|147,16,208|150,16,16|150,16,43|150,16,56|150,16,69|150,16,83|150,16,98|150,16,113|150,16,127|150,16,153|150,16,167|150,16,184|150,16,196|159,16,208|163,16,152|165,16,42|166,16,16|169,16,97|171,16,208|176,16,153|177,16,16|177,16,24|178,16,32|178,16,42|178,16,221|178,16,236|179,16,97|182,16,208|187,16,153|189,16,96|191,16,42|194,16,208|204,16,87|205,16,43|205,16,58|205,16,75|205,16,96|205,16,112|205,16,126|205,16,140|205,16,153|205,16,160|205,16,169|205,16,182|205,16,189|205,16,199|205,16,208|218,16,96|218,16,125|219,16,153|233,16,97|233,16,111|233,16,125|233,16,139|233,16,153"
    const cData = {
        "mk":unpackData(mk_cData),
        "agf":unpackData(agf_cData),
        "duck":unpackData(duck_cData)
    }
    console.log(cData)
    const gameList = ["mk","agf","duck"]
    let game = ""
    var area = ""
    let now_c_data = null
    let c_check_por = null
    let cNum = 0
    const box3=document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.state;
    const map_html = document.getElementById("map_img")
    const pMark_html = document.getElementById("playerMark")
    const mContext_html = document.getElementById("mainContext")
    const sContext_html = document.getElementById("smallContext")
    const offset_v = 250/256
    const map_imgURL={
        "black":"https://img.gejiba.com/images/0793095dec7a58c0d6d9a42ddbebcd6f.jpg",
        "hall":"https://img.gejiba.com/images/d8017aeed3abbe466d7d4ad583721a9c.jpg",
        "mk":"https://img.gejiba.com/images/b337a40a87fd42870da0da1ef7888299.jpg",
        "mk_intro":"https://img.gejiba.com/images/0318f167f1cc5b2c852ef9e7992a6823.jpg",
        "agf":"https://img.gejiba.com/images/1c805e1187aff58725ae2fda65ab0b76.jpg",
        "duck":"https://img.gejiba.com/images/4286cef7abdec6a4df23733c41a11b54.jpg"
    }
    function getPlayerPosition(){
        var pos_data = box3.box3.model.state.camera.targetLook
        return [pos_data[0],pos_data[1],pos_data[2]]
    }
    function run_playerMark(){
        var position = getPlayerPosition()
        var x_offset = 5+position[0]*offset_v
        var y_offset = 280-position[2]*offset_v
        pMark_html.style.left = x_offset+"px"
        pMark_html.style.bottom = y_offset+"px"
    }
    function clear_C(){
        for(const ccc of now_c_data){
            try{
                document.getElementById(ccc[0]+"-"+ccc[2]).remove()
            }catch{}
        }
        mContext_html.innerHTML="---"
    }
    function setC(x,z,id){
        var c_mark= document.createElement("div")
        c_mark.setAttribute("id",id)
        c_mark.classList.add("mark")
        c_mark.classList.add("cMark")
        document.body.appendChild(c_mark)
        var x_offset = 5+x*offset_v
        var y_offset = 280-z*offset_v
        c_mark.style.left = x_offset+"px"
        c_mark.style.bottom = y_offset+"px"
    }
    function check_c(){// 175 293
        var c_data =cData[game]
        for(const cc of c_data){
            var v=box3.box3.voxel.getVoxel(cc[0],cc[1],cc[2]);
            let markh = document.getElementById(cc[0]+"-"+cc[2])
            if(v==175){
                if(markh != null){
                    markh.remove()
                    cNum -= 1
                    mContext_html.innerHTML = cNum
                }
            }else if(v==293){
                if(markh == null){
                    setC(cc[0],cc[2],cc[0]+"-"+cc[2])
                    cNum+=1
                    mContext_html.innerHTML = cNum
                }
            }
        }
    }
    function run_cMark(){
        if(c_check_por != null)clearInterval(c_check_por)
        now_c_data = cData[game]
        console.log(now_c_data)
        var now_game = game
        cNum= now_c_data.length
        for(const c of now_c_data){
            if(c == undefined){
                cNum -= 1
                continue
            }
            setC(c[0],c[2],c[0]+"-"+c[2])
        }
        mContext_html.innerHTML=cNum
        c_check_por = setInterval(check_c,500)
    }
    function change_map(name){
        if(name != area){
            map_html.src=map_imgURL[name]
            area = name
            if (gameList.includes(name)){
                game=name
                run_cMark()
            }else{
                game = ""
                if(c_check_por != null)clearInterval(c_check_por)
                clear_C()
                c_check_por = null
                now_c_data = null
            }
        }
    }
    function main_ly(){
        var pos = getPlayerPosition()
        if(pos[1] < 8){
            if(pos[0]>=193 && pos[0]<=236 && pos[2]>=159 && pos[2]<=185){
                change_map("hall")
            }else if(pos[0]>=98 && pos[0]<=125 && pos[2]>=112 && pos[2]<=135){
                change_map("mk_intro")
            }else if(pos[0]>=243 && pos[0]<=250 && pos[2]>=20 && pos[2]<=33){
                change_map("black")
            }else{
                change_map("mk")
            }
        }else if(pos[1]>=8 && pos[1]<16){
            change_map("agf")
        }else if(pos[1]>=16){
            change_map("duck")
        }
    }
    console.log("Map tool Startrun")
    setInterval(main_ly,100)
    setInterval(run_playerMark)
}
function load(){
    function setGUI() {
        let main_box=document.createElement("div")
        let css_box=document.createElement("style")
        css_box.innerHTML=`
.main_box{
    width: 260px;
    height: 360px;
    display: block;
    background-color: black;
    position: fixed;
    top: unset;
    left: 5px;
    bottom: 5px;
    right: unset;
    border-radius: 25px;
    box-shadow:2px 2px 5px red;
}
.text_center{
    color: aliceblue;
    text-align: center;
    padding: 1px;
    margin: 3px;
}
.mark{
        position: fixed;
        display: block;
        top: unset;
        right: unset;
        bottom: 35px;
        left: 255px;
    }
.playerMark{
        background-color: red;
        width: 9px;
        height: 9px;
        border-radius: 50px;
}
.cMark{
    background-color:blueviolet;
    width:5px;
    height:5px;
}
.map{
    width: 256px;
    height: 256px;
}`
        main_box.classList.add("main_box")
        main_box.innerHTML = `<h5 class="text_center" id="smallContext">Dark Deception</h5>
    <h1 class="text_center" id="mainContext">---</h1>
    <img class="map" id="map_img" src="">
    <div class="mark playerMark" id="playerMark"></div>`
        document.body.appendChild(css_box)
        document.body.appendChild(main_box)
    };
    let interval = setInterval(function(){
        let text=document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.state;
        if(text != undefined){
            setGUI()
            main()
            clearInterval(interval)
        }
    },1000)
    }
load()