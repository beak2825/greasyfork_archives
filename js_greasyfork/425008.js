// ==UserScript==
// @name         房企工具测试工具1
// @namespace    https://yun.kujiale.com/
// @version      0.8
// @author       huihui
// @match        *.kujiale.com/pub/tool/yundesign/index*
// @match        *.kujiale.com/tool/h5/diy*
// @match        *.kujiale.com/cloud/tool/h5/diy*
// @match        *.kujiale.com/cloud/tool/h5/bim*
// @match        *.kujiale.com/tool/h5/bim*
// @match        local.kujiale.com:7000/vc/flash/diy*
// @match        local.kujiale.com:7000/cloud/tool/h5/bim*
// @match        *.kujiale.com/cloud/tool/h5/bim*
// @match        *.kujiale.com/pcenter/design/*/list*
// @match        *.feat.qunhequnhe.com/*
// @run-at       document-start
// @grant        none
// @description 房企工具线测试工具
// @downloadURL https://update.greasyfork.org/scripts/425008/%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B71.user.js
// @updateURL https://update.greasyfork.org/scripts/425008/%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B71.meta.js
// ==/UserScript==
// 0.1 第一个版本
// 0.2 更新了 g_dmpConfig_userDefined
// 0.3 支持了 beta 及外网数据配置单
// 0.4 支持门窗数据传递
// 0.5 门窗逻辑导致快搭应用丢失数据问题修复
// 0.6 支持数组类型的数据结构
// 0.7 门窗配置挪到 pub 配置中去 & 门窗配置优化
// 0.8 自定义数据默认值更新 &  去掉 beta 逻辑
(function () {
      "use strict";
      // 开启 MDMode，这样在 window 上 postMessage 才有用
      window.__enableKuaidaMDMode = true;
      const betaHosts = ['yun-beta.kujiale.com', 'beta.kujiale.com'];
      const isBeta = betaHosts.includes(window.location.host);

      // 用户自定义配置单信息，可以将这块内容改成自己想要的形式
      const sitUserDefined = {
        "4": {
            "id": 1,
            "furnitureIds": [
                {
                    "obsBrandGoodId": "3FO4K1IIPTCJ",
                    "virtual": true
                },
                {
                    "obsBrandGoodId": "3FO4GHJPE780",
                    "virtual": false
                }
            ],
            "completeDecorationDataId": {
                "faceTypeToDataId": {
                    "0": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T7JTV"
                        ]
                    },
                    "1": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T7N6W"
                        ]
                    },
                    "2": {
                        "obsBrandGoodIds": []
                    },
                    "3": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TQ06E"
                        ]
                    },
                    "4": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TPVTD"
                        ]
                    },
                    "5": {
                        "obsBrandGoodIds": []
                    },
                    "6": {
                        "obsBrandGoodIds": []
                    },
                    "7": {
                        "obsBrandGoodIds": []
                    }
                }
            },
            "completeCustomData": {
                "models": [
                    {
                        "obsBrandGoodId": "3FO4GHJKYISQ",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    }
                ]
            },
            "pipeFurnitureIds": [
                "3FO4GG0R0QVA",
                "3FO4GG0R43WA",
                "3FO4GG0QXGML",
                "3FO4GG0R40K9",
                "3FO4GG0R4DXD",
                "3FO4GG0QXU0P",
                "3FO4GG0R4KMF",
                "3FO4GG0QXQNO",
                "3FO4GG0R0K78",
                "3FO4GG0QXNBN",
                "3FO4GHIR784H",
                "3FO4GHIR7LHL"
            ],
            "paramCeilingIds": [
                "3FO4GG4U4O1B",
                "3FO4GG4U2UHR",
                "3FO4GG4U4UPD"
            ]
        },
        "7": {
            "id": 4,
            "furnitureIds": [
                {
                    "obsBrandGoodId": "3FO4JHH4BE0K",
                    "virtual": true
                },
                {
                    "obsBrandGoodId": "3FO4K1K5RKGP",
                    "virtual": true
                }
            ],
            "completeDecorationDataId": {
                "faceTypeToDataId": {
                    "0": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TOXE3"
                        ]
                    },
                    "1": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T8OY8"
                        ]
                    },
                    "2": {
                        "obsBrandGoodIds": [
                            "3FO4GH5NFLVE",
                            "3FO4GH8TQU9N"
                        ]
                    },
                    "3": {
                        "obsBrandGoodIds": []
                    },
                    "4": {
                        "obsBrandGoodIds": []
                    },
                    "5": {
                        "obsBrandGoodIds": []
                    },
                    "6": {
                        "obsBrandGoodIds": []
                    },
                    "7": {
                        "obsBrandGoodIds": []
                    }
                }
            },
            "completeCustomData": {
                "models": [
                    {
                        "obsBrandGoodId": "3FO4GHFFC8RA",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHFITBYS",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHFIT1XP",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDTXKLH",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDTXNXI",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH3HF2",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH6G2X",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH7154",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": [
                            "3FO4GHDW5NXJ"
                        ]
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH5V0R",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH229M",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH2IYR",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH08Q3",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": [
                            "3FO4GHFI2HER"
                        ]
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJGY6XR",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJH0221",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJHLMPH",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": [
                            "3FO4GHMQRVWN",
                            "3FO4GHMQQA36"
                        ]
                    },
                    {
                        "obsBrandGoodId": "3FO4GHI5MLFS",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHFERQNG",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJHE6W9",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": [
                            "3FO4GH8TQQWM"
                        ]
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJHTK8U",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJHT3IP",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJHPQHP",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHFFDR9Q",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHFFDKKO",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHFIT5AQ",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDUNP00",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDULS4F",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDULEQB",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDV388C",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDV4K1Q",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    }
                ],
                "countertop": {
                    "materialObsBrandGoodId": "3FO4GHHY2N81",
                    "frontFenderProfileObsBrandGoodId": "3FO4GHHC75D3",
                    "backFenderProfileObsBrandGoodId": "3FO4GHHC7FE6"
                },
                "crownMolding": {
                    "profileObsBrandGoodId": "3FO4GHHC7212",
                    "materialObsBrandGoodId": "3FO4GHNCIH4N"
                },
                "skirting": {
                    "profileObsBrandGoodId": "3FO4GHHC6UC0",
                    "materialObsBrandGoodId": "3FO4GHJ7V2IM"
                }
            },
            "pipeFurnitureIds": [
                "3FO4GG0GG8JR",
                "3FO4GG0GFNHL",
                "3FO4GG0GDTY2",
                "3FO4GG0GEID9",
                "3FO4GG0GFU6N",
                "3FO4GG0GEF18",
                "3FO4GH8TR8MR"
            ],
            "paramCeilingIds": []
        },
        "8": {
            "id": 3,
            "furnitureIds": [
                {
                    "obsBrandGoodId": "3FO4K1K6T9FO",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4G937IXAE",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4GG0P2Q6X",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4GHMRILDC",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4G937IGK9",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4G937IN9B",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4G937IQLC",
                    "virtual": false
                }
            ],
            "completeDecorationDataId": {
                "faceTypeToDataId": {
                    "0": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TOXE3"
                        ]
                    },
                    "1": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T8IA6"
                        ]
                    },
                    "2": {
                        "obsBrandGoodIds": [
                            "3FO4GH5NFLVE",
                            "3FO4GH8TQU9N"
                        ]
                    },
                    "3": {
                        "obsBrandGoodIds": []
                    },
                    "4": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TPVTD"
                        ]
                    },
                    "5": {
                        "obsBrandGoodIds": []
                    },
                    "6": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TQNKL"
                        ]
                    },
                    "7": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TQNKL"
                        ]
                    }
                }
            },
            "completeCustomData": {
                "models": [
                    {
                        "obsBrandGoodId": "3FO4GHDOJF4W",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GGV00BGS",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDO0VGD",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHDNXYKS",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GGV01XBA",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GGSPORPP",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": [
                            "3FO4GHDW4PI9",
                            "3FO4GHDW4IT7"
                        ]
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJIWV2B",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHJL03UW",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    }
                ],
                "countertop": {
                    "materialObsBrandGoodId": "3FO4GHHY2N81",
                    "frontFenderProfileObsBrandGoodId": "3FO4GHHC6XO1",
                    "backFenderProfileObsBrandGoodId": "3FO4GHHC78P4"
                }
            },
            "pipeFurnitureIds": [
                "3FO4GG0P3RY9",
                "3FO4GG0QYF2V",
                "3FO4GG0R0K78",
                "3FO4GG0GFA4H",
                "3FO4GG0GF03E",
                "3FO4GG0GG1UP",
                "3FO4GG0GFQTM",
                "3FO4GG0GFXIO",
                "3FO4GHIR784H",
                "3FO4GH8TR8MR",
                "3FO4GHIR74RG"
            ],
            "paramCeilingIds": []
        },
        "10": {
            "id": 2,
            "furnitureIds": [
                {
                    "obsBrandGoodId": "3FO4K1IY3RKF",
                    "virtual": true
                },
                {
                    "obsBrandGoodId": "3FO4GHJPE780",
                    "virtual": false
                }
            ],
            "completeDecorationDataId": {
                "faceTypeToDataId": {
                    "0": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T7JTV"
                        ]
                    },
                    "1": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T7N6W"
                        ]
                    },
                    "2": {
                        "obsBrandGoodIds": []
                    },
                    "3": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TQ06E"
                        ]
                    },
                    "4": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TPVTD"
                        ]
                    },
                    "5": {
                        "obsBrandGoodIds": []
                    },
                    "6": {
                        "obsBrandGoodIds": []
                    },
                    "7": {
                        "obsBrandGoodIds": []
                    }
                }
            },
            "completeCustomData": {
                "models": []
            },
            "pipeFurnitureIds": [
                "3FO4GG0QXNBN",
                "3FO4GG0R0U8B",
                "3FO4GG0GFGSJ",
                "3FO4GHIR7LHL"
            ],
            "paramCeilingIds": [
                "3FO4GG4U2UHR",
                "3FO4GG4U4UPD",
                "3FO4GE0OH9FD"
            ]
        },
        "13": {
            "id": 5,
            "furnitureIds": [],
            "completeDecorationDataId": {
                "faceTypeToDataId": {
                    "0": {
                        "obsBrandGoodIds": []
                    },
                    "1": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TP1Q4"
                        ]
                    },
                    "2": {
                        "obsBrandGoodIds": []
                    },
                    "3": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TRBYS"
                        ]
                    },
                    "4": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TPVTD"
                        ]
                    },
                    "5": {
                        "obsBrandGoodIds": []
                    },
                    "6": {
                        "obsBrandGoodIds": []
                    },
                    "7": {
                        "obsBrandGoodIds": []
                    }
                }
            },
            "completeCustomData": {
                "models": [
                    {
                        "obsBrandGoodId": "3FO4GHDV1OPV",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GHI5S8PH",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    }
                ],
                "countertop": {
                    "materialObsBrandGoodId": "3FO4GHHY2N81",
                    "frontFenderProfileObsBrandGoodId": "3FO4GHHTSFEE",
                    "backFenderProfileObsBrandGoodId": "3FO4GHHW0IQG"
                }
            },
            "pipeFurnitureIds": [
                "3FO4GG0GEP2B",
                "3FO4GG0GCESM",
                "3FO4GG0GCBGL",
                "3FO4GHIR7LHL"
            ],
            "paramCeilingIds": [
                "3FO4GG4U4Y2E"
            ]
        },
        "22": {
            "id": 0,
            "furnitureIds": [
                {
                    "obsBrandGoodId": "3FO4K1JC2K15",
                    "virtual": true
                },
                {
                    "obsBrandGoodId": "3FO4K1ICEUFG",
                    "virtual": true
                },
                {
                    "obsBrandGoodId": "3FO4GHJG55H3",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4GG0P2Q6X",
                    "virtual": false
                },
                {
                    "obsBrandGoodId": "3FO4GHJPE780",
                    "virtual": false
                }
            ],
            "completeDecorationDataId": {
                "faceTypeToDataId": {
                    "0": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T7JTV"
                        ]
                    },
                    "1": {
                        "obsBrandGoodIds": [
                            "3FO4GH8T8OY8"
                        ]
                    },
                    "2": {
                        "obsBrandGoodIds": []
                    },
                    "3": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TQ06E"
                        ]
                    },
                    "4": {
                        "obsBrandGoodIds": [
                            "3FO4GH8TPVTD"
                        ]
                    },
                    "5": {
                        "obsBrandGoodIds": []
                    },
                    "6": {
                        "obsBrandGoodIds": []
                    },
                    "7": {
                        "obsBrandGoodIds": []
                    }
                }
            },
            "completeCustomData": {
                "models": [
                    {
                        "obsBrandGoodId": "3FO4GGUMLV86",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    },
                    {
                        "obsBrandGoodId": "3FO4GGUMGPNM",
                        "materialObsBrandGoodId": "3FO4GHN4EX3U",
                        "children": []
                    }
                ]
            },
            "pipeFurnitureIds": [
                "3FO4GHJ23PM4",
                "3FO4GHJ23SY5",
                "3FO4GG0R5J2P",
                "3FO4GG0R4ALC",
                "3FO4GG0R4DXD",
                "3FO4GG0R5PQR",
                "3FO4GHJ267JU",
                "3FO4GG0R40K9",
                "3FO4GG0R43WA",
                "3FO4GG0QYP3Y",
                "3FO4GG0QYSG0",
                "3FO4GG0QYVS1",
                "3FO4GG0R0QVA",
                "3FO4GG0R4KMF",
                "3FO4GHIR784H"
            ],
            "paramCeilingIds": [
                "3FO4GE0OH9FD",
                "3FO4GG4U2R5Q",
                "3FO4GG4U4UPD"
            ]
        }
    };
      window.g_dmpConfig_userDefined = sitUserDefined;

      let buttonCfgs = [];
      // 添加调整布局按钮的构造函数
      function addButton(buttonCfg) {
        const layoutButton = document.createElement("button");
        layoutButton.innerText = buttonCfg.text || "";
        const buttonStyle = {
              position: "fixed",
              background: "#1a7afb",
              borderRadius: "10px",
              border: "none",
              opacity: "80%",
              width: "80px",
              height: "60px",
              color: "white",
              top: "50px",
              right: "240px",
              zIndex: 1000,
              cursor: 'pointer',
              fontSize: "16px",
              ...(buttonCfg.style || {}),
        };
        Object.keys(buttonStyle).forEach(
              (key) => (layoutButton.style[key] = buttonStyle[key])
        );
        layoutButton.addEventListener("click", () => {
              console.log('正在引用配置： ', buttonCfg.configKey, window[buttonCfg.configKey]);
              console.log('门窗配置: ', window.g_dmpConfig_doorWindows);
              window.postMessage(
                  JSON.stringify({
                      action: "applyNewConfigForCustomDoorWindow",
                      payload: window.g_dmpConfig_doorWindows || {} // 门窗配置
                  }),
                  "*"
             );
             const parentKey = buttonCfg.parsedParentKey || 'materialMultiMap';
             const payload = {
                 designMaterialComplex: {
                     [parentKey]: window[buttonCfg.configKey] || {}
                 },
             };
             console.log('final payload: ', payload);
             window.postMessage(
                 JSON.stringify({
                     action: "startLayoutFurniture",
                     payload: payload,
                 }),
                 "*"
             );
        });
        document.body.appendChild(layoutButton);
  }
      // 获取统一的配置
      function reqListener() {
            const res = JSON.parse(this.responseText);
            if (res.c !== "0") {
                  return;
            }
            const allConfig = res.d;
            buttonCfgs = allConfig.buttonCfgs;
            // 根据配置添加按钮
            getBrandGoodInfo();
            useCurCfg();
            cmpCfg();
            buttonCfgs.forEach((cfg) => addButton(cfg));
            Object.keys(allConfig).forEach((key) => {
                  if (!key.includes("g_dmpConfig")) {
                        return;
                  }
                  window[key] = allConfig[key];
            });
      }
      const oReq = new XMLHttpRequest();
      const stage = isBeta ? 1 : 2;
      oReq.addEventListener("load", reqListener);
      oReq.open(
            "GET",
            `//pub-cps.kujiale.com/cps/api/client/config?name=config_mock_cfg&stage=${stage}`
      );
      oReq.send();
    // 0401
    var host = window.location.host
    const isBeta1 = (host.search("beta") != -1)
    const space = {
        4:"主卧",
        7:"厨房",
        8:"卫生间",
        10:"次卧",
        13:"阳台",
        22:"客餐厅",
    }

    const types = {
        0:"墙面",
        1:"地面",
        2:"顶棚",
        3:"踢脚线",
        4:"户内门槛",
        5:"柜体非见光区",
        6:"淋浴房站立区",
        7:"淋浴房排水区"
    }
    var Api = "https://" + (isBeta1 ? "beta.kujiale.com " : "sit.kujiale.com") + "/api/bbc/brandgood/listByCategory"

    function delelm(){
        var paras = document.getElementsByClassName('tabletestsn');
        if (paras){
            for(var i=0;i<paras.length;i++){
                //删除元素 元素.parentNode.removeChild(元素);
                if (paras[i] != null) paras[i].remove( paras[i]);
            }
        }
    }
    function getCatInfo(brandGoodIds, CatInfo){
        const request = new XMLHttpRequest();
        request.open("POST", Api, true);
        request.setRequestHeader('content-type', 'application/json');
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var responseText2 = JSON.parse(request.responseText)
                    return CatInfo(responseText2.d)
                }
            }
        }

        request.send(JSON.stringify(brandGoodIds));
    }

    function parseCatInfo(data) {
        let goodsInfo = new Map()
        Object.entries(data).forEach(
            ([key, value]) => {
                value.forEach(function (element, index, array) {
                    goodsInfo[element.obsBrandGoodId] = {"name" : element.category.name, "prodCatId" : element.category.prodCatId, "img" : element.previewImg};
                });
            }
        );
        return (goodsInfo)
    }

    function getFurnitureIds(type, data , flag){
        var datas = data[type].furnitureIds
        var furnitureIds = [];
        for (var k in datas){
            if (datas[k].virtual === flag) furnitureIds.push(datas[k].obsBrandGoodId)
        }
        return furnitureIds
    }

    function getCompleteDecorationDataId(type, data, num){
        var datas = data[type].completeDecorationDataId.faceTypeToDataId[num].obsBrandGoodIds
        return datas
    }

    function getPipeFurnitureIds(type, data){
        return data[type].pipeFurnitureIds
    }

    function getParamCeilingIds(type, data){
        return data[type].paramCeilingIds
    }

    function getcompleteCustomData(type, data){
        return data[type].completeCustomData
    }

    function createTable(data, id, top, left, space1){
        getCatInfo(data, function(responseText) {
            if (responseText){
                var data2 = parseCatInfo(responseText)
                var table = document.createElement('table');
                table.id = id
                //table.style.top = top
                //table.style.left = left
                if (space) {
                    var trx=document.createElement('tr');
                    var tdx=document.createElement('td');
                    trx.appendChild(tdx);
                    table.appendChild(trx);
                    trx.innerText = space[space1]
                }
                var tr=document.createElement('tr');
                for(var j=0;j<4;j++){
                    var td=document.createElement('td');
                    if (j == 0) td.innerText = "商品ID";
                    if (j == 1) td.innerText = "商品真分类";
                    if (j == 2) td.innerText = "真分类ID";
                    if (j == 3) td.innerText = "商品预览图";
                    tr.appendChild(td);
                }
                table.appendChild(tr);
                for(var k in data2){
                    //创建tr节点
                    var tr1=document.createElement('tr');
                    for(var j1=0;j1<4;j1++){
                        var td1=document.createElement('td');
                        if (j1 == 0) td1.innerText = k;
                        if (j1 == 1) td1.innerText = data2[k].name;
                        if (j1 == 2) td1.innerText = data2[k].prodCatId;
                        if (j1 == 3) {
                            let img = document.createElement('img');
                            img.src = data2[k].img
                            img.height = 100;
                            img.width=100
                            td1.append(img)
                        }
                        tr1.appendChild(td1);
                    }
                    table.appendChild(tr1);
                }
                let div1 = document.createElement('div');
                div1.id = "test123";
                div1.style.top = top;
                div1.style.left = left;
                div1.style.height = "450px";
                div1.style.overflow = "scroll";
                div1.setAttribute("class", "tabletestsn");
                Object.keys(tableStyle).forEach(
                    (key) => (div1.style[key] = tableStyle[key])
                );
                div1.append(table);
                document.body.append(div1);
                //document.body.appendChild(table);
            }
        });
    }

    function cpm1(type,data1,data2){
        getCatInfo(data1, function(responseText) {
            getCatInfo(data2, function(responseText2) {
                var a1 = parseCatInfo(responseText)
                var a2 = parseCatInfo(responseText2)
                let a3 = []
                for(var k1 in a1){
                    a3.push(a1[k1].name)
                }
                let a4 = []
                for(var k2 in a2){
                    a4.push(a2[k2].name)
                }
                let intersection = a3.filter(v => a4.includes(v))
                let difference1 = a3.concat(intersection).filter(v => !a3.includes(v) || !intersection.includes(v))
                let difference2 = a4.concat(intersection).filter(v => !a4.includes(v) || !intersection.includes(v))
                if (difference1.length>0) console.log("比模版多",difference1)
                if (difference2.length>0) console.log("比模版少",difference2)
            });
        });
    }

    function cpm2(data1,data2){
        getCatInfo(data1, function(responseText) {
            getCatInfo(data2, function(responseText2) {
                var a1 = parseCatInfo(responseText)
                var a2 = parseCatInfo(responseText2)
                let a3 = []
                for(var k1 in a1){
                    a3.push(a1[k1].name)
                }
                let a4 = []
                for(var k2 in a2){
                    a4.push(a2[k2].name)
                }
                let intersection = a3.filter(v => a4.includes(v))
                let difference1 = a3.concat(intersection).filter(v => !a3.includes(v) || !intersection.includes(v))
                let difference2 = a4.concat(intersection).filter(v => !a4.includes(v) || !intersection.includes(v))
                if (difference1.length>0) console.log("比模版多",difference1)
                if (difference2.length>0) console.log("比模版少",difference2)
            });
        });
    }

    const buttonStyle = {
        position: "fixed", //绝对定位
        left : "230px", //
        top : "120px",
        width: "160px",
        height: "30px",

        background: "#1890ff",//背景
        borderColor: "#1890ff", // 边框
        borderWidth: "2px",
        borderRadius: "10px",
        opacity: "80%", // 透明

        color: "white",

        zIndex: 1000,
        cursor: 'pointer', // 光标
        fontSize: "14px",
        outline: "none",
    };
    const inputStyle = {
        position: "fixed", //绝对定位
        width: "140px",
        height: "30px",
        left: "85px",
        top: "120px",
        background: "white",
        borderColor: "#1890ff", // 边框
        borderWidth: "2px",
        borderRadius: "10px",
        opacity: "80%", // 透明

        color: "#1890ff",
        zIndex: 1000,
        fontSize: "14px",
        outline: "none",
    };
    const tableStyle = {
        position: "fixed",
        zIndex: 1000,
        color: "#1890ff",
        border: 1
    };
    const selectStyle = {
        position: "fixed", //绝对定位
        left : "85px", //
        top : "210px",
        width : "140px",
        height : "28px",
        maxWidth : "300px",
        zIndex:10
    }

    var getBrandGoodInfo = function(){
        // 输入商品ID
        var inputBrandGood = document.createElement("input");
        inputBrandGood.type = "text";
        inputBrandGood.placeholder = "输入商品ID";
        Object.keys(inputStyle).forEach(
            (key) => (inputBrandGood.style[key] = inputStyle[key])
        );
        document.body.appendChild(inputBrandGood);

        // 确认
        const buttonModify = document.createElement("button");
        buttonModify.innerText = '获取真分类';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonModify.style[key] = buttonStyle[key])
        );
        document.body.appendChild(buttonModify);

        // 确认事件
        buttonModify.addEventListener("click", () => {
            var id1 = "getBrandGoodInfo"
            var delem = document.getElementById(id1)
            if (delem) delem.remove();
            if (inputBrandGood.value){
                let data = {"brandGoodIds":inputBrandGood.value.split(",")}
                createTable(data, id1, "120px", "400px");
            }
        })

        // 确认
        const buttonModify2 = document.createElement("button");
        buttonModify2.innerText = '重置';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonModify2.style[key] = buttonStyle[key])
        );
        buttonModify2.style.top = "75px"
        document.body.appendChild(buttonModify2);

        // 确认事件
        buttonModify2.addEventListener("click", () => {
            delelm();
        })
    }

    var useCurCfg = function(){
        // 配置全局变量
        var inputCfg = document.createElement("input");
        inputCfg.type = "text";
        inputCfg.id = "quanju1"
        inputCfg.placeholder = "window.g_dmpConfig_userDefined";
        Object.keys(inputStyle).forEach(
            (key) => (inputCfg.style[key] = inputStyle[key])
        );
        inputCfg.style.top = "165px";
        inputCfg.style.left = "85px";
        document.body.appendChild(inputCfg);

        var selectSpace = document.createElement("select");
        selectSpace.id = "select123";
        for(var s in space){
            selectSpace.options.add(new Option(space[s],s));
        }
        Object.keys(selectStyle).forEach(
            (key) => (selectSpace.style[key] = selectStyle[key])
        );
        document.body.appendChild(selectSpace);

        var selectTypes = document.createElement("select");
        selectTypes.id = "select234";
        for(var s1 in types){
            selectTypes.options.add(new Option(types[s1],s1));
        }
        Object.keys(selectStyle).forEach(
            (key) => (selectTypes.style[key] = selectStyle[key])
        );
        selectTypes.style.top = "345px";
        document.body.appendChild(selectTypes);

        // 获取软装虚拟模型
        const buttonGetCfg1 = document.createElement("button");
        buttonGetCfg1.innerText = '获取软装虚拟模型';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg1.style[key] = buttonStyle[key])
        )
        buttonGetCfg1.style.top = "165px";
        buttonGetCfg1.style.left = "230px";
        document.body.appendChild(buttonGetCfg1);

        // 确认事件
        buttonGetCfg1.addEventListener("click", () => {
            delelm();
            var top = 165
            let cfgData = window.g_dmpConfig_userDefined
            if (inputCfg.value) cfgData = eval(inputCfg.value);
            var curSpace1 = document.getElementById("select123").value
            var val = getFurnitureIds(curSpace1,cfgData,true);
            console.log(val)
            console.log(cfgData)
            createTable({"brandGoodIds":val},"getFurnitureIds-true_"+curSpace1,top+"px","400px",curSpace1);
            top += (val.length + 1) * 30
        })

        // 获取软装模型
        const buttonGetCfg2 = document.createElement("button");
        buttonGetCfg2.innerText = '获取软装模型';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg2.style[key] = buttonStyle[key])
        )
        buttonGetCfg2.style.top = "210px";
        buttonGetCfg2.style.left = "230px";
        document.body.appendChild(buttonGetCfg2);

        // 确认事件
        buttonGetCfg2.addEventListener("click", () => {
            delelm();
            var top = 165
            let cfgData = window.g_dmpConfig_userDefined
            if (inputCfg.value) cfgData = eval(inputCfg.value);
            var curSpace1 = document.getElementById("select123").value
            var val = getFurnitureIds(curSpace1,cfgData,false);
            createTable({"brandGoodIds":val},"getFurnitureIds-false_"+curSpace1,top+"px","400px",curSpace1);
            top += (val.length + 1) * 30
        })
        // 获取水电模型
        const buttonGetCfg3 = document.createElement("button");
        buttonGetCfg3.innerText = '获取水电模型';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg3.style[key] = buttonStyle[key])
        )
        buttonGetCfg3.style.top = "255px";
        buttonGetCfg3.style.left = "230px";
        document.body.appendChild(buttonGetCfg3);

        // 确认事件
        buttonGetCfg3.addEventListener("click", () => {
            delelm();
            var top = 165
            let cfgData = window.g_dmpConfig_userDefined
            if (inputCfg.value) cfgData = eval(inputCfg.value);
            var curSpace1 = document.getElementById("select123").value
            var val = getPipeFurnitureIds(curSpace1,cfgData);
            createTable({"brandGoodIds":val},"getPipeFurnitureIds_"+curSpace1,top+"px","400px",curSpace1);
            top += (val.length + 1) * 30
        })

        const buttonGetCfg4 = document.createElement("button");
        buttonGetCfg4.innerText = '获取吊顶模型';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg4.style[key] = buttonStyle[key])
        )
        buttonGetCfg4.style.top = "300px";
        buttonGetCfg4.style.left = "230px";
        document.body.appendChild(buttonGetCfg4);

        // 确认事件
        buttonGetCfg4.addEventListener("click", () => {
            delelm();
            var top = 165
            let cfgData = window.g_dmpConfig_userDefined
            if (inputCfg.value) cfgData = eval(inputCfg.value);
            var curSpace1 = document.getElementById("select123").value
            var val = getParamCeilingIds(curSpace1,cfgData);
            createTable({"brandGoodIds":val},"getParamCeilingIds"+curSpace1,top+"px","400px",curSpace1);
            top += (val.length + 1) * 30
        })

        const buttonGetCfg5 = document.createElement("button");
        buttonGetCfg5.innerText = '获取硬装模型';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg5.style[key] = buttonStyle[key])
        )
        buttonGetCfg5.style.top = "345px";
        buttonGetCfg5.style.left = "230px";
        document.body.appendChild(buttonGetCfg5);

        // 确认事件
        buttonGetCfg5.addEventListener("click", () => {
            delelm();
            var top = 165
            let cfgData = window.g_dmpConfig_userDefined
            if (inputCfg.value) cfgData = eval(inputCfg.value);
            var curSpace1 = document.getElementById("select123").value
            var curTypes1 = document.getElementById("select234").value
            var val = getCompleteDecorationDataId(curSpace1,cfgData,curTypes1);
            createTable({"brandGoodIds":val},"getCompleteDecorationDataId"+curSpace1+"_"+curTypes1,top+"px","400px",curSpace1);
            top += (val.length + 1) * 30
        })

        const buttonGetCfg6 = document.createElement("button");
        buttonGetCfg6.innerText = '获取定制数据';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg6.style[key] = buttonStyle[key])
        )
        buttonGetCfg6.style.top = "390px";
        buttonGetCfg6.style.left = "230px";
        document.body.appendChild(buttonGetCfg6);

        buttonGetCfg6.addEventListener("click", () => {
            delelm();
            let cfgData = window.g_dmpConfig_userDefined
            if (inputCfg.value) cfgData = eval(inputCfg.value);
            var curSpace1 = document.getElementById("select123").value
            var val = getcompleteCustomData(curSpace1,cfgData);
            let div = document.createElement('div')
            div.setAttribute("class", "tabletestsn");
            div.style.top = "165px";
            div.style.left = "400px";
            div.style.width = "400px";
            div.style.position = "fixed";
            div.style.zIndex = 1000;
            div.innerText = JSON.stringify(val)
            document.body.append(div)
        })
    }

    var cmpCfg = function(){
        const buttonGetCfg2 = document.createElement("button");
        buttonGetCfg2.innerText = '对比配置';
        Object.keys(buttonStyle).forEach(
            (key) => (buttonGetCfg2.style[key] = buttonStyle[key])
        )
        buttonGetCfg2.style.top = "435px";
        buttonGetCfg2.style.left = "85px";
        buttonGetCfg2.style.width = "306px";
        document.body.appendChild(buttonGetCfg2);

        buttonGetCfg2.addEventListener("click", () => {
            var ele = document.getElementById("quanju1")
            var resdata1 = eval(ele.value);
            for (var s2 in space){
                let data1 = getFurnitureIds(s2,sitUserDefined,true)
                let data2 = getFurnitureIds(s2,betaUserDefined,true)
                if (data1.length>0 && data2.length>0) cpm1(s2,{"brandGoodIds":data1},{"brandGoodIds":data2})
                else{
                    if (data1.length>0) console.log("比模版多",data1)
                    if (data2.length>0) console.log("比模版少",data2)
                }
                data1 = getPipeFurnitureIds(s2,sitUserDefined)
                data2 = getPipeFurnitureIds(s2,betaUserDefined)
                if (data1.length>0 && data2.length>0) cpm1(s2,{"brandGoodIds":data1},{"brandGoodIds":data2})
                else{
                    if (data1.length>0) console.log("比模版多",data1)
                    if (data2.length>0) console.log("比模版少",data2)
                }
                data1 = getcompleteCustomData(s2,sitUserDefined)
                data2 = getcompleteCustomData(s2,betaUserDefined)
                if (data1.length>0 && data2.length>0) cpm1(s2,{"brandGoodIds":data1},{"brandGoodIds":data2})
                else{
                    if (data1.length>0) console.log("比模版多",data1)
                    if (data2.length>0) console.log("比模版少",data2)
                }
                for(var i in types){
                    data1 = getCompleteDecorationDataId(s2,sitUserDefined,i)
                    data2 = getCompleteDecorationDataId(s2,betaUserDefined,i)
                    if (data1.length>0 && data2.length>0) cpm1(s2,{"brandGoodIds":data1},{"brandGoodIds":data2})
                    else{
                        if (data1.length>0) console.log("比模版多",data1)
                        if (data2.length>0) console.log("比模版少",data2)
                    }
                }
            }
        })
    }
})();
