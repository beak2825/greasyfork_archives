// ==UserScript==
// @name         房企工具测试工具2.0
// @namespace    https://yun.kujiale.com/
// @version      0.2
// @author       huihui
// @match        */cloud/tool/h5/bim*
// @match        *.kujiale.com/tool/h5/bim*
// @run-at       document-body
// @grant        none
// @description 房企工具线测试工具
// @downloadURL https://update.greasyfork.org/scripts/431689/%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B720.user.js
// @updateURL https://update.greasyfork.org/scripts/431689/%E6%88%BF%E4%BC%81%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B720.meta.js
// ==/UserScript==

// 0.1 第一个版本
// 0.2 支持配置
(function () {
    "use strict";
    // 开启 MDMode，这样在 window 上 postMessage 才有用
    window.__enableKuaidaMDMode = true;

    // 用户自定义配置单信息，可以将这块内容改成自己想要的形式
    const userDefinedCfg = {
        "materialMultiMap": {
            "4": [
                {
                    "id": 1,
                    "furnitureIds": [
                        {
                            "obsBrandGoodId": "3FO4K1IIPTCJ",
                            "virtual": true
                        },
                        {
                            "obsBrandGoodId": "3FO4GHJPE780",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GC1J62BL",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GBGAMTX5",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G91MSOBL",
                            "virtual": false
                        }
                    ],
                    "completeDecorationDataId": {
                        "faceTypeToDataId": {
                            "0": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MS0WE"
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "3": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91NHNKR"
                                    }
                                ]
                            },
                            "4": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GHJL1WEG",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GBKJSNCJ",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GBKJVSOH",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GBKJXFIY",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            }
                        ],
                        "windowBoard": {
                            "materialObsBrandGoodId": "3FO4G99S97BH",
                            "frontFenderProfileObsBrandGoodId": "3FO4GADRHFDN"
                        }
                    },
                    "pipeFurnitureIds": [
                        "3FO4GAKEAP74",
                        "3FO4GG0R0QVA",
                        "3FO4GG0R43WA",
                        "3FO4G8WNI4XG",
                        "3FO4G8WNIBMI",
                        "3FO4GG0R4DXD",
                        "3FO4GG0QXU0P",
                        "3FO4GG0R4KMF",
                        "3FO4GG0QXQNO",
                        "3FO4GG0R0K78",
                        "3FO4GG0QXNBN",
                        "3FO4GHJ8JXFR",
                        "3FO4GAJGKMWN",
                        "3FO4GG0QYP3Y",
                        "3FO4GAJGPIG4"
                    ],
                    "paramCeilingIds": [
                        "3FO4GG4U2R5Q",
                        "3FO4GG4U4UPD",
                        "3FO4GE0OH9FD",
                        "3FO4GG4U4KOA",
                        "3FO4GG4U4RDC"
                    ]
                }
            ],
            "7": [
                {
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
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPIYN",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MLIJG",
                                        "cutWidth": 800,
                                        "cutLength": 800
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GH5NFLVE"
                                    },
                                    {
                                        "obsBrandGoodId": "3FO4G8WQFWQ7"
                                    }
                                ]
                            },
                            "5": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS0NVK5"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GHFFC8RA",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHFITBYS",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHFIT1XP",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDTXKLH",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDTXNXI",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH6G2X",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH7154",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GHDW5NXJ"
                                ]
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH5V0R",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH3HF2",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH229M",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH2IYR",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH08Q3",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GHFI2HER"
                                ]
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJGY6XR",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJH0221",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJHLMPH",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GHMQRVWN",
                                    "3FO4GHMQQA36"
                                ]
                            },
                            {
                                "obsBrandGoodId": "3FO4GHI5MLFS",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHFERQNG",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GAJ0H6X5",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJHE6W9",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GH8TQQWM"
                                ]
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJHTK8U",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJHT3IP",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJHPQHP",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHFFDR9Q",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHFFDKKO",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHFIT5AQ",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDUNP00",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDULS4F",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDULEQB",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDV388C",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDV4K1Q",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4G90J6192",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            }
                        ],
                        "countertop": {
                            "frontFenderProfileObsBrandGoodId": "3FO4GHHC75D3",
                            "backFenderProfileObsBrandGoodId": "3FO4GHHC7FE6",
                            "materialObsBrandGoodId": "3FO4G99S97BH"
                        },
                        "crownMolding": {
                            "profileObsBrandGoodId": "3FO4GHHC7212",
                            "materialObsBrandGoodId": "3FO4GHI048TY"
                        },
                        "skirting": {
                            "profileObsBrandGoodId": "3FO4GHHC6UC0",
                            "materialObsBrandGoodId": "3FO4GHI048TY"
                        }
                    },
                    "pipeFurnitureIds": [
                        "3FO4GH8TR8MR",
                        "3FO4GAJG3TFM",
                        "3FO4GAJG4EHS",
                        "3FO4GBS8YBC0",
                        "3FO4G8WNK562",
                        "3FO4GG0GFNHL",
                        "3FO4GG0GDTY2",
                        "3FO4G8WNIEYJ"
                    ],
                    "paramCeilingIds": []
                }
            ],
            "8": [
                {
                    "id": 3,
                    "furnitureIds": [
                        {
                            "obsBrandGoodId": "3FO4GG0P2Q6X",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GHMRILDC",
                            "virtual": true
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
                            "obsBrandGoodId": "3FO4GC4C58H6",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GHIQSXCI",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G91MKA33",
                            "virtual": false
                        }
                    ],
                    "completeDecorationDataId": {
                        "faceTypeToDataId": {
                            "0": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GH8TOXE3",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MO769",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GH5NFLVE"
                                    },
                                    {
                                        "obsBrandGoodId": "3FO4G8WQFWQ7"
                                    }
                                ]
                            },
                            "4": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            },
                            "6": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            },
                            "7": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GGSPORPP",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GHDW4PI9",
                                    "3FO4GHDW4IT7"
                                ]
                            },
                            {
                                "obsBrandGoodId": "3FO4GB1ERQS1",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDOJF4W",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGV00BGS",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDO0VGD",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDNXYKS",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGV01XBA",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJIWV2B",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJL03UW",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            }
                        ],
                        "countertop": {
                            "frontFenderProfileObsBrandGoodId": "3FO4GHHC6XO1",
                            "backFenderProfileObsBrandGoodId": "3FO4GHHC78P4",
                            "materialObsBrandGoodId": "3FO4G99S97BH"
                        }
                    },
                    "pipeFurnitureIds": [
                        "3FO4G91NL0LR",
                        "3FO4GBGAV2HL",
                        "3FO4GADRIR72",
                        "3FO4GH8TR8MR",
                        "3FO4GAJG3TFM",
                        "3FO4GAJG4EHS",
                        "3FO4GBS8YBC0",
                        "3FO4GBS8Y7YY",
                        "3FO4GG0QYF2V",
                        "3FO4GG0R0K78",
                        "3FO4G8WNK562",
                        "3FO4G8WNI4XG",
                        "3FO4GG0QYP3Y"
                    ],
                    "paramCeilingIds": [],
                    "roomTypeName": "公卫"
                },
                {
                    "id": 6,
                    "furnitureIds": [
                        {
                            "obsBrandGoodId": "3FO4GG0P2Q6X",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GG0P2G5U",
                            "virtual": true
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
                            "obsBrandGoodId": "3FO4GHIQSXCI",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G91MKA33",
                            "virtual": false
                        }
                    ],
                    "completeDecorationDataId": {
                        "faceTypeToDataId": {
                            "0": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GH8TOXE3",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MO769",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GH5NFLVE"
                                    },
                                    {
                                        "obsBrandGoodId": "3FO4G8WQFWQ7"
                                    }
                                ]
                            },
                            "4": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            },
                            "6": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            },
                            "7": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GB1ERQS1",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDOJF4W",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGV00BGS",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDO0VGD",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDNXYKS",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGV01XBA",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGSPORPP",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GHDW4PI9",
                                    "3FO4GHDW4IT7"
                                ]
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJIWV2B",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJL2E4L",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            }
                        ],
                        "countertop": {
                            "frontFenderProfileObsBrandGoodId": "3FO4GHHC6XO1",
                            "backFenderProfileObsBrandGoodId": "3FO4GHHC78P4",
                            "materialObsBrandGoodId": "3FO4G99S97BH"
                        }
                    },
                    "pipeFurnitureIds": [
                        "3FO4GBS8YBC0",
                        "3FO4GBGAV2HL",
                        "3FO4GBS8Y7YY",
                        "3FO4G91NL0LR",
                        "3FO4GADRIR72",
                        "3FO4GH8TR8MR",
                        "3FO4GAJG3TFM",
                        "3FO4GAJG4EHS",
                        "3FO4GG0QYF2V",
                        "3FO4GG0R0K78",
                        "3FO4G8WNK562",
                        "3FO4G8WNI4XG",
                        "3FO4GG0QYP3Y"
                    ],
                    "paramCeilingIds": [],
                    "roomTypeName": "主卫"
                }
            ],
            "10": [
                {
                    "id": 2,
                    "furnitureIds": [
                        {
                            "obsBrandGoodId": "3FO4K1IY3RKF",
                            "virtual": true
                        },
                        {
                            "obsBrandGoodId": "3FO4GHJPE780",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GC1J62BL",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GBGAMTX5",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G91MSOBL",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GFXH20M9",
                            "virtual": false
                        }
                    ],
                    "completeDecorationDataId": {
                        "faceTypeToDataId": {
                            "0": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MS0WE"
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "3": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91NHNKR"
                                    }
                                ]
                            },
                            "4": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GHJL2E4L",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GBKJSNCJ",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GBKJVSOH",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GBKJXFIY",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            }
                        ],
                        "windowBoard": {
                            "materialObsBrandGoodId": "3FO4G99S8WAE",
                            "frontFenderProfileObsBrandGoodId": "3FO4GADRHFDN"
                        }
                    },
                    "pipeFurnitureIds": [
                        "3FO4GAKEAP74",
                        "3FO4GAJGPIG4",
                        "3FO4GG0R0U8B",
                        "3FO4G8WNIBMI",
                        "3FO4GG0QXQNO",
                        "3FO4GG0QYP3Y",
                        "3FO4GG0QXNBN",
                        "3FO4GAJGM333"
                    ],
                    "paramCeilingIds": [
                        "3FO4GG4U4UPD",
                        "3FO4GG4U52EF",
                        "3FO4GE0OH9FD",
                        "3FO4GG4U4KOA",
                        "3FO4GG4U4RDC"
                    ]
                }
            ],
            "13": [
                {
                    "id": 5,
                    "furnitureIds": [
                        {
                            "obsBrandGoodId": "3FO4II1JB3T3",
                            "virtual": true
                        },
                        {
                            "obsBrandGoodId": "3FO4GAJGQK8F",
                            "virtual": false
                        }
                    ],
                    "completeDecorationDataId": {
                        "faceTypeToDataId": {
                            "0": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MOH7C",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "3": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G90JP4YR",
                                        "cutWidth": 300,
                                        "cutLength": 600
                                    }
                                ]
                            },
                            "4": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GHDWRTO6",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHDV1OPV",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            }
                        ],
                        "countertop": {
                            "frontFenderProfileObsBrandGoodId": "3FO4GHHC75D3",
                            "backFenderProfileObsBrandGoodId": "3FO4GHHC7FE6",
                            "materialObsBrandGoodId": "3FO4G99S8PLC"
                        }
                    },
                    "pipeFurnitureIds": [
                        "3FO4GHIR7LHL",
                        "3FO4GBGAV2HL",
                        "3FO4GGSPPJGX",
                        "3FO4GBGAUY5K",
                        "3FO4G8WNIEYJ"
                    ],
                    "paramCeilingIds": [
                        "3FO4GG4U4Y2E"
                    ]
                }
            ],
            "22": [
                {
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
                            "obsBrandGoodId": "3FO4GHJPE780",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GC1J62BL",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GBGAMTX5",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4GG0R5J2P",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G8WL77U9",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G8WNI8AH",
                            "virtual": false
                        },
                        {
                            "obsBrandGoodId": "3FO4G91MSOBL",
                            "virtual": false
                        }
                    ],
                    "completeDecorationDataId": {
                        "faceTypeToDataId": {
                            "0": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "1": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MLIJG",
                                        "cutWidth": 800,
                                        "cutLength": 800
                                    }
                                ]
                            },
                            "2": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4GBS90338"
                                    }
                                ]
                            },
                            "3": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91NHNKR"
                                    }
                                ]
                            },
                            "4": {
                                "obsPavingData": [
                                    {
                                        "obsBrandGoodId": "3FO4G91MPWCR"
                                    }
                                ]
                            }
                        }
                    },
                    "completeCustomData": {
                        "countertop": {
                            "frontFenderProfileObsBrandGoodId": "3FO4GHHC6XO1",
                            "backFenderProfileObsBrandGoodId": "3FO4GHHC78P4",
                            "materialObsBrandGoodId": "3FO4G99S97BH"
                        },
                        "models": [
                            {
                                "obsBrandGoodId": "3FO4GC2IRP4Y",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGUMGPNM",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJL2E4L",
                                "materialObsBrandGoodId": "3FO4GHNCIAFL",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GHJIWV2B",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": []
                            },
                            {
                                "obsBrandGoodId": "3FO4GGSPORPP",
                                "materialObsBrandGoodId": "3FO4GHI048TY",
                                "children": [
                                    "3FO4GHDW4PI9",
                                    "3FO4GHDW4IT7"
                                ]
                            }
                        ]
                    },
                    "pipeFurnitureIds": [
                        "3FO4GHJ23PM4",
                        "3FO4GHJ23SY5",
                        "3FO4GAKEAP74",
                        "3FO4GG0R4ALC",
                        "3FO4GG0R4DXD",
                        "3FO4GAJGKMWN",
                        "3FO4GFXGXGW7",
                        "3FO4G8WNIBMI",
                        "3FO4GG0R43WA",
                        "3FO4GG0QYP3Y",
                        "3FO4GG0QYSG0",
                        "3FO4GG0QYVS1",
                        "3FO4GG0R4KMF",
                        "3FO4G8WNI4XG",
                        "3FO4GAJGPIG4",
                        "3FO4GFXH1PL6",
                        "3FO4GHJ8JXFR",
                        "3FO4GAJG3TFM",
                        "3FO4GAJG4EHS"
                    ],
                    "paramCeilingIds": [
                        "3FO4GE0OH9FD",
                        "3FO4GG4U4O1B",
                        "3FO4GG4U4UPD",
                        "3FO4GG4U4KOA",
                        "3FO4GG4U4RDC"
                    ]
                }
            ]
        },
        "socketsOfLivingRoom": []
    };
    const defaultButtonCfgs = [
        {
            "text": "layout",
            "action": "ad-layout-preset",
            "configKey": "g_dmpConfig_userDefined",
            "parsedParentKey": "materialMultiMap",
            "style": {
                "top": "10px"
            }
        },
        {
            "text": "whole",
            "action": "ad-whole-layout",
            "configKey": "g_dmpConfig_userDefined",
            "parsedParentKey": "materialMultiMap",
            "style": {
                "top": "80px"
            }
        }
    ]
    window.g_dmpConfig_userDefined = userDefinedCfg;

    function log() {
        const messages = Array.prototype.slice.call(arguments);
        console.log(...["%c房产插件log：", "color: yellow; background-color: blue; padding: 2px"].concat(messages));
    }
    // 添加调整布局按钮的构造函数
    function addButton(buttonCfg) {
      const layoutButton = document.createElement("button");
      layoutButton.innerText = buttonCfg.text || "";
      const buttonStyle = {
            position: "fixed",
            background: "linear-gradient(120deg, rgba(212, 252, 121, 0.5) 0%, rgba(150, 230, 161, 0.5) 100%)",
            borderRadius: "10px",
            border: "none",
            width: "80px",
            height: "60px",
            color: "#e7563b",
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
            const action = buttonCfg.action || "ad-whole-layout";
            let designMaterialComplex = window[buttonCfg.configKey] || {};
            const payload = { designMaterialComplex };
            log('used configKey: ', buttonCfg.configKey);
            log('final action: ', action);
            log('final payload: ', payload);
            window.postMessage(
               JSON.stringify({
                   action: action,
                   payload: payload,
               }),
               "*"
           );
      });
      document.body.appendChild(layoutButton);
    }

    function addButtons(buttonCfgs) {
        // 根据配置添加按钮
        buttonCfgs.forEach((cfg) => addButton(cfg));
    }
    // 获取统一的配置
    function reqListener() {
        const res = JSON.parse(this.responseText);
        if (res.c !== "0") {
            return;
        }
        const allConfig = res.d;
        Object.keys(allConfig).forEach((key) => {
            if (!key.includes("g_dmpConfig")) {
                    return;
            }
            window[key] = allConfig[key];
        });
        addButtons(allConfig.buttonCfgs);
    };
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.addEventListener("error", () => {
        log('请求动态配置失败，使用本地配置: ');
        addButtons(defaultButtonCfgs);
    });
    oReq.open(
          "GET",
          "//pub-cps.kujiale.com/cps/api/client/config?name=tempermonkey_cfg_2&stage=2"
    );
    oReq.send();
})();
