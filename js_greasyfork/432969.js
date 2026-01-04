// ==UserScript==
// @name         官种保种统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432969
// @version      0.16.9
// @license      GPL-3.0 License
// @description  Count the seeding torrents, support Audiences, PTer, SKY, OB, CHD, Hares, PTH, hddolby, tjupt, TTG, HDH, SSD, HDC, PtSbao, btschool, TLF, beAst
// @author       ccf2012
// @source       https://github.com/ccf-2012/torsummary
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://audiences.me/userdetails.php?id=*
// @match        https://hdsky.me/userdetails.php?id=*
// @match        https://ourbits.club/userdetails.php?id=*
// @match        https://chdbits.co/userdetails.php?id=*
// @match        https://ptchdbits.co/userdetails.php?id=*
// @match        https://club.hares.top/userdetails.php?id=*
// @match        https://*.pthome.net/userdetails.php?id=*
// @match        https://*.hddolby.com/userdetails.php?id=*
// @match        https://*.tjupt.org/userdetails.php?id=*
// @match        https://totheglory.im/userdetails.php?id=*
// @match        https://hdhome.org/userdetails.php?id=*
// @match        https://hdchina.org/userdetails.php?id=*
// @match        https://springsunday.net/userdetails.php?id=*
// @match        https://springsunday.net/torrents.php?*&my=seeding&*
// @match        https://pterclub.com/userdetails.php?id=*
// @match        https://pterclub.com/getusertorrentlist.php?*&type=seeding*
// @match        https://ptsbao.club/userdetails.php?id=*
// @match        https://*.btschool.club/userdetails.php?id=*
// @match        https://*.hd4fans.org/userdetails.php?id=*
// @match        https://*.eastgame.org/userdetails.php?id=*
// @match        https://hhanclub.top/userdetails.php?id=*
// @match        https://leaves.red/userdetails.php?id=*
// @icon         https://ourbits.club//favicon.ico
// @grant        GM_addElement
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432969/%E5%AE%98%E7%A7%8D%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/432969/%E5%AE%98%E7%A7%8D%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

