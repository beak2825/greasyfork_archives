
// ==UserScript==
// @name         remove ads lib
// @namespace    websiteEnhancement
// @version      2025.7.1
// @description  clear site ui
// @author       jim
// @include        /http[s]?\:\/\/([a-z\.]*\.)?[myjavbay|eporner|footfan|sis001|theporn|av6k|eqpp|bdsmx|vjav|soav|pornlulu|arival|avtb].*\..*/
// @exclude        *://*.doubleclick.*/*
// @exclude        *://*advertising*
// @exclude        *://*banner*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @license MIT
// ==/UserScript==


function init_remove_adds_component($, win = window) {
    if (win.___rmAdConf)
        return;

    win.___rmAdConf = new GM_config({
        id: 'GM_config_removeAds',
        title: 'Configurable Options Script',
        fields: {
            'conf': {
                'label': 'Search keys',
                'type': 'textarea',
                rows: 20,
                cols: 50,
                'default': `
    [
        {
            "matches": [
            "avtb"
            ],
            "selectors": [
            ".ads"
            ]
        },
        {
            "matches": ["wkgo"],
            "selectors": [
                "[id*=stickthread],.quote img,#f_pst,#ft",".bm.bml.pbn",".t_f br,.t_f .jammer",".ad",".pl > :nth-child(n+4)",".pl span:hidden","[id*=normalthread]:contains(AI)","[id*=normalthread]:contains(ai)","[id*=normalthread]:contains(馬賽克)","[id*=normalthread]:contains(ＡＩ)","[id*=normalthread]:contains(去码)","[id*=normalthread]:contains(马克赛)","[id*=normalthread]:contains(马赛克)"
            ]
        },
        {
            "matches": ["sexinsex"],
            "selectors": [
                "div:has(h1:contains('请关闭广告屏蔽插件以支持我们的网站'))"
            ]
        },
        {
            "matches": ["javdb"],
            "selectors": [
                ".top-meta",".video-detail>:nth-child(n+5)"
            ]
        },
        {
            "matches": ["javbus"],
            "selectors": [
                ".ad-box",".mb20:nth-child(n+3)",".row:not(.genre-box):nth-child(n+3)"
            ]
        }
    ]`
            },
        },
    });

    let w = 40, h = 40;
    addStyle(`                  
                    .btn1   {   
                        opacity:0.8;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;
                        padding:1px; margin-top:1px;
                        font-size: 10; text-align: center; vertical-align: middle; line-height:${h}px;
                        border-radius:5px 5px 5px 5px;cursor:pointer; left:0px;z-index:9999;
                        background: white;  
                        width:${w}px;height:${h}px;
                    }
                `);
    let container = $(document.createElement('div')).css({
        'cssText': `position:fixed;top:15%;width:${w}px;height:${h * 7}px;right:5px;z-index:9999`
    });
    //最顶按钮
    let toTopBtn = $(document.createElement('div')).text('Top');
    toTopBtn.click(function () {
        win.scrollTo(0, 0);
    });
    container.append(toTopBtn);

    //最低按钮
    let toBottomBtn = $(document.createElement('div')).text('Bottom');;
    container.append(toBottomBtn);
    toBottomBtn.click(function () {
        win.scrollTo(0, document.body.scrollHeight);
    });


    let fastBtn = $(document.createElement('div')).text('設置')
    container.append(fastBtn)

    container.find('div')
        .addClass('btn1')
        .hover(function (e) {
            let o = $(this)
            o.data('old_opacity', o.css('opacity'))
                .data('old_border', o.css('border'))
            o.css('opacity', 1).css('border', '1px solid black')
        }, function (e) {
            let o = $(this)
            o.css('opacity', o.data('old_opacity')).css('border', o.data('old_border'))
        })


    fastBtn.click(function () {
        win.___rmAdConf.open();
    });

    $(document).keydown(function (event) {
        let e = event || win.event;
        let k = e.keyCode || e.which;
        if (k === 16) {
            //  isCtrl = true;
            // middleBtn.click()
        } else if (k === 38) {  //up
            event.stopPropagation()
            // slowBtn.click()

        } else if (k === 40) {//down
            event.stopPropagation()
            //fastBtn.click()
        }
    })

    container.appendTo('body');
}
async function remove_adds($, win = window) {
    if (win.self !== win.top) {
        return;
    } // end execution if in a frame
    init_remove_adds_component($, win)

    let list = [
        {
            "matches": ["avtb"],
            "selectors": [".ads"]
        },
        {
            "matches": ["sexinsex"],
            "selectors": ["#header", ".ad_text"]
        },
        {
            "matches": ["arival", "pornlulu"],
            "selectors": [
                "div.row.no-gutters", "#top-ads", "#bottom-ads", ".ima-ad-container",
                "#myplayer_ima-ad-container", 'div[style*="text-align:center"]'
            ]
        },
        {
            "matches": ["myjavbay"],
            "selectors": ["#custom_html-12", "#custom_html-18", "#custom_html-19", "#custom_html-2"]
        },
        {
            "matches": ["eporner"],
            "selectors": ["#movieplayer-box-adv"]
        },
        {
            "matches": ["footfan"],
            "selectors": ["#sticky-banner-4672820", ".da", ".form-group.dvplay > div:eq(1)"]
        },
        {
            "matches": ["sis001"],
            "selectors": ["#ad_headerbanner", ".ad_text", ".portalbox", "#header"]
        },
        {
            "matches": ["av6k"],
            "selectors": [
                "div.frameC > a", "div.frame > a", "#app", "table.links-top2", ".video-img", ".subLink",
                ".newVideoC>div>a[target='_blank'],p,font,b,.h_30", ".clickadu", ".footlink", ".clickadu"
            ],
            "run": () => {
                $("#header").css({ "padding-top": "0px", "padding-bottom": "0px" })
                $(".menu").css({ "padding-top": "0px", "padding-bottom": "0px" })
            }
        },
        {
            "matches": ["theporn"],
            "selectors": ["div.c199d26a", ".float-right.right-player-container.col-2"],
            "run": () => {
                $(".q-responsive").parent().parent().parent().remove()
                setTimeout(function () {
                    $("#gbcs").trigger("click")
                    $(".close").trigger("click")
                    $(".block").trigger("click")
                    remove("#__ds_dp", "#domain_change_dialog")
                }, 3000)
            }
        },
        {
            "matches": ["eqpp"],
            "selectors": ["#sticky-banner-4672820", ".da", ".form-group.dvplay > div:eq(1)"]
        },
        {
            "matches": ["bdsmx"],
            "selectors": [".right", "section:contains(Advertisement)"]
        },
        {
            "matches": ["vjav"],
            "selectors": [
                ".hdyythvtvviieietth", ".vydththeeyy", "section:contains(Advertisement)",
                ".sinieieyyii", ".eniimeymsywwywyiie", ".iyinsiieieyyii", ".video-page__content>*:not(.left)",
                ".left>*:not(.video-page__player,.video-page__underplayer)"
            ]
        },
        {
            "matches": ["soav"],
            "selectors": ['.ad.noadmo']
        },
        {
            "matches": ["wkgo"],
            "selectors": [

            ],
            "run": () => {
                $("img").removeAttr('width').removeAttr('height')
                $('#wp').css({ width: '100%' })
            }
        }
    ]

    let remove = function (...selectors) {
        let adItems = $(selectors.join(","))
        console.log("removed->", adItems.length, selectors.join(","))
        adItems.remove()

    }
    let removeListAds = async function () {

        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(win.___rmAdConf.get('conf', '[]')) }, 50)
        })
            .then(r => {
                try {
                    return JSON.parse(r)
                } catch (error) {
                    console.log('config value:', r, 'Error:', error)
                    return []
                }
            })
            .then(listconf => listconf.concat(list))
            .then(alllist => {
                for (let i = alllist.length; i > 0; i--) {
                    let li = alllist[i - 1]
                    if (!li) {
                        console.log(`item is null, index:`, i)
                        continue;
                    }
                    if (!li.matches || li.matches.length == 0) {
                        console.log(`matches.length must great then 0, index:`, i, 'config:', JSON.stringify(li))
                        continue;
                    }
                    for (let j = li.matches.length; j > 0; j--) {

                        if (win.location.href.indexOf(li.matches[j - 1]) > -1) {
                            remove(...li.selectors)
                            if (li.run) {
                                let type = typeof li.run
                                switch (type) {
                                    case 'function':
                                        li.run()
                                    case 'string':
                                        {
                                            try {
                                                let f = eval(li.run)
                                                f()
                                            } catch (error) {
                                                console.log('parse function li.run err,', error, 'config:', li.run)
                                            }
                                        }
                                }
                            }
                        }
                    }

                }
            })
            .catch(error => console.log('config err:', error))
    }

    // Options for the observer (which mutations to observe)
    let config = {
        childList: true, // 监视node直接子节点的变动
        subtree: true, // 监视node所有后代的变动
        attributes: true, // 监视node属性的变动
        characterData: false, // 监视指定目标节点或子节点树中节点所包含的字符数据的变化。
        attributeOldValue: false // 记录任何有改动的属性的旧值
    };
    // Callback function to execute when mutations are observed
    let callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type == 'childList') {
                for (var node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (node.tagName == 'IFRAME') {
                        // $(node).remove()
                        // console.log("mutation remove->", "iframe")
                    }
                    if (node.tagName == 'DIV') {
                        removeListAds()
                    }
                }

            } else if (mutation.type == 'attributes') {
                // if (mutation.target.tagName == "DIV" && mutation.target.innerText && mutation.target.innerText != '') {
                //     console.log("mutation attributes->", mutation.target.innerText)
                //     if (mutation.target.innerText.indexOf('Skip') > -1)
                //         mutation.target.click()
                // }

            }
        }


    };
    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);

    // Select the node that will be observed for mutations
    let targetNode = document.body;
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // (new MutationObserver((mlist, obs) => { })).observe(document.body, {
    //     childList: true, // 监视node直接子节点的变动
    //     subtree: true, // 监视node所有后代的变动
    //     attributes: true, // 监视node属性的变动
    //     characterData: false, // 监视指定目标节点或子节点树中节点所包含的字符数据的变化。
    //     attributeOldValue: false // 记录任何有改动的属性的旧值
    // })

    if(!win.___added_remove_event){
        $(document).ready(function () {

            remove("[opacity='0']", "[display='block']")
            //remove("iframe")
            //console.log("document ready remove->", "iframe")
            removeListAds()
        })
        win.___added_remove_event=true
    }


    // Put all your code in your document ready area

    // Your code here...
    return await removeListAds()
} 
