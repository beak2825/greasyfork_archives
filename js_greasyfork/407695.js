// ==UserScript==
// @name         日文wiki/萌百添加人物
// @namespace    chitanda
// @version      0.2.1
// @description  从日文wiki和萌百添加人物信息
// @author       chitanda
// @match        https://ja.wikipedia.org/wiki/*
// @match        https://*.moegirl.org*/*
// @match        https://*.moegirl.org.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/407699-bgm-wikihelper-core-js/code/bgm_wikihelpercorejs.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407695/%E6%97%A5%E6%96%87wiki%E8%90%8C%E7%99%BE%E6%B7%BB%E5%8A%A0%E4%BA%BA%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/407695/%E6%97%A5%E6%96%87wiki%E8%90%8C%E7%99%BE%E6%B7%BB%E5%8A%A0%E4%BA%BA%E7%89%A9.meta.js
// ==/UserScript==

(function() {

    //下面的设置项只有在非萌白或者wiki的页面下才会起效，萌白和wiki以ui上用户提交的数据为准
    //关联设置:
    //角色需要关联的条目类型，后面跟条目id。如果没有则留空。real表示三次元条目
    //如果同类型要关联多个的用,隔开。比如book:'111,2222,333'
     subRelatedSetting = {
        'anime': '',
        'book': '',
        'music': '',
        'game': '',
        'real': ''
    };
    //需要关联CV的条目。之所以和上面的分开设置是因为有时候比如主条目关联book但是没CV的情况。
    //所以这里还是自己设置好。规则和上面角色关联一样。
     CVRelatedSetting = {
        'anime': '',
        'book': '',
        'music': '',
        'game': '',
        'real': ''
    };


    //关联的角色类型（主角配角客串对应123，默认配角）。这个值一次只能设置一次。
     charaType = 2;

    /*    现实人物类型。chara表示添加的是虚拟角色。其他的依次是：'漫画家  绘师  作家
    声优  歌手/音乐家/乐队组合  演员  制作人员/制作公司'*/
     charaKindArr = ['chara', 'mangaka', 'illustrator', 'writer', 'seiyu', 'artist', 'actor', 'producer']

    //从上面数组里选一个。默认为虚拟角色
     charaKind = 'chara';

    //人物类型，虚拟角色对应角色、机体、舰船、组织机构；现实人物对应分别对应人物、公司、组合
     charaRole = 1;


    //是否检查条目已存在。默认检查，确定不存在的话不要检查。需要检查的改成1。新条目会有延迟，所以不要乱试
     checkDupe = 1;

    //是否开启调试模式。0关闭，1开启。默认开启。开启后只会在cosole.log里输出要提交的数据而不是真正提交。
     debugFlg = 1;


    //编辑模式。如果是要替换已有条目的话，直接输入对应的条目id。新加条目的话留空
    editSubId = '';



    
    //搜索条目，name是条目名字，type是类型。1=Book 2=Anime 3=Music 4=Game 6=Real。默认anime
    /*    async function searchSubject(name, type) {
            if (!type) {
                type = 2
            }
            let url = `https://bgm.tv/subject_search/${name}?cat=${type}`;
            let res = await get(url);
            let doc = res.response;
            let items = $(doc).find('#browserItemList li');
            if (items.length > 0) {
                let userConfirm = confirm("看起来已经有同名条目了，去看看吧");
                if (userConfirm) {
                    GM_openInTab(url, 'active');
                    let addConfirm = confirm("已经确认过是否有重复条目了，要继续添加吗？");
                    if (addConfirm) {
                        //添加条目函数
                    }
                }
            } else {
                //后续添加条目函数
            }
        }
    */

   



    //用户填写信息的UI相关
    var bgm_wikibox_tpl = `
<div class="bgm_wikibox ">
    <div class=" bgm_ui_box_wraper hiden">
        <div id="subRelatedSetting" class="relateSub bgm_ui_box">
            <div>角色需要关联的主条目，只用写条目id。如果没有则留空。real表示三次元条目。如果同类型要关联多个的用“,”（英文逗号）隔开。比如“111,2222,333”</div>
            <input type="text" id="subRelatedanime" name="anime" placeholder="动画">
            <input type="text" id="subRelatedbook" name="book" placeholder="书籍">
            <input type="text" id="subRelatedmusic" name="music" placeholder="音乐">
            <input type="text" id="subRelatedgame" name="game" placeholder="游戏">
            <input type="text" id="subRelatedreal" name="real" placeholder="三次元">
        </div>
        <div id="CVRelatedSetting" class="relateSub bgm_ui_box ">
            <div>角色需要关联声优的条目，只用写条目id。如果没有则留空。real表示三次元条目。声优名字不用填写，会自动抓取</div>
            <input type="text" id="cvRelatedanime" name="anime" placeholder="动画">
            <input type="text" id="cvRelatedbook" name="book" placeholder="书籍">
            <input type="text" id="cvRelatedmusic" name="music" placeholder="音乐">
            <input type="text" id="cvRelatedgame" name="game" placeholder="游戏">
            <input type="text" id="cvRelatedreal" name="real" placeholder="三次元">
        </div>
        <div class="charaType bgm_ui_box">
            <div>
                关联的角色类型（主角/配角/客串对应123，默认配角）。这个值一次只能设置一次。
            </div>
            <input id="charaType" type="text" name="charaType" value="2" placeholder="2">
        </div>
        <div class="personType bgm_ui_box ">
            <div><b>职业</b>默认虚拟角色，后面的类型都是给现实人物的</div>
            <div>
                <input id="crtProChara" type="radio" name="person" value="chara" checked> <label for="crtProChara">虚拟角色</label>
                <input id="crtProMangaka" type="radio" name="person" value="mangaka"> <label for="crtProMangaka">漫画家</label>
                <input id="crtProIllustrator" type="radio" name="person" value="illustrator"> <label for="crtProIllustrator">绘师</label>
                <input id="crtProWriter" type="radio" name="person" value="writer"> <label for="crtProWriter">作家</label>
                <br>
                <input id="crtProSeiyu" type="radio" name="person" value="seiyu"> <label for="crtProSeiyu">声优</label>
                <input id="crtProArtist" type="radio" name="person" value="artist"> <label for="crtProArtist">歌手/音乐家/乐队组合</label>
                <input id="crtProActor" type="radio" name="person" value="actor"> <label for="crtProActor">演员</label>
                <input id="crtProProducer" type="radio" name="person" value="producer"> <label for="crtProProducer">制作人员/制作公司</label>
            </div>
        </div>
        <div class="bgm_ui_box charaRole">
            <div>
                人物类型，数字1-4。虚拟角色对应角色、机体、舰船、组织机构；现实人物对应分别对应人物、公司、组合。默认角色or人物条目
            </div>
            <input type="text" id="charaRole" class='charaSetting' value="1" placeholder="1">
        </div>
        <div class="bgm_ui_box editSub">
            <div>
                编辑模式。如果是要替换已有条目的话，直接输入对应的条目id。新加条目的话留空,默认留空
            </div>
            <input type="text" id="editSub" value="" class='charaSetting'>
        </div>
        <div class="bgm_ui_box checkBox">
            <div>
                <p>
                    查重:会在添加前先检查条目是否已存在。默认检查，确定不存在的话不要检查。新增条目会有延迟，不一定查得到，所以不要乱试。
                </p>
                <p>
                    调试模式：开启后只会在cosole里输出要提交的数据而不是真正提交,默认关闭
                </p>
            </div>
            <input type="checkbox" id="checkDupe" value="1" checked="true"><label for="checkDupe">查询重复条目</label>

            <input type="checkbox" id="debugFlg" value="1" checked="true"><label for="debugFlg">
                调试模式
            </label>
        </div>
            <div class="bgm_btn_confirm bgm_wikibox_btn">创建条目</div>
    </div>
</div>
<div class="bgm_btn_show_infobox bgm_wikibox_btn">生成条目信息</div>
`;
    $("body").append(bgm_wikibox_tpl);
    GM_addStyle(`

    .bgm_wikibox {
     position: absolute;
     background-color: #f9f9f5;
     text-align: center;
     z-index: 99;
     width: 100%;
     top: 0;
    }
    .bgm_ui_box_wraper {
        width: 90%;
        left: 5%;
        position: relative;
    }
    .bgm_wikibox .bgm_ui_box {
        margin: 15px 0;
        border: 2px black;
        padding: 5px;
        border-style: solid;
        text-align: left;

    }

    .bgm_wikibox .bgm_ui_box input {
        font-size: 15px;
        font-weight: bold;
        padding: 5px 5px;
        line-height: 22px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        -moz-background-clip: padding;
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        background-color: #FFF;
        color: blue;
        border: 1px solid #d9d9d9;
        margin: 5px 0;
    }

    .bgm_wikibox .bgm_ui_box input::placeholder {
        font-weight: normal;
    }

    .bgm_wikibox .bgm_ui_box.checkBox p {
        margin: 5px 0
    }

    .bgm_wikibox_btn {
        /*position:  fixed;*/
        display: inline-block;
        padding: 10px;
        font-weight: bold;
        top: 50%;
        right: 0;
        z-index: 99;
        background: #9E9E9E;
        text-align: center;
        vertical-align: text-top;
        border-radius: 10px;
        color: #0321f4;
        cursor: pointer;
    }
    .bgm_btn_show_infobox{
        position: fixed;
        top: 50%;
        right: 3%
    }
    .hiden {
        display: none;
    }
    `)

    //获取某个元素内的input的数值并输出对应数组.box为该元素的jquery对象
    function getRelatedData(box) {
        let items = $(`${box}`).find('input');
        let arr = {};
        items.map(k => {
            arr[items[k].name] = null || (items[k].value.replace('，',','));
           // console.log(arr)
        });
        return arr
    }

    // var charaId, formhash, romaji, kana, nickname, chnName, CVId, CVName,userFormData,pageHost, anotherName, charaName, charaAvatarUrl, charaAvatarImage, charaInfo, infoTpl, infoTplDetail = '';
    // var subTypeArr = ['book', 'anime', 'music', 'game', 'unkown', 'real'];



    var wiki_usrset = localStorage.bgm_wikihelper_userSetting;
    if (wiki_usrset) {
        wiki_usrset = JSON.parse(wiki_usrset);
        let keys = Object.keys(wiki_usrset);
       // console.log(keys);
        keys.map((v, k) => {
           // console.log(k);
           // console.log(v);
            let items = Object.entries(wiki_usrset[keys[k]])
            items.map((v, k) => {
                if (v[1] === true || v[1] === false) {
                    console.log($(`#${v[0]}`))
                    $(`#${v[0]}`).prop('checked', v[1])
                } else {
                    $(`#${v[0]}`).prop('value', v[1])

                }
            })
        })
    } else {
        wiki_usrset = {};
    }
    $('.bgm_ui_box input').on('change', function() {
        if ($(this).attr('type') == "text") {
            try {
                wiki_usrset[$(this).attr('type')][$(this).attr('id')] = $(this).prop('value').replace('，',',')
            } catch (e) {
                console.log('err')
                wiki_usrset[$(this).attr('type')] = {};
            } finally {
                wiki_usrset[$(this).attr('type')][$(this).attr('id')] = $(this).prop('value').replace('，',',')
            }
        } else if ($(this).attr('type') == 'checkbox') {
            try {
                wiki_usrset[$(this).attr('type')][$(this).attr('id')] = $(this).prop('checked')
            } catch (e) {
                wiki_usrset[$(this).attr('type')] = {};
            } finally {
                wiki_usrset[$(this).attr('type')][$(this).attr('id')] = $(this).prop('checked')
            }
        } else {
            wiki_usrset[$(this).attr('type')] = {};
            wiki_usrset[$(this).attr('type')][$(this).attr('id')] = $(this).prop('checked')
        }
        localStorage.bgm_wikihelper_userSetting = JSON.stringify(wiki_usrset)
    })

    // var subRelatedSetting,CVRelatedSetting,charaType,charaKind,charaRole,checkDupe,debugFlg,editSub;

    $('.bgm_btn_show_infobox').on('click', function() {
        if ($('.bgm_ui_box_wraper').hasClass('hiden')) {
            $(this).text('隐藏生成栏')
            $('.bgm_ui_box_wraper').removeClass('hiden')
        } else {
            $(this).text('显示生成栏')
            $('.bgm_ui_box_wraper').addClass('hiden')

        }
    })



    $('.bgm_btn_confirm')[0].addEventListener('click', () => main(), false)



    async function main() {
        subRelatedSetting = getRelatedData('.bgm_ui_box_wraper #subRelatedSetting');
        CVRelatedSetting = getRelatedData('.bgm_ui_box_wraper #CVRelatedSetting');
        charaType = $('.bgm_ui_box_wraper #charaType').val();
        charaKind = $('.bgm_ui_box_wraper .personType input:checked').attr('value');
        charaRole = $('.bgm_ui_box_wraper #charaRole').val();
        checkDupe = $('.bgm_ui_box_wraper #checkDupe').prop('checked');
        debugFlg = $('.bgm_ui_box_wraper #debugFlg').prop('checked');
        editSubId = $('.bgm_ui_box_wraper #editSub').val();
        pageHost = window.location.host;
        //从wiki页面获取名字、个人简介（charaInfo）和infoTplDetal
        if (charaKind == 'chara') {
            await charaInfoFromWiki();
        } else {
            await cvInfoFromWiki();
        }
        infoTpl = `{{Infobox Crt\r\n|简体中文名=${null||chnName}\r\n|别名={\r\n${anotherName}\r\n[第二中文名|]\r\n[英文名|]\r\n[日文名|]\r\n[纯假名|${null||kana}]\r\n[罗马字|${null||romaji}]\r\n[昵称|${null||nickName}]\r\n[其他名义|]\r\n}\r\n${infoTplDetail}\r\n|引用来源=${pageHost}\r\n}}`.replace(/undefined/g, '');

        formhash = await getFormhash();
        await addSubject(charaKind, editSubId);
    }

})();