var config = [
    {
      host: "audiences.me",
      abbrev: "Audiences",
      seedList: '#ka1 > table[width="100%"] > tbody > tr > td:nth-child(2) > a',
      seedListSize: '#ka1 >  table[width="100%"] > tbody > tr > td:nth-child(3)',
      seedListSeederCount: '#ka1 > table[width="100%"] > tbody > tr > td:nth-child(4)',
      seedingSummary: "#ka1 > b",
      uploadSummary: "#ka ",
      uploadDateCol: "td:nth-child(8)",
      uploadSizeCol: "td:nth-child(3)",
      siteRegex: /[@-]\s?(Audies|ADE|ADWeb|ADAudio|ADeBook|ADMusic)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'Audies',
          groupRegex : /[@-]\s?(Audies)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ADE',
          groupRegex: /[@-]\s?(ADE)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ADWeb',
          groupRegex: /[@-]\s?(ADWeb)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ADAudio',
          groupRegex: /[@-]\s?(ADAudio)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ADeBook',
          groupRegex: /[@-]\s?(ADeBook)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ADMusic',
          groupRegex: /[@-]\s?(ADMusic)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],    useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host : "hdsky.me",
      abbrev: "SKY",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(HDS)/i,
      seederLevels: [
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
      groups: [
        {
          groupName: 'HDSky',
          groupRegex : /[@-]\s?(HDSky)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDS',
          groupRegex : /[@-]\s?(HDS)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDSWEB',
          groupRegex: /[@-]\s?(HDSWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDSTV',
          groupRegex: /[@-]\s?(HDSTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDSPad',
          groupRegex: /[@-]\s?(HDSPad)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Others',
          groupRegex: /[@-]\s?(HDS)\w./i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "pterclub.com",
      abbrev: "PTer",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a:nth-child(1)",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(5)",
      seedingSummary: "#ka1",
      siteRegex: /[@-]\s?(PTer)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
      groups: [
        {
          groupName: 'PTer',
          groupRegex : /[@-]\s?(PTer)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTerWEB',
          groupRegex: /[@-]\s?(PTerWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTerMV',
          groupRegex: /[@-]\s?(PTerMV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTerTV',
          groupRegex: /[@-]\s?(PTerTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: '游戏',
          groupRegex: /game.php\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "ourbits.club",
      abbrev: "OB",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(Our|PbK|iLoveTV|FLTTH|Ao|MGs|HosT|iLoveHD)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'OurBits',
          groupRegex : /[@-]\s?(OurBits)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'OurTV',
          groupRegex: /[@-]\s?(OurTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'FLTTH',
          groupRegex: /[@-]\s?(FLTTH)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Ao',
          groupRegex: /[@-]\s?(Ao)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PbK',
          groupRegex: /[@-]\s?(PbK)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'MGs',
          groupRegex: /[@-]\s?(PbK)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'iLoveTV',
          groupRegex: /[@-]\s?(iLoveTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'iLoveHD',
          groupRegex: /[@-]\s?(iLoveHD)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "chdbits.co",
      abbrev: "CHD",
      seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      uploadSummary: "#ka ",
      uploadDateCol: "td:nth-child(4) > span",
      uploadSizeCol: "td:nth-child(3)",
      siteRegex: /[@-]\s?(CHD|blucook|HQC|GBT|KAN|OneHD)/i,
      seederLevels: [
        {seederNum: 2, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 4, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
      groups: [
        {
          groupName: 'CHD',
          groupRegex : /[@-]\s?(CHD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CHDBits',
          groupRegex: /[@-]\s?(CHDBits)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CHDTV',
          groupRegex: /[@-]\s?(CHDTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CHDPAD',
          groupRegex: /[@-]\s?(CHDPAD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CHDWEB',
          groupRegex: /[@-]\s?(CHDWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CHDHKTV',
          groupRegex: /[@-]\s?(CHDHKTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'StBOX',
          groupRegex: /[@-]\s?(StBOX)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'OneHD',
          groupRegex: /[@-]\s?(OneHD)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],    useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "club.hares.top",
      abbrev: "Hares",
      seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(Hares)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'Hares',
          groupRegex : /[@-]\s?(Hares)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HaresWEB',
          groupRegex: /[@-]\s?(HaresWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HaresTV',
          groupRegex: /[@-]\s?(HaresTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "pthome.net",
      abbrev: "PTH",
      seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(PTH)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'PTHome',
          groupRegex : /[@-]\s?(PTHome)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTH',
          groupRegex: /[@-]\s?(PTH)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTHweb',
          groupRegex: /[@-]\s?(PTHweb)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTHtv',
          groupRegex: /[@-]\s?(PTHtv)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTHeBook',
          groupRegex: /[@-]\s?(PTHeBook)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTHAudio',
          groupRegex: /[@-]\s?(PTHAudio)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'PTHmusic',
          groupRegex: /[@-]\s?(PTHmusic)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],    useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "springsunday.net",
      abbrev: "SSD",
      seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > div > a",
      seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(CMCT|Oldboys|XY|iFree|RO|CatEDU|7³ACG|Anonymous|Telesto|GTR|Lislander|Crazyleikm|NOVOLAND)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 9999, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'CMCT',
          groupRegex : /[@-]\s?(CMCT)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CMCTV',
          groupRegex: /[@-]\s?(CMCTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CMCTA',
          groupRegex: /[@-]\s?(CMCTA)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Oldboys',
          groupRegex : /[@-]\s?(Oldboys)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'GTR',
          groupRegex: /[@-]\s?(GTR)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],
      self_groups: [
        {
          groupName: 'XY',
          groupRegex: /[@-]\s?(XY)/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'iFree',
          groupRegex: /[@-]\s?(iFree)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'RO',
          groupRegex : /[@-]\s?(RO)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'CatEDU',
          groupRegex: /[@-]\s?(CatEDU)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: '7³ACG',
          groupRegex: /[@-]\s?(7³ACG)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Anonymous',
          groupRegex : /[@-]\s?(Anonymous)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Telesto',
          groupRegex: /[@-]\s?(Telesto)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Lislander',
          groupRegex : /[@-]\s?(Lislander)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Crazyleikm',
          groupRegex: /[@-]\s?(Crazyleikm)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'NOVOLAND',
          groupRegex: /[@-]\s?(NOVOLAND)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
      selfTorCount: 0,
      selfTorSize: 0,
    },
    {
      host: "hdhome.org",
      abbrev: "HDH",
      seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(HDH)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'HDHome',
          groupRegex : /[@-]\s?(HDHome)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDH',
          groupRegex: /[@-]\s?(HDH)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDHTV',
          groupRegex: /[@-]\s?(HDHTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDHPad',
          groupRegex: /[@-]\s?(HDHPad)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDHWEB',
          groupRegex: /[@-]\s?(HDHWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "hdchina.org",
      abbrev: "HDC",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > p",
      siteRegex: /[@-]\s?(HDC|k9611|tudou|iHD|HDWinG|HDWTV)/i,
      seederLevels: [
        {seederNum: 6, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 30, seederLevelCount: 0, seederLevelSize: 0}],
      groups: [
        {
          groupName: 'HDChina',
          groupRegex : /[@-]\s?(HDChina)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDCTV',
          groupRegex : /[@-]\s?(HDCTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDC',
          groupRegex : /[@-]\s?(HDC)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'k9611',
          groupRegex: /[@-]\s?(k9611)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'tudou',
          groupRegex: /[@-]\s?(tudou)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'iHD',
          groupRegex: /[@-]\s?(iHD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDWinG',
          groupRegex: /[@-]\s?(HDWinG)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDWTV',
          groupRegex: /[@-]\s?(HDWTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        }

      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "hddolby.com",
      abbrev: "DB",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(Dream|DBTV|QHstudIo|HDo)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'Dream',
          groupRegex : /[@-]\s?(Dream)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'DBTV',
          groupRegex: /[@-]\s?(DBTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'QHstudIo',
          groupRegex: /[@-]\s?(QHstudIo)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HDo',
          groupRegex: /[@-]\s?(HDo)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "tjupt.org",
      abbrev: "TJU",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(TJUPT)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'TJUPT',
          groupRegex : /[@-]\s?(TJUPT)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "leaves.red",
      abbrev: "RedLeaves",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(5)",
      seedingSummary: "#ka1",
      siteRegex: /[@-]\s?(RL)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'RL',
          groupRegex : /[@-]\s?(RL)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'RL4B',
          groupRegex : /[@-]\s?(RL4B)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "totheglory.im",
      abbrev: "TTG",
      seedList: "#ka2 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka2 > table > tbody > tr > td:nth-child(4)",
      seedListSeederCount: "#ka2 > table > tbody > tr > td:nth-child(5)",
      seedingSummary:
        "#ka2",
      siteRegex: /[@-]\s?(TTG|Wiki|NGB|DoA|ARiN|ExREN)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
      groups: [
        {
          groupName: 'TTG',
          groupRegex : /[@-]\s?(TTG)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Wiki',
          groupRegex: /[@-]\s?(Wiki)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'NGB',
          groupRegex: /[@-]\s?(NGB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'DoA',
          groupRegex: /[@-]\s?(DoA)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ARiN',
          groupRegex: /[@-]\s?(ARiN)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'ExREN',
          groupRegex: /[@-]\s?(ExREN)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: false,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "ptsbao.club",
      abbrev: "PtSbao",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(OPS|FFans|FHDMv)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'OPS',
          groupRegex : /[@-]\s?(OPS)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'FFansBD',
          groupRegex: /[@-]\s?(FFansBD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'FFansWEB',
          groupRegex: /[@-]\s?(FFansWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'FFansTV',
          groupRegex: /[@-]\s?(FFansTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'FFansDVD',
          groupRegex: /[@-]\s?(FFansDVD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'FHDMv',
          groupRegex: /[@-]\s?(FHDMv)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "pt.btschool.club",
      abbrev: "Bts",
      seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(Bts)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0},
      ],
      groups: [
        {
          groupName: 'BtsHD',
          groupRegex : /[@-]\s?(BtsHD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'BtsTV',
          groupRegex: /[@-]\s?(BtsTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'BtsPAD',
          groupRegex: /[@-]\s?(BtsPAD)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'Zone',
          groupRegex: /[@-]\s?(Zone)\b/i,
          groupCount: 0,
          groupSize: 0,
        }
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "pt.keepfrds.com",
      abbrev: "FRDS",
      seedList: "",
      seedListSize: "",
      seedingSummary: "",
      siteRegex: /[@-]\s?(FRDS)/i,
      seederLevels: [],
      groups:[],
      useTitle: false,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "beitai.pt",
      abbrev: "BeiTai",
      seedList: "",
      seedListSize: "",
      seedingSummary: "",
      siteRegex: /[@-]\s?(BeiTai)/i,
      groups:[],
      seederLevels: [],
      useTitle: false,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "lemonhd.org",
      abbrev: "LemonHD",
      seedList: "",
      seedListSize: "",
      seedingSummary: "",
      siteRegex: /[@-]\s?(LHD|LeagueHD|LeagueNF|LeagueTV|LeagueCD|LeagueWEB|i18n|CiNT)/i,
      groups:[],
      seederLevels: [],
      useTitle: false,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "pt.hd4fans.org",
      abbrev: "beAst",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1",
      siteRegex: /[@-]\s?(beAst)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0},
      ],
      groups:[
        {
          groupName: 'beAst',
          groupRegex : /[@-]\s?(beAst)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'beAstTV',
          groupRegex : /[@-]\s?(beAstTV)\b/i,
          groupCount: 0,
          groupSize: 0,
        },

      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "pt.eastgame.org",
      abbrev: "TLFbits",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedingSummary: "#ka1",
      siteRegex: /[@-]\s?(TLF)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0},
      ],
      groups:[
        {
          groupName: 'iNT-TLF',
          groupRegex : /[@. -](iNT-TLF)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'HALFCD-TLF',
          groupRegex : /[@ .](HALFCD-TLF)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'MiniSD-TLF',
          groupRegex : /[@ .](MiniSD-TLF)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'MiniHD-TLF',
          groupRegex : /[@ .](MiniHD-TLF)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'MiniFHD-TLF',
          groupRegex : /[@ .](MiniFHD-TLF)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
        {
          groupName: 'TLF',
          groupRegex : /[@-]\s?(TLF)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "hhanclub.top",
      abbrev: "HH",
      seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a ",
      seedListSize: "#ka1 > table > tbody > tr > td:nth-child(4)",
      seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(5)",
      seedingSummary: "#ka1 > b",
      siteRegex: /[@-]\s?(HHWEB)/i,
      seederLevels: [
        {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
        {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
      ],
      groups: [
        {
          groupName: 'HHWEB',
          groupRegex : /[@-]\s?(HHWEB)\b/i,
          groupCount: 0,
          groupSize: 0,
        },
      ],
      useTitle: true,
      torCount: 0,
      torSize: 0,
    },
    {
      host: "google.com",
      abbrev: "Others",
      seedList: "",
      seedListSize: "",
      seedingSummary:"",
      siteRegex: /[@-]\s?(Others)/i,
      seederLevels: [],
      groups:[],
      useTitle: false,
      torCount: 0,
      torSize: 0,
    },
  ];

  const TTG_INDEX = 12;
  var OTHERS_INDEX = config.length-1;

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function sizeStrToBytes(sizeStr) {
    var regex = /[+-]?\d+(\.\d+)?/g;
    var sizeStr2 = sizeStr.replace(/,/g, '');
    var num = sizeStr2.match(regex).map(function (v) {
      return parseFloat(v);
    });
    var size = 0;
    if (sizeStr.match(/(KB|KiB)/i)) {
      size = num * 1024;
    } else if (sizeStr.match(/(MB|MiB)/i)) {
      size = num * 1024 * 1024;
    } else if (sizeStr.match(/(GB|GiB)/i)) {
      size = num * 1024 * 1024 * 1024;
    } else if (sizeStr.match(/(TB|TiB)/i)) {
      size = num * 1024 * 1024 * 1024 * 1024;
    } else {
      size = num;
    }

    return size;
  }

  var PTER_SEED_PAGE = '#outer > p.np-pager > font.gray';
  var PTER_SEED_URL = 'https://pterclub.com/getusertorrentlist.php';
  var PTER_SEED_LIST = '#outer > table > tbody > tr';
  var PTER_TOR_ELE = 'td:nth-child(2) > a';
  var PTER_TOR_SIZE = 'td:nth-child(4)';
  var PTER_TOR_SEEDNUM = 'td:nth-child(5)'

  var fetchPTerSeedPages = async (seedHtml, theConfig) => {
    var fullLinkEle = $(seedHtml).find('#ka1 > a:contains("查看全部记录")');
    if (fullLinkEle.length > 0){
      for (const x of theConfig.groups) {
        x.groupCount = 0;
        x.groupSize = 0;
      }
      SSD_totalTorCount = 0;
      SSD_totalTorSize = 0;
      // theConfig.torCount = 0;
      // theConfig.torSize = 0;

      var firstLink = fullLinkEle[0].href;
      var intpage = 1;
      var page  = await $.get(firstLink);
      // console.log(firstLink);
      var nextlink = firstLink;
      var count = 0;
      while ( nextlink) {
        var r =  parseSeedPage(page, theConfig, false, PTER_SEED_LIST, PTER_TOR_ELE, PTER_TOR_SIZE, PTER_TOR_SEEDNUM);
        nextlink = ssdHasNextPage(page, PTER_SEED_PAGE);
        count++;
        if ( nextlink ) {
          if (count % 8 == 0) await sleep(3000);
          page = await ssdGetNextPage(PTER_SEED_URL + nextlink);
          intpage += 1;
        }
      }

      // var firstlink = 'https://springsunday.net/torrents.php?team=1';
      // await getPageList(firstlink, theConfig);
      // await ssdGetPageList(fullLinkEle[0].href, theConfig);
      showSumary(SSD_totalTorCount, SSD_totalTorSize, theConfig)
      return true;
    }
    else return false;
  }

/// SSD seed pages
var SSD_SEED_PAGE = '#outer > div > p > font.gray';
var SSD_SEED_LIST = 'table.torrents > tbody > tr';
var SSD_SEED_URL = 'https://springsunday.net/torrents.php';
var SSD_TOR_ELE = 'div.torrent-title > a';
var SSD_TOR_SIZE = 'td:nth-child(5)';
var SSD_TOR_SEEDNUM = 'td:nth-child(6)'
var SSD_totalTorCount = 0;
var SSD_totalTorSize = 0;
var SSD_selfGroupCount = 0;
var SSD_selfGroupSize = 0;

var parseSeedPage = (html, theConfig, seedColor, eleSeedList, eleTorItem, eleTorSize, eleTorSeedNum) => {
  var torlist = $(html).find(eleSeedList)
  for (var i = 0; i < torlist.length; i++){
    var torName;
    var torSize;
    var torSeederNum;
    var foundGroup;

    const element = torlist[i];
    var item = $(element).find(eleTorItem);
    if (theConfig.useTitle){
        torName = item.attr('title');
        if (!torName) torName = $(element).find("div.torrent-title > span > span > a").text();
    }
    else torName = item.text();
    if (!torName) continue;
    torSize = sizeStrToBytes($(element).find(eleTorSize).text());
    SSD_totalTorCount ++;
    SSD_totalTorSize += torSize;
    var foundConfig = config.find(cc => torName.match(cc.siteRegex)), foundSelfGroup;

    if (foundConfig){
      foundConfig.torCount ++;
      if (foundConfig == theConfig) {
        foundGroup = theConfig.groups.find(gg => torName.match(gg.groupRegex));
        if (foundGroup){
          foundGroup.groupCount++;
          foundGroup.groupSize += torSize;
        }
        if (theConfig.abbrev === 'SSD') {
            foundGroup = theConfig.self_groups.find(gg => torName.match(gg.groupRegex));
            if (foundGroup){
                foundGroup.groupCount++;
                foundGroup.groupSize+= torSize;
            }
        }
        torSeederNum = parseFloat($(element).find(eleTorSeedNum).text());
        if (seedColor){
          if (torSeederNum < theConfig.seederLevels[theConfig.seederLevels.length-2].seederNum) {
            $(element).css("background-color", "#ef6216");
          }
          else if (torSeederNum < theConfig.seederLevels[theConfig.seederLevels.length-1].seederNum) {
            $(element).css("background-color", "#f9f");
          }
          else {
            $(element).css("background-color", "lightgreen");
          }
        }

        for (var sl=0; sl < theConfig.seederLevels.length; sl++) {
          if (torSeederNum < theConfig.seederLevels[sl].seederNum) {
            theConfig.seederLevels[sl].seederLevelCount++;
            theConfig.seederLevels[sl].seederLevelSize += torSize;
            break;
          }
        }
      }
      foundConfig.torSize += torSize;
    } else {
      config[OTHERS_INDEX].torCount ++;
      config[OTHERS_INDEX].torSize += torSize;
    }

  }
  return torlist;
}

var rlGetNextPage = async (nextLink) => {
  // var currentPageEle = $(html).find(SSD_SEED_PAGE).last();
  var nextPageLink = nextLink;
  console.log(nextPageLink);
  // $.get(nextPageLink).done(e => getPageList(e))
  var nextpage = await $.get(nextPageLink);
  return nextpage;
};

var rlHasNextPageLink = (html, RL_PAGE) => {
  // var currentPageEle = $(html).find(RL_PAGE);
  // return currentPageEle.next().attr("href") ? true : false;

  var currentPageEles = $(html).find(RL_PAGE );
  if (!currentPageEles) return '';
  var currentPageEle = currentPageEles[0];
  // var currentPageEle;
  // if (pageEleList[0].innerText.indexOf('一页') > 0){
  //   currentPageEle= pageEleList[1];
  // }
  // else currentPageEle= pageEleList[0];
  var link = $(currentPageEle).next().prop("href");
  return link ? link : '';
};


var fetchRLSeedPages = async(seedHtml, theConfig) => {
  var RL_PAGE = '#ka1 > p > font:nth-child(4)'
  var fullLinkEle = $(seedHtml).find(RL_PAGE);
  if (fullLinkEle.length > 0){

    for (const x of theConfig.groups) {
      x.groupCount = 0;
      x.groupSize = 0;
    }
    totalTorCount = 0;
    totalTorSize = 0;

    var firstLink = fullLinkEle[0].href;
    var intpage = 1;
    var bNext = true;
    var page = seedHtml;
    // var page  = await $.get(firstLink);
    // console.log(firstLink);
    // var nextlink = firstLink;
    var count = 0;
    while ( bNext) {
      debugger;
      parseOneSeedPage(page, theConfig);
      var nextlink = rlHasNextPageLink(page, RL_PAGE);
      count++;
      if ( nextlink ) {
        if (count % 8 == 0) await sleep(3000);
        page = await rlGetNextPage(nextlink);
        intpage += 1;
      }
    }
    showSumary(totalTorCount, totalTorSize, theConfig)
    return true;
  }
  else return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var ssdGetNextPage = async (nextLink) => {
  // var currentPageEle = $(html).find(SSD_SEED_PAGE).last();
  var nextPageLink = nextLink
  console.log(nextPageLink);
  // $.get(nextPageLink).done(e => getPageList(e))
  var nextpage = await $.get(nextPageLink);
  return nextpage;
};

var ssdHasNextPage = (html, pageEle) => {
  var  pageEleList = $(html).find(pageEle );
  if (!pageEleList) return '';
  var currentPageEle;
  if (pageEleList[0].innerText.indexOf('一页') > 0){
    currentPageEle= pageEleList[1];
  }
  else currentPageEle= pageEleList[0];
  var link = $(currentPageEle).next().attr("href");
  return  link ? link : '';
};

var hasSSDFullList = async (seedHtml, theConfig) => {
  var fullLinkEle = $(seedHtml).find('#ka1 > a:contains("完整记录")');
  if (fullLinkEle.length > 0){
    for (const x of theConfig.groups) {
      x.groupCount = 0;
      x.groupSize = 0;
    }
    SSD_totalTorCount = 0;
    SSD_totalTorSize = 0;
    // theConfig.torCount = 0;
    // theConfig.torSize = 0;

    var firstLink = fullLinkEle[0].href;
    var intpage = 1;
    var page  = await $.get(firstLink);
    // console.log(firstLink);
    var nextlink = firstLink;
    var count = 0;
    while ( nextlink) {
      var r =  parseSeedPage(page, theConfig, false, SSD_SEED_LIST, SSD_TOR_ELE, SSD_TOR_SIZE, SSD_TOR_SEEDNUM);
      nextlink = ssdHasNextPage(page, SSD_SEED_PAGE);
      count++;
      if ( nextlink ) {
        if (count % 8 == 0) await sleep(3000);
        page = await ssdGetNextPage(SSD_SEED_URL + nextlink);
        intpage += 1;
      }
    }

    // var firstlink = 'https://springsunday.net/torrents.php?team=1';
    // await getPageList(firstlink, theConfig);
    // await ssdGetPageList(fullLinkEle[0].href, theConfig);
    showSumary(SSD_totalTorCount, SSD_totalTorSize, theConfig)
    return true;
  }
  else return false;
}


function colorSeed(seedHtml, theConfig) {
  var seedList = seedHtml.querySelectorAll( theConfig.seedList );
  var seedListSeederNum = seedHtml.querySelectorAll( theConfig.seedListSeederCount );
  for (var i = 0; i < seedList.length; i++) {
    var torName;
    if (theConfig.useTitle) torName = seedList[i].title;
    else torName = seedList[i].innerText;

    var foundConfig = config.find(cc => torName.match(cc.siteRegex))

    if (foundConfig && foundConfig == theConfig) {
      var torSeederNum = parseFloat(seedListSeederNum[i + 1].innerText);
      if (
        torSeederNum <
        theConfig.seederLevels[theConfig.seederLevels.length - 2].seederNum
      ) {
        seedList[i].parentNode.style = "background-color: #ef6216";
      } else if (
        torSeederNum <
        theConfig.seederLevels[theConfig.seederLevels.length - 1].seederNum
      ) {
        seedList[i].parentNode.style = "background-color: #f9f";
      } else {
        seedList[i].parentNode.style = "background-color: lightgreen;";
      }
    }
  }
}

var totalTorCount = 0;
var totalTorSize = 0;

function parseOneSeedPage(seedHtml, theConfig){
  var seedList = seedHtml.querySelectorAll( theConfig.seedList );
  var seedListSize = seedHtml.querySelectorAll( theConfig.seedListSize );
  var seedListSeederNum = seedHtml.querySelectorAll( theConfig.seedListSeederCount );

  for (var i = 0; i < seedList.length; i++) {
    var torName;
    var torSize;
    var torSeederNum;
    var foundGroup;
    if (theConfig.useTitle) torName = seedList[i].title;
    else torName = seedList[i].innerText;

    if (theConfig.host in ["club.hares.top", "pt.eastgame.org"]) {
      torSize = sizeStrToBytes(seedListSize[i].innerText);
    }
    else {
      torSize = sizeStrToBytes(seedListSize[i + 1].innerText);
    }
    totalTorCount ++;
    totalTorSize += torSize;

    var foundConfig = config.find(cc => torName.match(cc.siteRegex))

    // for pterclub, all game is counted as internal torrent
    var isPTerGameCat = false;
    if (theConfig.host == "pterclub.com") {
      isPTerGameCat = seedList[i].href.match(/game.php\b/i);
      if (isPTerGameCat) {
        foundConfig = theConfig;
      }
    }

    if (foundConfig){
      foundConfig.torCount ++;
      if (foundConfig == theConfig) {
        if (isPTerGameCat) {
          foundGroup = theConfig.groups.find(gg => (gg.groupName == '游戏'));
        } else {
          foundGroup = theConfig.groups.find(gg => torName.match(gg.groupRegex));
        }
        if (foundGroup){
          foundGroup.groupCount++;
          foundGroup.groupSize += torSize;
        }
        if (theConfig.abbrev === 'SSD') {
            foundGroup = theConfig.self_groups.find(gg => torName.match(gg.groupRegex));
            if (foundGroup) {
                foundGroup.groupCount++;
                foundGroup.groupSize += torSize;
            }
        }
        // cat the seeder level
        torSeederNum = parseFloat(seedListSeederNum[i+1].innerText);
        if (torSeederNum < theConfig.seederLevels[theConfig.seederLevels.length-2].seederNum) {
          seedList[i].parentNode.style = "background-color: #ef6216";
        }
        else if (torSeederNum < theConfig.seederLevels[theConfig.seederLevels.length-1].seederNum) {
          seedList[i].parentNode.style = "background-color: #f9f";
        }
        else {
          seedList[i].parentNode.style = "background-color: lightgreen;";
        }

        for (var sl=0; sl < theConfig.seederLevels.length; sl++) {
          if (torSeederNum < theConfig.seederLevels[sl].seederNum) {
            theConfig.seederLevels[sl].seederLevelCount++;
            theConfig.seederLevels[sl].seederLevelSize += torSize;
            break;
          }
        }

      }
      foundConfig.torSize += torSize;
    } else {
      config[OTHERS_INDEX].torCount ++;
      config[OTHERS_INDEX].torSize += torSize;
    }
  }
}

async function getSeedList(seedHtml, theConfig) {
    var sumaryShown = false;
    if (theConfig.host == "springsunday.net"){
      sumaryShown = await hasSSDFullList(seedHtml, theConfig)
      if (sumaryShown) {
        colorSeed(seedHtml, theConfig)
        return;
      }
    }
    else if (theConfig.host == "pterclub.com"){
      sumaryShown = await fetchPTerSeedPages(seedHtml, theConfig)
      if (sumaryShown) {
        colorSeed(seedHtml, theConfig)
        return;
      }
    }
    else if (theConfig.host == "leaves.red"){
      sumaryShown = await fetchRLSeedPages(seedHtml, theConfig)
      if (sumaryShown) {
        colorSeed(seedHtml, theConfig)
        return;
      }
    }
    totalTorCount = 0;
    totalTorSize = 0;

    parseOneSeedPage(seedHtml, theConfig)
    colorSeed(seedHtml, theConfig)

    if (!sumaryShown){
      showSumary(totalTorCount, totalTorSize, theConfig)
    }
  }

  function showSumary(totalTorCount, totalTorSize, theConfig)
  {
    GM_addStyle("#ot_block {font-weight: bold;font-family: Arial, Helvetica, sans-serif;border-collapse: collapse; width: 100%;}");
    GM_addStyle("#ot_block td, #ot_summary th{vertical-align: top;border: none;padding: 18px;}");
    GM_addStyle("#ot_summary {font-weight: normal;font-family: Arial, Helvetica, sans-serif;border-collapse: collapse; width: 100%;}");
    GM_addStyle("#ot_summary tr:nth-child(even){background-color: #f2f2f2;}");
    GM_addStyle("#ot_summary tr:hover {background-color: #ddd;}");
    GM_addStyle("#ot_summary td, #ot_summary th{border: 1px solid #ddd;padding: 4px;}");
    GM_addStyle("#ot_summary th{padding-top: 6px;padding-bottom: 6px;text-align: left;color: white;background-color: #2f4879;}");

    var groupSumary = '<table id="ot_summary"><tbody><th>官组</th><th>数量</th><th>大小</th>';
    for (var i=0; i<theConfig.groups.length; i++){
      if (theConfig.groups[i].groupCount >0){
        groupSumary += '<tr><td>'+theConfig.groups[i].groupName+'</td><td>'+theConfig.groups[i].groupCount+'</td><td>' +formatBytes(theConfig.groups[i].groupSize)+'</td></tr>';
      }
    }
    groupSumary += '</tbody></table>';

    let selfGroupSumary = '';
    if (theConfig.abbrev === 'SSD'){
        selfGroupSumary = '<table id="ot_summary"><tbody><th>制作组</th><th>数量</th><th>大小</th>';
        for (i=0; i<theConfig.self_groups.length; i++){
            if (theConfig.self_groups[i].groupCount >0){
                selfGroupSumary += '<tr><td>'+theConfig.self_groups[i].groupName+'</td><td>'+theConfig.self_groups[i].groupCount+'</td><td>' +formatBytes(theConfig.self_groups[i].groupSize)+'</td></tr>';
            }
        }
        selfGroupSumary += '</tbody></table>';
    }

    var seederLevelSumary = '';
    if (theConfig.seederLevels.length > 0) {
      seederLevelSumary = '<table id="ot_summary"><tbody><th>做种人数</th><th>数量</th><th>大小</th>';
      for (i=0; i<theConfig.seederLevels.length; i++){
        seederLevelSumary += '<tr><td> 小于 '+theConfig.seederLevels[i].seederNum+'</td><td>'
          + theConfig.seederLevels[i].seederLevelCount+'</td><td>'
          + formatBytes(theConfig.seederLevels[i].seederLevelSize)+'</td></tr>';
      }
      seederLevelSumary += '</tbody></table>';
    }

    var sitesSumary = '<table id="ot_summary"><tbody><th>各站官种</th><th>数量</th><th>大小</th>';
    for (i=0; i<config.length; i++ )
    {
      if (config[i].torCount > 0) {
        sitesSumary += '<tr><td><a href="https://'+config[i].host+'" target="_blank">'+config[i].abbrev + '</a></td><td>'
          + config[i].torCount + '</td><td>'
          + formatBytes(config[i].torSize) + '</td></tr>';
      }
    }
    sitesSumary += '</tbody></table>';

    var summary = document.querySelector(theConfig.seedingSummary);
    let inner = '<table id="ot_block"><tbody><tr><td>';
    inner += '做种总数：' + totalTorCount + ' 总大小： '+ formatBytes(totalTorSize) + '<br>' + sitesSumary + '</td>';

    if (theConfig.abbrev === 'SSD'){
        inner += '<td><div>本站官种/制作组种数量：' + theConfig.torCount + ' 官种/制作组种大小： '+ formatBytes(theConfig.torSize) + '<br>' + groupSumary + '</div>'
        inner += '<div>' + selfGroupSumary + '</div>'
    } else {
        inner += '<td><div>本站官种数量：' + theConfig.torCount + ' 官种大小： '+ formatBytes(theConfig.torSize) + '<br>' + groupSumary + '</div>'
    }

    inner += '<div><p>' + seederLevelSumary +'</div>'
    inner += '</td></tr></tbody></table>'+summary.innerHTML ;

    summary.innerHTML = inner;
  }


  function categoryByTitle(torTitle) {
    if (torTitle.match(/remux/ig)) {
      return "remux"
    }
    else if (torTitle.match(/web-?dl|web-?rip|hdtv/ig)) {
      return "webdl"
    }
    else if (torTitle.match(/dvdr|dvdrip/ig)) {
      return "dvdrip"
    }
    else if (torTitle.match(/encode|x264|x265/ig)) {
      return "encode"
    }
    else if (torTitle.match(/blu-?ray|uhd|hevc/ig)) {
      return "Bluray"
    }
    else {
      return "unknow"
    }
  }


  /** Function that count occurrences of a substring in a string;
   * @param {String} string               The string
   * @param {String} subString            The sub string to search for
   * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
   *
   * @author Vitim.us https://gist.github.com/victornpb/7736865
   * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
   * @see https://stackoverflow.com/a/7924240/938822
   */
  function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
  }

  function categoryStr(catStr) {
    let nRemux = occurrences(catStr, "remux");
    let nWebdl = occurrences(catStr, "webdl");
    let nDvdrip = occurrences(catStr, "dvdrip");
    let nEncode = occurrences(catStr, "encode");
    let nBluray = occurrences(catStr, "Bluray");
    let nUnknow = occurrences(catStr, "unknow");

    let tstr = (nRemux ? "Remux: " +nRemux : "") + (nWebdl ? " Webdl: " +nWebdl : "")
      + (nDvdrip ? " DVD: " +nDvdrip : "") + (nEncode ? " Encode: " +nEncode : "")
      + (nBluray ? " Bluray: " +nBluray : "") + (nUnknow ? " unknow: " +nUnknow : "");

    return tstr;
  }

  function getUploadList(seedHtml, theConfig) {
    if (!theConfig.hasOwnProperty("uploadSummary")){
      return false;
    }

    var d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    d.setHours(0,0,0,0);

    var MONTH_TOTAL = 24
    var dataSep = [];
    var dataCount = [];
    var dataSize = [];
    var catStr = [];

    var datep0 = new Date(d)
    dataSep.push(datep0)
    dataCount.push(0);
    dataSize.push(0);
    catStr.push("")
    for (let i=0; i<MONTH_TOTAL; ++i){
      d.setMonth(d.getMonth() - 1);
      datep0 = new Date(d)
      dataSep.push(datep0);
      dataCount.push(0);
      dataSize.push(0);
      catStr.push("")
    }

    // var uploadList = seedHtml.querySelectorAll( theConfig.uploadTime );
    var torlist = $(seedHtml).find('#ka > table > tbody > tr')
    for (let i=0; i < torlist.length; ++i){
      let uptime;
      if (theConfig.uploadDateCol.indexOf('span') > 0){
        uptime = $(torlist[i]).find(theConfig.uploadDateCol).attr("title")
      }
      else {
        uptime = $(torlist[i]).find(theConfig.uploadDateCol).text()
      }
      if (uptime) {
          let dateUpload = new Date(uptime);
          for (let m=0; m<MONTH_TOTAL; ++m){
            if (dateUpload >= dataSep[m+1] && dateUpload < dataSep[m]) {
              let tortile =  $(torlist[i]).find('td:nth-child(2) > a').attr("title");
              let sizeStr = $(torlist[i]).find(theConfig.uploadSizeCol).text();
              let sizeBytes = sizeStrToBytes(sizeStr);
              dataSize[m+1] += sizeBytes;
              catStr[m+1] += (categoryByTitle(tortile))
              // TORLIST.push(tortile)
              console.log(tortile);
              dataCount[m+1]++;
            }
          }
      }
    }
    // debugger;
    // console.log("发种数量："+dataCount)

    var uploadSummaryTable = '<table id="up_summary"><tbody><th>分月统计</th><th>发种数量</th><th>类型</th><th>大小</th>';
    for (let i=0; i<MONTH_TOTAL; i++ )
    {
      if (dataCount[i] > 0) {
        let datestr = dataSep[i].toLocaleString('default', { year:'numeric', month: 'long' });

        uploadSummaryTable += '<tr><td>'+datestr + '</a></td><td>'
          + dataCount[i] + '</td><td>'
          + categoryStr(catStr[i]) + '</td><td>'
          + formatBytes(dataSize[i]) + '</td></tr>';
      }
    }
    uploadSummaryTable += '</tbody></table>';

    var summary = document.querySelector(theConfig.uploadSummary);
    summary.innerHTML = uploadSummaryTable + summary.innerHTML ;
    return dataCount
  }

  (function () {
    "use strict";

    if (window.location.host == "springsunday.net" && window.location.pathname.indexOf("torrents.php") > 0 ){
      var ssdconfig = config.find(cc => window.location.host.includes(cc.host));
      parseSeedPage(document, ssdconfig, true, SSD_SEED_LIST, SSD_TOR_ELE, SSD_TOR_SIZE, SSD_TOR_SEEDNUM);
      return;
    }
    if (window.location.host == "pterclub.com" && window.location.pathname.indexOf("getusertorrentlist.php") > 0 ){
      var pterconfig = config.find(cc => window.location.host.includes(cc.host));
      parseSeedPage(document, pterconfig, true, PTER_SEED_LIST, PTER_TOR_ELE, PTER_TOR_SIZE, PTER_TOR_SEEDNUM);
      return;
    }
    if (window.location.host == "totheglory.im") {
      getSeedList(document, config[TTG_INDEX]);  // REMEMBER THIS
    } else {
      var intv = setInterval(function() {
        var elems = document.querySelectorAll('#ka1 > table > tbody > tr');
        var elemUp = document.querySelectorAll('#ka > table > tbody > tr');

        if (elems && elemUp && elems.length <  1 && elemUp.length <  1) {
              return false;
        }

        //when element is found, clear the interval.
        clearInterval(intv);

        var thisConfig = config.find(cc => window.location.host.includes(cc.host));
        if (thisConfig && elems.length > 0) getSeedList(document, thisConfig);
        if (thisConfig && elemUp.length > 0) getUploadList(document, thisConfig);
      }, 1000);
    }

  })();