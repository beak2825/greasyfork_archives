// ==UserScript==
// @name         WaniKani Kanji Multiple Choice Quiz
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Generate multiple-choice questions from your WaniKani kanji
// @author       You
// @match        https://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498057/WaniKani%20Kanji%20Multiple%20Choice%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/498057/WaniKani%20Kanji%20Multiple%20Choice%20Quiz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = 'YOUR_API_KEY_HERE';
    const userApiUrl = 'https://api.wanikani.com/v2/user';
    const subjectsApiUrl = 'https://api.wanikani.com/v2/subjects';
    let incorrectKanjiQueue = [];
    let questionType = 'both'; // default to both types of questions
    let previouslySelectedLevels = [];

    const similarKanjiDict = {
    "入": {
        "level": 1,
        "meaning": "Enter",
        "similar": [
            {
                "kanji": "人",
                "level": 1,
                "meaning": "Person"
            },
            {
                "kanji": "八",
                "level": 1,
                "meaning": "Eight"
            }
        ]
    },
    "八": {
        "level": 1,
        "meaning": "Eight",
        "similar": [
            {
                "kanji": "人",
                "level": 1,
                "meaning": "Person"
            },
            {
                "kanji": "入",
                "level": 1,
                "meaning": "Enter"
            }
        ]
    },
    "力": {
        "level": 1,
        "meaning": "Power",
        "similar": [
            {
                "kanji": "刀",
                "level": 2,
                "meaning": "Sword"
            }
        ]
    },
    "十": {
        "level": 1,
        "meaning": "Ten",
        "similar": []
    },
    "口": {
        "level": 1,
        "meaning": "Mouth",
        "similar": [
            {
                "kanji": "中",
                "level": 2,
                "meaning": "Middle"
            }
        ]
    },
    "大": {
        "level": 1,
        "meaning": "Big",
        "similar": [
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "友",
                "level": 3,
                "meaning": "Friend"
            },
            {
                "kanji": "反",
                "level": 8,
                "meaning": "Anti"
            },
            {
                "kanji": "太",
                "level": 3,
                "meaning": "Fat"
            },
            {
                "kanji": "文",
                "level": 2,
                "meaning": "Writing"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "犬",
                "level": 2,
                "meaning": "Dog"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            }
        ]
    },
    "女": {
        "level": 1,
        "meaning": "Woman",
        "similar": []
    },
    "山": {
        "level": 1,
        "meaning": "Mountain",
        "similar": []
    },
    "川": {
        "level": 1,
        "meaning": "River",
        "similar": []
    },
    "工": {
        "level": 1,
        "meaning": "Construction",
        "similar": [
            {
                "kanji": "土",
                "level": 2,
                "meaning": "Dirt"
            },
            {
                "kanji": "士",
                "level": 13,
                "meaning": "Samurai"
            },
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            },
            {
                "kanji": "五",
                "level": 2,
                "meaning": "Five"
            }
        ]
    },
    "一": {
        "level": 1,
        "meaning": "One",
        "similar": []
    },
    "七": {
        "level": 1,
        "meaning": "Seven",
        "similar": []
    },
    "三": {
        "level": 1,
        "meaning": "Three",
        "similar": [
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            }
        ]
    },
    "上": {
        "level": 1,
        "meaning": "Above",
        "similar": []
    },
    "下": {
        "level": 1,
        "meaning": "Below",
        "similar": [
            {
                "kanji": "不",
                "level": 4,
                "meaning": "Not"
            }
        ]
    },
    "九": {
        "level": 1,
        "meaning": "Nine",
        "similar": []
    },
    "二": {
        "level": 1,
        "meaning": "Two",
        "similar": []
    },
    "人": {
        "level": 1,
        "meaning": "Person",
        "similar": [
            {
                "kanji": "入",
                "level": 1,
                "meaning": "Enter"
            },
            {
                "kanji": "八",
                "level": 1,
                "meaning": "Eight"
            }
        ]
    },
    "火": {
        "level": 2,
        "meaning": "Fire",
        "similar": []
    },
    "六": {
        "level": 2,
        "meaning": "Six",
        "similar": [
            {
                "kanji": "文",
                "level": 2,
                "meaning": "Writing"
            }
        ]
    },
    "円": {
        "level": 2,
        "meaning": "Yen",
        "similar": []
    },
    "出": {
        "level": 2,
        "meaning": "Exit",
        "similar": []
    },
    "刀": {
        "level": 2,
        "meaning": "Sword",
        "similar": [
            {
                "kanji": "力",
                "level": 1,
                "meaning": "Power"
            }
        ]
    },
    "手": {
        "level": 2,
        "meaning": "Hand",
        "similar": [
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            },
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            },
            {
                "kanji": "毛",
                "level": 3,
                "meaning": "Fur"
            }
        ]
    },
    "才": {
        "level": 2,
        "meaning": "Genius",
        "similar": []
    },
    "犬": {
        "level": 2,
        "meaning": "Dog",
        "similar": [
            {
                "kanji": "太",
                "level": 3,
                "meaning": "Fat"
            },
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            },
            {
                "kanji": "不",
                "level": 4,
                "meaning": "Not"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            }
        ]
    },
    "千": {
        "level": 2,
        "meaning": "Thousand",
        "similar": [
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            },
            {
                "kanji": "升",
                "level": 60,
                "meaning": "Grid"
            },
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            }
        ]
    },
    "玉": {
        "level": 2,
        "meaning": "Ball",
        "similar": [
            {
                "kanji": "寺",
                "level": 15,
                "meaning": "Temple"
            },
            {
                "kanji": "去",
                "level": 4,
                "meaning": "Past"
            },
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            },
            {
                "kanji": "芸",
                "level": 14,
                "meaning": "Acting"
            }
        ]
    },
    "王": {
        "level": 2,
        "meaning": "King",
        "similar": [
            {
                "kanji": "生",
                "level": 3,
                "meaning": "Life"
            },
            {
                "kanji": "主",
                "level": 4,
                "meaning": "Master"
            },
            {
                "kanji": "玉",
                "level": 2,
                "meaning": "Ball"
            },
            {
                "kanji": "五",
                "level": 2,
                "meaning": "Five"
            },
            {
                "kanji": "工",
                "level": 1,
                "meaning": "Construction"
            },
            {
                "kanji": "士",
                "level": 13,
                "meaning": "Samurai"
            },
            {
                "kanji": "土",
                "level": 2,
                "meaning": "Dirt"
            },
            {
                "kanji": "三",
                "level": 1,
                "meaning": "Three"
            }
        ]
    },
    "又": {
        "level": 2,
        "meaning": "Again",
        "similar": []
    },
    "右": {
        "level": 2,
        "meaning": "Right",
        "similar": [
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            },
            {
                "kanji": "合",
                "level": 12,
                "meaning": "Suit"
            },
            {
                "kanji": "司",
                "level": 15,
                "meaning": "Director"
            },
            {
                "kanji": "句",
                "level": 18,
                "meaning": "Paragraph"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            },
            {
                "kanji": "乱",
                "level": 19,
                "meaning": "Riot"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            }
        ]
    },
    "田": {
        "level": 2,
        "meaning": "Rice Paddy",
        "similar": [
            {
                "kanji": "由",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "曲",
                "level": 6,
                "meaning": "Music"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "男",
                "level": 4,
                "meaning": "Man"
            },
            {
                "kanji": "町",
                "level": 4,
                "meaning": "Town"
            }
        ]
    },
    "文": {
        "level": 2,
        "meaning": "Writing",
        "similar": [
            {
                "kanji": "央",
                "level": 4,
                "meaning": "Center"
            },
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            },
            {
                "kanji": "六",
                "level": 2,
                "meaning": "Six"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            }
        ]
    },
    "日": {
        "level": 2,
        "meaning": "Sun",
        "similar": [
            {
                "kanji": "甲",
                "level": 39,
                "meaning": "Turtle"
            },
            {
                "kanji": "申",
                "level": 4,
                "meaning": "Say"
            },
            {
                "kanji": "旧",
                "level": 36,
                "meaning": "Former"
            },
            {
                "kanji": "由",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "田",
                "level": 2,
                "meaning": "Rice"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            }
        ]
    },
    "白": {
        "level": 2,
        "meaning": "White",
        "similar": [
            {
                "kanji": "旬",
                "level": 37,
                "meaning": "In"
            },
            {
                "kanji": "百",
                "level": 4,
                "meaning": "Hundred"
            },
            {
                "kanji": "旨",
                "level": 43,
                "meaning": "Point"
            },
            {
                "kanji": "自",
                "level": 5,
                "meaning": "Self"
            },
            {
                "kanji": "旧",
                "level": 36,
                "meaning": "Former"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            },
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            }
        ]
    },
    "四": {
        "level": 2,
        "meaning": "Four",
        "similar": [
            {
                "kanji": "西",
                "level": 5,
                "meaning": "West"
            },
            {
                "kanji": "囚",
                "level": 60,
                "meaning": "Criminal"
            }
        ]
    },
    "目": {
        "level": 2,
        "meaning": "Eye",
        "similar": [
            {
                "kanji": "自",
                "level": 5,
                "meaning": "Self"
            },
            {
                "kanji": "甲",
                "level": 39,
                "meaning": "Turtle"
            },
            {
                "kanji": "申",
                "level": 4,
                "meaning": "Say"
            },
            {
                "kanji": "由",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "田",
                "level": 2,
                "meaning": "Rice"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "見",
                "level": 4,
                "meaning": "See"
            },
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            }
        ]
    },
    "月": {
        "level": 2,
        "meaning": "Moon",
        "similar": [
            {
                "kanji": "用",
                "level": 3,
                "meaning": "Task"
            }
        ]
    },
    "土": {
        "level": 2,
        "meaning": "Dirt",
        "similar": [
            {
                "kanji": "士",
                "level": 13,
                "meaning": "Samurai"
            },
            {
                "kanji": "工",
                "level": 1,
                "meaning": "Construction"
            },
            {
                "kanji": "五",
                "level": 2,
                "meaning": "Five"
            },
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            }
        ]
    },
    "木": {
        "level": 2,
        "meaning": "Tree",
        "similar": [
            {
                "kanji": "本",
                "level": 2,
                "meaning": "Book"
            },
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            }
        ]
    },
    "本": {
        "level": 2,
        "meaning": "Book",
        "similar": [
            {
                "kanji": "木",
                "level": 2,
                "meaning": "Tree"
            },
            {
                "kanji": "体",
                "level": 5,
                "meaning": "Body"
            }
        ]
    },
    "夕": {
        "level": 2,
        "meaning": "Evening",
        "similar": []
    },
    "天": {
        "level": 2,
        "meaning": "Heaven",
        "similar": [
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "矢",
                "level": 3,
                "meaning": "Arrow"
            },
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "失",
                "level": 7,
                "meaning": "Fault"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "文",
                "level": 2,
                "meaning": "Writing"
            },
            {
                "kanji": "井",
                "level": 45,
                "meaning": "Well"
            }
        ]
    },
    "立": {
        "level": 2,
        "meaning": "Stand",
        "similar": [
            {
                "kanji": "辛",
                "level": 44,
                "meaning": "Spicy"
            },
            {
                "kanji": "位",
                "level": 11,
                "meaning": "Rank"
            }
        ]
    },
    "子": {
        "level": 2,
        "meaning": "Child",
        "similar": []
    },
    "正": {
        "level": 2,
        "meaning": "Correct",
        "similar": [
            {
                "kanji": "止",
                "level": 3,
                "meaning": "Stop"
            }
        ]
    },
    "小": {
        "level": 2,
        "meaning": "Small",
        "similar": [
            {
                "kanji": "少",
                "level": 3,
                "meaning": "Few"
            }
        ]
    },
    "水": {
        "level": 2,
        "meaning": "Water",
        "similar": []
    },
    "左": {
        "level": 2,
        "meaning": "Left",
        "similar": [
            {
                "kanji": "圧",
                "level": 20,
                "meaning": "Pressure"
            },
            {
                "kanji": "在",
                "level": 20,
                "meaning": "Exist"
            },
            {
                "kanji": "佐",
                "level": 47,
                "meaning": "Help"
            }
        ]
    },
    "丁": {
        "level": 2,
        "meaning": "Street",
        "similar": []
    },
    "中": {
        "level": 2,
        "meaning": "Middle",
        "similar": [
            {
                "kanji": "口",
                "level": 1,
                "meaning": "Mouth"
            }
        ]
    },
    "丸": {
        "level": 2,
        "meaning": "Circle",
        "similar": []
    },
    "了": {
        "level": 2,
        "meaning": "Finish",
        "similar": []
    },
    "五": {
        "level": 2,
        "meaning": "Five",
        "similar": [
            {
                "kanji": "工",
                "level": 1,
                "meaning": "Construction"
            },
            {
                "kanji": "士",
                "level": 13,
                "meaning": "Samurai"
            },
            {
                "kanji": "互",
                "level": 35,
                "meaning": "Mutual"
            },
            {
                "kanji": "土",
                "level": 2,
                "meaning": "Dirt"
            },
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            }
        ]
    },
    "元": {
        "level": 3,
        "meaning": "Origin",
        "similar": [
            {
                "kanji": "井",
                "level": 45,
                "meaning": "Well"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            }
        ]
    },
    "公": {
        "level": 3,
        "meaning": "Public",
        "similar": [
            {
                "kanji": "仏",
                "level": 15,
                "meaning": "Buddha"
            }
        ]
    },
    "内": {
        "level": 3,
        "meaning": "Inside",
        "similar": []
    },
    "冬": {
        "level": 3,
        "meaning": "Winter",
        "similar": []
    },
    "分": {
        "level": 3,
        "meaning": "Part",
        "similar": []
    },
    "切": {
        "level": 3,
        "meaning": "Cut",
        "similar": [
            {
                "kanji": "万",
                "level": 3,
                "meaning": "Ten"
            }
        ]
    },
    "父": {
        "level": 3,
        "meaning": "Father",
        "similar": [
            {
                "kanji": "欠",
                "level": 7,
                "meaning": "Lack"
            }
        ]
    },
    "戸": {
        "level": 3,
        "meaning": "Door",
        "similar": []
    },
    "牛": {
        "level": 3,
        "meaning": "Cow",
        "similar": [
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            },
            {
                "kanji": "半",
                "level": 3,
                "meaning": "Half"
            },
            {
                "kanji": "毛",
                "level": 3,
                "meaning": "Fur"
            },
            {
                "kanji": "手",
                "level": 2,
                "meaning": "Hand"
            },
            {
                "kanji": "升",
                "level": 60,
                "meaning": "Grid"
            },
            {
                "kanji": "千",
                "level": 2,
                "meaning": "Thousand"
            },
            {
                "kanji": "干",
                "level": 17,
                "meaning": "Dry"
            }
        ]
    },
    "北": {
        "level": 3,
        "meaning": "North",
        "similar": []
    },
    "午": {
        "level": 3,
        "meaning": "Noon",
        "similar": [
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            },
            {
                "kanji": "半",
                "level": 3,
                "meaning": "Half"
            },
            {
                "kanji": "干",
                "level": 17,
                "meaning": "Dry"
            },
            {
                "kanji": "升",
                "level": 60,
                "meaning": "Grid"
            },
            {
                "kanji": "毛",
                "level": 3,
                "meaning": "Fur"
            },
            {
                "kanji": "千",
                "level": 2,
                "meaning": "Thousand"
            },
            {
                "kanji": "手",
                "level": 2,
                "meaning": "Hand"
            }
        ]
    },
    "半": {
        "level": 3,
        "meaning": "Half",
        "similar": [
            {
                "kanji": "羊",
                "level": 6,
                "meaning": "Sheep"
            },
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            },
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            },
            {
                "kanji": "判",
                "level": 21,
                "meaning": "Judge"
            },
            {
                "kanji": "伴",
                "level": 38,
                "meaning": "Accompany"
            },
            {
                "kanji": "辛",
                "level": 44,
                "meaning": "Spicy"
            }
        ]
    },
    "友": {
        "level": 3,
        "meaning": "Friend",
        "similar": [
            {
                "kanji": "反",
                "level": 8,
                "meaning": "Anti"
            },
            {
                "kanji": "支",
                "level": 8,
                "meaning": "Support"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            },
            {
                "kanji": "久",
                "level": 32,
                "meaning": "Long"
            }
        ]
    },
    "古": {
        "level": 3,
        "meaning": "Old",
        "similar": [
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            },
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            },
            {
                "kanji": "石",
                "level": 4,
                "meaning": "Stone"
            },
            {
                "kanji": "乱",
                "level": 19,
                "meaning": "Riot"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "克",
                "level": 42,
                "meaning": "Overcome"
            }
        ]
    },
    "台": {
        "level": 3,
        "meaning": "Machine",
        "similar": []
    },
    "生": {
        "level": 3,
        "meaning": "Life",
        "similar": [
            {
                "kanji": "全",
                "level": 6,
                "meaning": "All"
            },
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            },
            {
                "kanji": "主",
                "level": 4,
                "meaning": "Master"
            },
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            },
            {
                "kanji": "狂",
                "level": 45,
                "meaning": "Lunatic"
            }
        ]
    },
    "用": {
        "level": 3,
        "meaning": "Task",
        "similar": [
            {
                "kanji": "月",
                "level": 2,
                "meaning": "Moon"
            },
            {
                "kanji": "肝",
                "level": 42,
                "meaning": "Liver"
            }
        ]
    },
    "方": {
        "level": 3,
        "meaning": "Direction",
        "similar": []
    },
    "矢": {
        "level": 3,
        "meaning": "Arrow",
        "similar": [
            {
                "kanji": "失",
                "level": 7,
                "meaning": "Fault"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            }
        ]
    },
    "外": {
        "level": 3,
        "meaning": "Outside",
        "similar": []
    },
    "太": {
        "level": 3,
        "meaning": "Fat",
        "similar": [
            {
                "kanji": "犬",
                "level": 2,
                "meaning": "Dog"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "不",
                "level": 4,
                "meaning": "Not"
            },
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            }
        ]
    },
    "止": {
        "level": 3,
        "meaning": "Stop",
        "similar": [
            {
                "kanji": "正",
                "level": 2,
                "meaning": "Correct"
            }
        ]
    },
    "母": {
        "level": 3,
        "meaning": "Mother",
        "similar": []
    },
    "毛": {
        "level": 3,
        "meaning": "Fur",
        "similar": [
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            },
            {
                "kanji": "手",
                "level": 2,
                "meaning": "Hand"
            },
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            }
        ]
    },
    "少": {
        "level": 3,
        "meaning": "Few",
        "similar": [
            {
                "kanji": "小",
                "level": 2,
                "meaning": "Small"
            }
        ]
    },
    "市": {
        "level": 3,
        "meaning": "City",
        "similar": [
            {
                "kanji": "布",
                "level": 19,
                "meaning": "Cloth"
            }
        ]
    },
    "万": {
        "level": 3,
        "meaning": "Ten Thousand",
        "similar": [
            {
                "kanji": "切",
                "level": 3,
                "meaning": "Cut"
            }
        ]
    },
    "広": {
        "level": 3,
        "meaning": "Wide",
        "similar": [
            {
                "kanji": "玄",
                "level": 51,
                "meaning": "Mysterious"
            }
        ]
    },
    "今": {
        "level": 3,
        "meaning": "Now",
        "similar": []
    },
    "引": {
        "level": 3,
        "meaning": "Pull",
        "similar": [
            {
                "kanji": "弔",
                "level": 57,
                "meaning": "Condolence"
            },
            {
                "kanji": "弓",
                "level": 18,
                "meaning": "Bow"
            }
        ]
    },
    "心": {
        "level": 3,
        "meaning": "Heart",
        "similar": []
    },
    "耳": {
        "level": 4,
        "meaning": "Ear",
        "similar": [
            {
                "kanji": "取",
                "level": 16,
                "meaning": "Take"
            }
        ]
    },
    "先": {
        "level": 4,
        "meaning": "Previous",
        "similar": []
    },
    "写": {
        "level": 4,
        "meaning": "Copy",
        "similar": []
    },
    "打": {
        "level": 4,
        "meaning": "Hit",
        "similar": []
    },
    "花": {
        "level": 4,
        "meaning": "Flower",
        "similar": [
            {
                "kanji": "老",
                "level": 11,
                "meaning": "Elderly"
            }
        ]
    },
    "去": {
        "level": 4,
        "meaning": "Past",
        "similar": [
            {
                "kanji": "玉",
                "level": 2,
                "meaning": "Ball"
            },
            {
                "kanji": "芸",
                "level": 14,
                "meaning": "Acting"
            },
            {
                "kanji": "却",
                "level": 38,
                "meaning": "Contrary"
            }
        ]
    },
    "号": {
        "level": 4,
        "meaning": "Number",
        "similar": []
    },
    "名": {
        "level": 4,
        "meaning": "Name",
        "similar": [
            {
                "kanji": "各",
                "level": 22,
                "meaning": "Each"
            },
            {
                "kanji": "否",
                "level": 33,
                "meaning": "No"
            }
        ]
    },
    "申": {
        "level": 4,
        "meaning": "Say Humbly",
        "similar": [
            {
                "kanji": "甲",
                "level": 39,
                "meaning": "Turtle"
            },
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            }
        ]
    },
    "男": {
        "level": 4,
        "meaning": "Man",
        "similar": [
            {
                "kanji": "勇",
                "level": 15,
                "meaning": "Courage"
            },
            {
                "kanji": "町",
                "level": 4,
                "meaning": "Town"
            },
            {
                "kanji": "由",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "田",
                "level": 2,
                "meaning": "Rice"
            }
        ]
    },
    "町": {
        "level": 4,
        "meaning": "Town",
        "similar": [
            {
                "kanji": "田",
                "level": 2,
                "meaning": "Rice"
            },
            {
                "kanji": "由",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "男",
                "level": 4,
                "meaning": "Man"
            }
        ]
    },
    "早": {
        "level": 4,
        "meaning": "Early",
        "similar": [
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "申",
                "level": 4,
                "meaning": "Say"
            },
            {
                "kanji": "甲",
                "level": 39,
                "meaning": "Turtle"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "卓",
                "level": 45,
                "meaning": "Table"
            },
            {
                "kanji": "昇",
                "level": 27,
                "meaning": "Ascend"
            },
            {
                "kanji": "町",
                "level": 4,
                "meaning": "Town"
            },
            {
                "kanji": "里",
                "level": 5,
                "meaning": "Home"
            }
        ]
    },
    "虫": {
        "level": 4,
        "meaning": "Insect",
        "similar": []
    },
    "百": {
        "level": 4,
        "meaning": "Hundred",
        "similar": [
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "者",
                "level": 8,
                "meaning": "Someone"
            },
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            }
        ]
    },
    "皿": {
        "level": 4,
        "meaning": "Plate",
        "similar": [
            {
                "kanji": "血",
                "level": 6,
                "meaning": "Blood"
            }
        ]
    },
    "村": {
        "level": 4,
        "meaning": "Village",
        "similar": [
            {
                "kanji": "材",
                "level": 14,
                "meaning": "Lumber"
            },
            {
                "kanji": "杯",
                "level": 29,
                "meaning": "Cup"
            },
            {
                "kanji": "朽",
                "level": 58,
                "meaning": "Rot"
            },
            {
                "kanji": "対",
                "level": 8,
                "meaning": "Versus"
            },
            {
                "kanji": "朴",
                "level": 55,
                "meaning": "Simple"
            },
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            }
        ]
    },
    "石": {
        "level": 4,
        "meaning": "Stone",
        "similar": [
            {
                "kanji": "加",
                "level": 19,
                "meaning": "Add"
            },
            {
                "kanji": "召",
                "level": 51,
                "meaning": "Call"
            },
            {
                "kanji": "古",
                "level": 3,
                "meaning": "Old"
            },
            {
                "kanji": "否",
                "level": 33,
                "meaning": "No"
            },
            {
                "kanji": "君",
                "level": 8,
                "meaning": "Buddy"
            }
        ]
    },
    "央": {
        "level": 4,
        "meaning": "Center",
        "similar": [
            {
                "kanji": "文",
                "level": 2,
                "meaning": "Writing"
            }
        ]
    },
    "礼": {
        "level": 4,
        "meaning": "Thanks",
        "similar": []
    },
    "見": {
        "level": 4,
        "meaning": "See",
        "similar": [
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            },
            {
                "kanji": "具",
                "level": 9,
                "meaning": "Tool"
            },
            {
                "kanji": "昆",
                "level": 19,
                "meaning": "Descendants"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "児",
                "level": 28,
                "meaning": "Child"
            }
        ]
    },
    "竹": {
        "level": 4,
        "meaning": "Bamboo",
        "similar": []
    },
    "字": {
        "level": 4,
        "meaning": "Letter",
        "similar": []
    },
    "宝": {
        "level": 4,
        "meaning": "Treasure",
        "similar": [
            {
                "kanji": "害",
                "level": 20,
                "meaning": "Damage"
            }
        ]
    },
    "気": {
        "level": 4,
        "meaning": "Energy",
        "similar": []
    },
    "氷": {
        "level": 4,
        "meaning": "Ice",
        "similar": []
    },
    "貝": {
        "level": 4,
        "meaning": "Shellfish",
        "similar": [
            {
                "kanji": "見",
                "level": 4,
                "meaning": "See"
            },
            {
                "kanji": "貞",
                "level": 51,
                "meaning": "Chastity"
            },
            {
                "kanji": "県",
                "level": 9,
                "meaning": "Prefecture"
            },
            {
                "kanji": "則",
                "level": 23,
                "meaning": "Rule"
            },
            {
                "kanji": "負",
                "level": 9,
                "meaning": "Lose"
            },
            {
                "kanji": "具",
                "level": 9,
                "meaning": "Tool"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            }
        ]
    },
    "糸": {
        "level": 4,
        "meaning": "Thread",
        "similar": [
            {
                "kanji": "系",
                "level": 30,
                "meaning": "Lineage"
            }
        ]
    },
    "赤": {
        "level": 4,
        "meaning": "Red",
        "similar": [
            {
                "kanji": "寺",
                "level": 15,
                "meaning": "Temple"
            },
            {
                "kanji": "老",
                "level": 11,
                "meaning": "Elderly"
            },
            {
                "kanji": "考",
                "level": 5,
                "meaning": "Think"
            },
            {
                "kanji": "示",
                "level": 22,
                "meaning": "Indicate"
            }
        ]
    },
    "足": {
        "level": 4,
        "meaning": "Foot",
        "similar": [
            {
                "kanji": "促",
                "level": 29,
                "meaning": "Urge"
            },
            {
                "kanji": "史",
                "level": 19,
                "meaning": "History"
            },
            {
                "kanji": "吹",
                "level": 40,
                "meaning": "Blow"
            }
        ]
    },
    "不": {
        "level": 4,
        "meaning": "Not",
        "similar": [
            {
                "kanji": "太",
                "level": 3,
                "meaning": "Fat"
            },
            {
                "kanji": "犬",
                "level": 2,
                "meaning": "Dog"
            },
            {
                "kanji": "下",
                "level": 1,
                "meaning": "Below"
            }
        ]
    },
    "世": {
        "level": 4,
        "meaning": "World",
        "similar": []
    },
    "主": {
        "level": 4,
        "meaning": "Master",
        "similar": [
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            },
            {
                "kanji": "生",
                "level": 3,
                "meaning": "Life"
            },
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            }
        ]
    },
    "平": {
        "level": 4,
        "meaning": "Flat",
        "similar": [
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            },
            {
                "kanji": "辛",
                "level": 44,
                "meaning": "Spicy"
            }
        ]
    },
    "年": {
        "level": 4,
        "meaning": "Year",
        "similar": [
            {
                "kanji": "缶",
                "level": 44,
                "meaning": "Can"
            }
        ]
    },
    "車": {
        "level": 4,
        "meaning": "Car",
        "similar": [
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            },
            {
                "kanji": "草",
                "level": 5,
                "meaning": "Grass"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "画",
                "level": 6,
                "meaning": "Drawing"
            },
            {
                "kanji": "卓",
                "level": 45,
                "meaning": "Table"
            },
            {
                "kanji": "更",
                "level": 30,
                "meaning": "Again"
            },
            {
                "kanji": "申",
                "level": 4,
                "meaning": "Say"
            }
        ]
    },
    "仕": {
        "level": 4,
        "meaning": "Doing",
        "similar": [
            {
                "kanji": "在",
                "level": 20,
                "meaning": "Exist"
            },
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            },
            {
                "kanji": "仁",
                "level": 41,
                "meaning": "Humanity"
            },
            {
                "kanji": "佐",
                "level": 47,
                "meaning": "Help"
            },
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            }
        ]
    },
    "他": {
        "level": 4,
        "meaning": "Other",
        "similar": []
    },
    "代": {
        "level": 4,
        "meaning": "Substitute",
        "similar": [
            {
                "kanji": "伐",
                "level": 57,
                "meaning": "Fell"
            },
            {
                "kanji": "付",
                "level": 7,
                "meaning": "Attach"
            }
        ]
    },
    "休": {
        "level": 4,
        "meaning": "Rest",
        "similar": [
            {
                "kanji": "体",
                "level": 5,
                "meaning": "Body"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "使",
                "level": 9,
                "meaning": "Use"
            },
            {
                "kanji": "条",
                "level": 21,
                "meaning": "Clause"
            }
        ]
    },
    "考": {
        "level": 5,
        "meaning": "Think",
        "similar": [
            {
                "kanji": "老",
                "level": 11,
                "meaning": "Elderly"
            },
            {
                "kanji": "赤",
                "level": 4,
                "meaning": "Red"
            }
        ]
    },
    "肉": {
        "level": 5,
        "meaning": "Meat",
        "similar": []
    },
    "兄": {
        "level": 5,
        "meaning": "Older Brother",
        "similar": [
            {
                "kanji": "史",
                "level": 19,
                "meaning": "History"
            },
            {
                "kanji": "克",
                "level": 42,
                "meaning": "Overcome"
            }
        ]
    },
    "光": {
        "level": 5,
        "meaning": "Sunlight",
        "similar": [
            {
                "kanji": "完",
                "level": 14,
                "meaning": "Perfect"
            }
        ]
    },
    "里": {
        "level": 5,
        "meaning": "Home Village",
        "similar": [
            {
                "kanji": "星",
                "level": 6,
                "meaning": "Star"
            },
            {
                "kanji": "重",
                "level": 9,
                "meaning": "Heavy"
            },
            {
                "kanji": "皇",
                "level": 33,
                "meaning": "Emperor"
            },
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "時",
                "level": 7,
                "meaning": "Time"
            },
            {
                "kanji": "埋",
                "level": 39,
                "meaning": "Bury"
            }
        ]
    },
    "金": {
        "level": 5,
        "meaning": "Gold",
        "similar": [
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            }
        ]
    },
    "自": {
        "level": 5,
        "meaning": "Self",
        "similar": [
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            }
        ]
    },
    "色": {
        "level": 5,
        "meaning": "Color",
        "similar": []
    },
    "草": {
        "level": 5,
        "meaning": "Grass",
        "similar": [
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "卓",
                "level": 45,
                "meaning": "Table"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "埋",
                "level": 39,
                "meaning": "Bury"
            },
            {
                "kanji": "幕",
                "level": 34,
                "meaning": "Curtain"
            }
        ]
    },
    "同": {
        "level": 5,
        "meaning": "Same",
        "similar": [
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            }
        ]
    },
    "皮": {
        "level": 5,
        "meaning": "Skin",
        "similar": []
    },
    "回": {
        "level": 5,
        "meaning": "Times",
        "similar": [
            {
                "kanji": "固",
                "level": 14,
                "meaning": "Hard"
            }
        ]
    },
    "雨": {
        "level": 5,
        "meaning": "Rain",
        "similar": []
    },
    "図": {
        "level": 5,
        "meaning": "Diagram",
        "similar": [
            {
                "kanji": "因",
                "level": 17,
                "meaning": "Cause"
            }
        ]
    },
    "青": {
        "level": 5,
        "meaning": "Blue",
        "similar": [
            {
                "kanji": "情",
                "level": 13,
                "meaning": "Feeling"
            },
            {
                "kanji": "清",
                "level": 28,
                "meaning": "Pure"
            }
        ]
    },
    "来": {
        "level": 5,
        "meaning": "Come",
        "similar": [
            {
                "kanji": "米",
                "level": 5,
                "meaning": "Rice"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            },
            {
                "kanji": "平",
                "level": 4,
                "meaning": "Flat"
            },
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "殊",
                "level": 52,
                "meaning": "Especially"
            }
        ]
    },
    "林": {
        "level": 5,
        "meaning": "Forest",
        "similar": [
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "柄",
                "level": 42,
                "meaning": "Pattern"
            },
            {
                "kanji": "材",
                "level": 14,
                "meaning": "Lumber"
            },
            {
                "kanji": "板",
                "level": 29,
                "meaning": "Board"
            },
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            },
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            },
            {
                "kanji": "枝",
                "level": 34,
                "meaning": "Branch"
            },
            {
                "kanji": "校",
                "level": 7,
                "meaning": "School"
            }
        ]
    },
    "音": {
        "level": 5,
        "meaning": "Sound",
        "similar": [
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "暗",
                "level": 13,
                "meaning": "Dark"
            },
            {
                "kanji": "滝",
                "level": 45,
                "meaning": "Waterfall"
            },
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            }
        ]
    },
    "行": {
        "level": 5,
        "meaning": "Go",
        "similar": []
    },
    "声": {
        "level": 5,
        "meaning": "Voice",
        "similar": []
    },
    "多": {
        "level": 5,
        "meaning": "Many",
        "similar": []
    },
    "社": {
        "level": 5,
        "meaning": "Company",
        "similar": [
            {
                "kanji": "祉",
                "level": 39,
                "meaning": "Welfare"
            }
        ]
    },
    "西": {
        "level": 5,
        "meaning": "West",
        "similar": [
            {
                "kanji": "四",
                "level": 2,
                "meaning": "Four"
            }
        ]
    },
    "角": {
        "level": 5,
        "meaning": "Angle",
        "similar": []
    },
    "言": {
        "level": 5,
        "meaning": "Say",
        "similar": [
            {
                "kanji": "訂",
                "level": 50,
                "meaning": "Revise"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "信",
                "level": 15,
                "meaning": "Believe"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            },
            {
                "kanji": "君",
                "level": 8,
                "meaning": "Buddy"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "害",
                "level": 20,
                "meaning": "Damage"
            }
        ]
    },
    "空": {
        "level": 5,
        "meaning": "Sky",
        "similar": [
            {
                "kanji": "突",
                "level": 26,
                "meaning": "Stab"
            },
            {
                "kanji": "控",
                "level": 39,
                "meaning": "Abstain"
            },
            {
                "kanji": "窒",
                "level": 56,
                "meaning": "Suffocate"
            }
        ]
    },
    "学": {
        "level": 5,
        "meaning": "Study",
        "similar": [
            {
                "kanji": "浮",
                "level": 30,
                "meaning": "Float"
            }
        ]
    },
    "毎": {
        "level": 5,
        "meaning": "Every",
        "similar": [
            {
                "kanji": "侮",
                "level": 59,
                "meaning": "Despise"
            }
        ]
    },
    "谷": {
        "level": 5,
        "meaning": "Valley",
        "similar": [
            {
                "kanji": "俗",
                "level": 49,
                "meaning": "Vulgar"
            },
            {
                "kanji": "沿",
                "level": 34,
                "meaning": "Run"
            },
            {
                "kanji": "各",
                "level": 22,
                "meaning": "Each"
            },
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            },
            {
                "kanji": "容",
                "level": 19,
                "meaning": "Form"
            }
        ]
    },
    "米": {
        "level": 5,
        "meaning": "Rice",
        "similar": [
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            }
        ]
    },
    "走": {
        "level": 5,
        "meaning": "Run",
        "similar": [
            {
                "kanji": "赴",
                "level": 55,
                "meaning": "Proceed"
            }
        ]
    },
    "交": {
        "level": 5,
        "meaning": "Mix",
        "similar": [
            {
                "kanji": "衣",
                "level": 41,
                "meaning": "Clothes"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            }
        ]
    },
    "麦": {
        "level": 5,
        "meaning": "Wheat",
        "similar": [
            {
                "kanji": "坂",
                "level": 15,
                "meaning": "Slope"
            },
            {
                "kanji": "表",
                "level": 9,
                "meaning": "Express"
            },
            {
                "kanji": "抜",
                "level": 25,
                "meaning": "Extract"
            }
        ]
    },
    "会": {
        "level": 5,
        "meaning": "Meet",
        "similar": [
            {
                "kanji": "伝",
                "level": 11,
                "meaning": "Transmit"
            },
            {
                "kanji": "余",
                "level": 20,
                "meaning": "Surplus"
            }
        ]
    },
    "弟": {
        "level": 5,
        "meaning": "Younger Brother",
        "similar": []
    },
    "当": {
        "level": 5,
        "meaning": "Correct",
        "similar": []
    },
    "体": {
        "level": 5,
        "meaning": "Body",
        "similar": [
            {
                "kanji": "休",
                "level": 4,
                "meaning": "Rest"
            },
            {
                "kanji": "本",
                "level": 2,
                "meaning": "Book"
            },
            {
                "kanji": "伏",
                "level": 55,
                "meaning": "Bow"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            }
        ]
    },
    "何": {
        "level": 5,
        "meaning": "What",
        "similar": [
            {
                "kanji": "使",
                "level": 9,
                "meaning": "Use"
            },
            {
                "kanji": "奇",
                "level": 28,
                "meaning": "Odd"
            },
            {
                "kanji": "可",
                "level": 18,
                "meaning": "Possible"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            },
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "向",
                "level": 6,
                "meaning": "Yonder"
            },
            {
                "kanji": "仲",
                "level": 11,
                "meaning": "Relationship"
            }
        ]
    },
    "作": {
        "level": 5,
        "meaning": "Make",
        "similar": [
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            }
        ]
    },
    "形": {
        "level": 5,
        "meaning": "Shape",
        "similar": []
    },
    "羽": {
        "level": 5,
        "meaning": "Feather",
        "similar": []
    },
    "近": {
        "level": 5,
        "meaning": "Near",
        "similar": [
            {
                "kanji": "迅",
                "level": 48,
                "meaning": "Swift"
            },
            {
                "kanji": "迎",
                "level": 32,
                "meaning": "Welcome"
            },
            {
                "kanji": "逝",
                "level": 60,
                "meaning": "Die"
            }
        ]
    },
    "思": {
        "level": 6,
        "meaning": "Think",
        "similar": [
            {
                "kanji": "息",
                "level": 12,
                "meaning": "Breath"
            },
            {
                "kanji": "恵",
                "level": 37,
                "meaning": "Favor"
            },
            {
                "kanji": "恩",
                "level": 32,
                "meaning": "Kindness"
            }
        ]
    },
    "点": {
        "level": 6,
        "meaning": "Point",
        "similar": []
    },
    "全": {
        "level": 6,
        "meaning": "All",
        "similar": [
            {
                "kanji": "生",
                "level": 3,
                "meaning": "Life"
            },
            {
                "kanji": "狂",
                "level": 45,
                "meaning": "Lunatic"
            },
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            }
        ]
    },
    "前": {
        "level": 6,
        "meaning": "Front",
        "similar": [
            {
                "kanji": "削",
                "level": 37,
                "meaning": "Whittle"
            },
            {
                "kanji": "愉",
                "level": 55,
                "meaning": "Pleasant"
            }
        ]
    },
    "化": {
        "level": 6,
        "meaning": "Change",
        "similar": []
    },
    "茶": {
        "level": 6,
        "meaning": "Tea",
        "similar": [
            {
                "kanji": "菊",
                "level": 46,
                "meaning": "Chrysanthemum"
            }
        ]
    },
    "南": {
        "level": 6,
        "meaning": "South",
        "similar": [
            {
                "kanji": "幸",
                "level": 16,
                "meaning": "Happiness"
            },
            {
                "kanji": "献",
                "level": 36,
                "meaning": "Offer"
            }
        ]
    },
    "向": {
        "level": 6,
        "meaning": "Yonder",
        "similar": [
            {
                "kanji": "尚",
                "level": 54,
                "meaning": "Furthermore"
            },
            {
                "kanji": "否",
                "level": 33,
                "meaning": "No"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            },
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            }
        ]
    },
    "画": {
        "level": 6,
        "meaning": "Drawing",
        "similar": [
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            }
        ]
    },
    "長": {
        "level": 6,
        "meaning": "Long",
        "similar": [
            {
                "kanji": "張",
                "level": 23,
                "meaning": "Stretch"
            },
            {
                "kanji": "帳",
                "level": 48,
                "meaning": "Notebook"
            }
        ]
    },
    "明": {
        "level": 6,
        "meaning": "Bright",
        "similar": [
            {
                "kanji": "門",
                "level": 16,
                "meaning": "Gates"
            },
            {
                "kanji": "胃",
                "level": 27,
                "meaning": "Stomach"
            }
        ]
    },
    "星": {
        "level": 6,
        "meaning": "Star",
        "similar": [
            {
                "kanji": "皇",
                "level": 33,
                "meaning": "Emperor"
            },
            {
                "kanji": "里",
                "level": 5,
                "meaning": "Home"
            },
            {
                "kanji": "時",
                "level": 7,
                "meaning": "Time"
            },
            {
                "kanji": "睡",
                "level": 27,
                "meaning": "Drowsy"
            }
        ]
    },
    "曲": {
        "level": 6,
        "meaning": "Music",
        "similar": [
            {
                "kanji": "由",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "田",
                "level": 2,
                "meaning": "Rice"
            }
        ]
    },
    "直": {
        "level": 6,
        "meaning": "Fix",
        "similar": [
            {
                "kanji": "値",
                "level": 22,
                "meaning": "Value"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "真",
                "level": 16,
                "meaning": "Reality"
            }
        ]
    },
    "国": {
        "level": 6,
        "meaning": "Country",
        "similar": []
    },
    "有": {
        "level": 6,
        "meaning": "Have",
        "similar": []
    },
    "地": {
        "level": 6,
        "meaning": "Earth",
        "similar": []
    },
    "東": {
        "level": 6,
        "meaning": "East",
        "similar": [
            {
                "kanji": "更",
                "level": 30,
                "meaning": "Again"
            },
            {
                "kanji": "凍",
                "level": 28,
                "meaning": "Frozen"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "某",
                "level": 60,
                "meaning": "Certain"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "軟",
                "level": 51,
                "meaning": "Soft"
            },
            {
                "kanji": "陳",
                "level": 52,
                "meaning": "Exhibit"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            }
        ]
    },
    "知": {
        "level": 6,
        "meaning": "Know",
        "similar": [
            {
                "kanji": "和",
                "level": 9,
                "meaning": "Peace"
            },
            {
                "kanji": "君",
                "level": 8,
                "meaning": "Buddy"
            },
            {
                "kanji": "唇",
                "level": 47,
                "meaning": "Lips"
            }
        ]
    },
    "血": {
        "level": 6,
        "meaning": "Blood",
        "similar": [
            {
                "kanji": "皿",
                "level": 4,
                "meaning": "Plate"
            }
        ]
    },
    "食": {
        "level": 6,
        "meaning": "Eat",
        "similar": [
            {
                "kanji": "娘",
                "level": 29,
                "meaning": "Daughter"
            },
            {
                "kanji": "良",
                "level": 11,
                "meaning": "Good"
            },
            {
                "kanji": "飢",
                "level": 48,
                "meaning": "Starve"
            },
            {
                "kanji": "浪",
                "level": 59,
                "meaning": "Wander"
            }
        ]
    },
    "夜": {
        "level": 6,
        "meaning": "Night",
        "similar": [
            {
                "kanji": "液",
                "level": 32,
                "meaning": "Fluid"
            }
        ]
    },
    "首": {
        "level": 6,
        "meaning": "Neck",
        "similar": [
            {
                "kanji": "盾",
                "level": 48,
                "meaning": "Shield"
            },
            {
                "kanji": "看",
                "level": 23,
                "meaning": "Watch"
            },
            {
                "kanji": "省",
                "level": 21,
                "meaning": "Conserve"
            },
            {
                "kanji": "道",
                "level": 8,
                "meaning": "Road"
            },
            {
                "kanji": "着",
                "level": 12,
                "meaning": "Wear"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            }
        ]
    },
    "妹": {
        "level": 6,
        "meaning": "Younger Sister",
        "similar": [
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "娠",
                "level": 38,
                "meaning": "Pregnant"
            }
        ]
    },
    "私": {
        "level": 6,
        "meaning": "I",
        "similar": [
            {
                "kanji": "利",
                "level": 11,
                "meaning": "Profit"
            },
            {
                "kanji": "朴",
                "level": 55,
                "meaning": "Simple"
            }
        ]
    },
    "姉": {
        "level": 6,
        "meaning": "Older Sister",
        "similar": [
            {
                "kanji": "妨",
                "level": 20,
                "meaning": "Obstruct"
            }
        ]
    },
    "科": {
        "level": 6,
        "meaning": "Course",
        "similar": [
            {
                "kanji": "料",
                "level": 13,
                "meaning": "Fee"
            },
            {
                "kanji": "斜",
                "level": 48,
                "meaning": "Diagonal"
            }
        ]
    },
    "次": {
        "level": 6,
        "meaning": "Next",
        "similar": []
    },
    "歩": {
        "level": 6,
        "meaning": "Walk",
        "similar": [
            {
                "kanji": "渉",
                "level": 17,
                "meaning": "Ford"
            }
        ]
    },
    "死": {
        "level": 6,
        "meaning": "Death",
        "similar": []
    },
    "安": {
        "level": 6,
        "meaning": "Relax",
        "similar": []
    },
    "室": {
        "level": 6,
        "meaning": "Room",
        "similar": [
            {
                "kanji": "窒",
                "level": 56,
                "meaning": "Suffocate"
            }
        ]
    },
    "活": {
        "level": 6,
        "meaning": "Lively",
        "similar": [
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "沿",
                "level": 34,
                "meaning": "Run"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            }
        ]
    },
    "海": {
        "level": 6,
        "meaning": "Sea",
        "similar": [
            {
                "kanji": "悔",
                "level": 48,
                "meaning": "Regret"
            }
        ]
    },
    "州": {
        "level": 6,
        "meaning": "State",
        "similar": []
    },
    "両": {
        "level": 6,
        "meaning": "Both",
        "similar": []
    },
    "店": {
        "level": 6,
        "meaning": "Shop",
        "similar": []
    },
    "亡": {
        "level": 6,
        "meaning": "Death",
        "similar": []
    },
    "京": {
        "level": 6,
        "meaning": "Capital",
        "similar": [
            {
                "kanji": "涼",
                "level": 46,
                "meaning": "Cool"
            }
        ]
    },
    "羊": {
        "level": 6,
        "meaning": "Sheep",
        "similar": [
            {
                "kanji": "半",
                "level": 3,
                "meaning": "Half"
            },
            {
                "kanji": "判",
                "level": 21,
                "meaning": "Judge"
            }
        ]
    },
    "後": {
        "level": 6,
        "meaning": "Behind",
        "similar": []
    },
    "通": {
        "level": 7,
        "meaning": "Pass Through",
        "similar": []
    },
    "週": {
        "level": 7,
        "meaning": "Week",
        "similar": [
            {
                "kanji": "造",
                "level": 26,
                "meaning": "Create"
            },
            {
                "kanji": "彫",
                "level": 35,
                "meaning": "Carve"
            },
            {
                "kanji": "周",
                "level": 14,
                "meaning": "Circumference"
            }
        ]
    },
    "船": {
        "level": 7,
        "meaning": "Boat",
        "similar": []
    },
    "理": {
        "level": 7,
        "meaning": "Reason",
        "similar": [
            {
                "kanji": "埋",
                "level": 39,
                "meaning": "Bury"
            },
            {
                "kanji": "班",
                "level": 48,
                "meaning": "Squad"
            },
            {
                "kanji": "現",
                "level": 23,
                "meaning": "Present"
            },
            {
                "kanji": "重",
                "level": 9,
                "meaning": "Heavy"
            }
        ]
    },
    "由": {
        "level": 7,
        "meaning": "Reason",
        "similar": [
            {
                "kanji": "田",
                "level": 2,
                "meaning": "Rice"
            },
            {
                "kanji": "曲",
                "level": 6,
                "meaning": "Music"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "男",
                "level": 4,
                "meaning": "Man"
            },
            {
                "kanji": "町",
                "level": 4,
                "meaning": "Town"
            }
        ]
    },
    "教": {
        "level": 7,
        "meaning": "Teach",
        "similar": [
            {
                "kanji": "赦",
                "level": 58,
                "meaning": "Pardon"
            }
        ]
    },
    "時": {
        "level": 7,
        "meaning": "Time",
        "similar": [
            {
                "kanji": "転",
                "level": 10,
                "meaning": "Revolve"
            },
            {
                "kanji": "異",
                "level": 33,
                "meaning": "Differ"
            },
            {
                "kanji": "里",
                "level": 5,
                "meaning": "Home"
            },
            {
                "kanji": "星",
                "level": 6,
                "meaning": "Star"
            },
            {
                "kanji": "皇",
                "level": 33,
                "meaning": "Emperor"
            },
            {
                "kanji": "専",
                "level": 16,
                "meaning": "Specialty"
            }
        ]
    },
    "雪": {
        "level": 7,
        "meaning": "Snow",
        "similar": []
    },
    "未": {
        "level": 7,
        "meaning": "Not Yet",
        "similar": [
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "木",
                "level": 2,
                "meaning": "Tree"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            },
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            }
        ]
    },
    "末": {
        "level": 7,
        "meaning": "End",
        "similar": [
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "木",
                "level": 2,
                "meaning": "Tree"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            },
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            }
        ]
    },
    "札": {
        "level": 7,
        "meaning": "Bill",
        "similar": []
    },
    "校": {
        "level": 7,
        "meaning": "School",
        "similar": [
            {
                "kanji": "板",
                "level": 29,
                "meaning": "Board"
            },
            {
                "kanji": "核",
                "level": 36,
                "meaning": "Nucleus"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            }
        ]
    },
    "風": {
        "level": 7,
        "meaning": "Wind",
        "similar": [
            {
                "kanji": "独",
                "level": 26,
                "meaning": "Alone"
            }
        ]
    },
    "夏": {
        "level": 7,
        "meaning": "Summer",
        "similar": [
            {
                "kanji": "更",
                "level": 30,
                "meaning": "Again"
            },
            {
                "kanji": "臭",
                "level": 20,
                "meaning": "Stinking"
            },
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            }
        ]
    },
    "失": {
        "level": 7,
        "meaning": "Fault",
        "similar": [
            {
                "kanji": "矢",
                "level": 3,
                "meaning": "Arrow"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            }
        ]
    },
    "記": {
        "level": 7,
        "meaning": "Write Down",
        "similar": [
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "訂",
                "level": 50,
                "meaning": "Revise"
            },
            {
                "kanji": "訪",
                "level": 27,
                "meaning": "Visit"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "訳",
                "level": 32,
                "meaning": "Translation"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            }
        ]
    },
    "高": {
        "level": 7,
        "meaning": "Tall",
        "similar": []
    },
    "欠": {
        "level": 7,
        "meaning": "Lack",
        "similar": [
            {
                "kanji": "父",
                "level": 3,
                "meaning": "Father"
            }
        ]
    },
    "魚": {
        "level": 7,
        "meaning": "Fish",
        "similar": [
            {
                "kanji": "漁",
                "level": 37,
                "meaning": "Fishing"
            }
        ]
    },
    "家": {
        "level": 7,
        "meaning": "House",
        "similar": [
            {
                "kanji": "塚",
                "level": 51,
                "meaning": "Mound"
            },
            {
                "kanji": "嫁",
                "level": 45,
                "meaning": "Bride"
            },
            {
                "kanji": "豪",
                "level": 31,
                "meaning": "Luxurious"
            }
        ]
    },
    "氏": {
        "level": 7,
        "meaning": "Family Name",
        "similar": []
    },
    "民": {
        "level": 7,
        "meaning": "Peoples",
        "similar": []
    },
    "鳥": {
        "level": 7,
        "meaning": "Bird",
        "similar": [
            {
                "kanji": "鳴",
                "level": 10,
                "meaning": "Chirp"
            }
        ]
    },
    "紙": {
        "level": 7,
        "meaning": "Paper",
        "similar": [
            {
                "kanji": "級",
                "level": 11,
                "meaning": "Level"
            },
            {
                "kanji": "紀",
                "level": 15,
                "meaning": "Account"
            },
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "紛",
                "level": 42,
                "meaning": "Distract"
            },
            {
                "kanji": "純",
                "level": 34,
                "meaning": "Pure"
            },
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            },
            {
                "kanji": "約",
                "level": 14,
                "meaning": "Promise"
            }
        ]
    },
    "組": {
        "level": 7,
        "meaning": "Group",
        "similar": [
            {
                "kanji": "紳",
                "level": 56,
                "meaning": "Gentleman"
            }
        ]
    },
    "黄": {
        "level": 7,
        "meaning": "Yellow",
        "similar": [
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "横",
                "level": 10,
                "meaning": "Side"
            },
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "苗",
                "level": 51,
                "meaning": "Seedling"
            },
            {
                "kanji": "貫",
                "level": 52,
                "meaning": "Pierce"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            }
        ]
    },
    "黒": {
        "level": 7,
        "meaning": "Black",
        "similar": [
            {
                "kanji": "墨",
                "level": 46,
                "meaning": "Black"
            },
            {
                "kanji": "黙",
                "level": 46,
                "meaning": "Shut"
            }
        ]
    },
    "付": {
        "level": 7,
        "meaning": "Attach",
        "similar": [
            {
                "kanji": "代",
                "level": 4,
                "meaning": "Substitute"
            }
        ]
    },
    "以": {
        "level": 7,
        "meaning": "From",
        "similar": [
            {
                "kanji": "似",
                "level": 31,
                "meaning": "Resemble"
            }
        ]
    },
    "弱": {
        "level": 7,
        "meaning": "Weak",
        "similar": []
    },
    "強": {
        "level": 7,
        "meaning": "Strong",
        "similar": []
    },
    "辺": {
        "level": 7,
        "meaning": "Area",
        "similar": []
    },
    "必": {
        "level": 7,
        "meaning": "Certain",
        "similar": []
    },
    "者": {
        "level": 8,
        "meaning": "Someone",
        "similar": [
            {
                "kanji": "春",
                "level": 15,
                "meaning": "Spring"
            },
            {
                "kanji": "百",
                "level": 4,
                "meaning": "Hundred"
            },
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "著",
                "level": 33,
                "meaning": "Author"
            },
            {
                "kanji": "都",
                "level": 12,
                "meaning": "Metropolis"
            }
        ]
    },
    "道": {
        "level": 8,
        "meaning": "Road",
        "similar": [
            {
                "kanji": "導",
                "level": 23,
                "meaning": "Lead"
            },
            {
                "kanji": "首",
                "level": 6,
                "meaning": "Neck"
            }
        ]
    },
    "所": {
        "level": 8,
        "meaning": "Place",
        "similar": []
    },
    "投": {
        "level": 8,
        "meaning": "Throw",
        "similar": [
            {
                "kanji": "披",
                "level": 53,
                "meaning": "Expose"
            },
            {
                "kanji": "技",
                "level": 14,
                "meaning": "Skill"
            },
            {
                "kanji": "扱",
                "level": 38,
                "meaning": "Handle"
            },
            {
                "kanji": "没",
                "level": 52,
                "meaning": "Die"
            },
            {
                "kanji": "抜",
                "level": 25,
                "meaning": "Extract"
            }
        ]
    },
    "助": {
        "level": 8,
        "meaning": "Help",
        "similar": []
    },
    "医": {
        "level": 8,
        "meaning": "Medicine",
        "similar": [
            {
                "kanji": "枢",
                "level": 42,
                "meaning": "Hinge"
            }
        ]
    },
    "反": {
        "level": 8,
        "meaning": "Anti",
        "similar": [
            {
                "kanji": "友",
                "level": 3,
                "meaning": "Friend"
            },
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "支",
                "level": 8,
                "meaning": "Support"
            },
            {
                "kanji": "久",
                "level": 32,
                "meaning": "Long"
            }
        ]
    },
    "君": {
        "level": 8,
        "meaning": "Buddy",
        "similar": [
            {
                "kanji": "知",
                "level": 6,
                "meaning": "Know"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            },
            {
                "kanji": "石",
                "level": 4,
                "meaning": "Stone"
            },
            {
                "kanji": "郡",
                "level": 51,
                "meaning": "County"
            }
        ]
    },
    "支": {
        "level": 8,
        "meaning": "Support",
        "similar": [
            {
                "kanji": "反",
                "level": 8,
                "meaning": "Anti"
            },
            {
                "kanji": "友",
                "level": 3,
                "meaning": "Friend"
            }
        ]
    },
    "番": {
        "level": 8,
        "meaning": "Number In A Series",
        "similar": [
            {
                "kanji": "審",
                "level": 21,
                "meaning": "Judge"
            },
            {
                "kanji": "香",
                "level": 37,
                "meaning": "Fragrance"
            }
        ]
    },
    "数": {
        "level": 8,
        "meaning": "Count",
        "similar": [
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            },
            {
                "kanji": "断",
                "level": 21,
                "meaning": "Cut"
            }
        ]
    },
    "間": {
        "level": 8,
        "meaning": "Interval",
        "similar": [
            {
                "kanji": "晶",
                "level": 50,
                "meaning": "Crystal"
            },
            {
                "kanji": "問",
                "level": 13,
                "meaning": "Problem"
            },
            {
                "kanji": "聞",
                "level": 10,
                "meaning": "Hear"
            }
        ]
    },
    "雲": {
        "level": 8,
        "meaning": "Cloud",
        "similar": [
            {
                "kanji": "曇",
                "level": 45,
                "meaning": "Cloudy"
            },
            {
                "kanji": "霊",
                "level": 45,
                "meaning": "Ghost"
            }
        ]
    },
    "電": {
        "level": 8,
        "meaning": "Electricity",
        "similar": [
            {
                "kanji": "雷",
                "level": 44,
                "meaning": "Thunder"
            },
            {
                "kanji": "霜",
                "level": 48,
                "meaning": "Frost"
            }
        ]
    },
    "朝": {
        "level": 8,
        "meaning": "Morning",
        "similar": [
            {
                "kanji": "潮",
                "level": 43,
                "meaning": "Tide"
            },
            {
                "kanji": "乾",
                "level": 29,
                "meaning": "Dry"
            },
            {
                "kanji": "幹",
                "level": 23,
                "meaning": "Tree"
            }
        ]
    },
    "研": {
        "level": 8,
        "meaning": "Sharpen",
        "similar": []
    },
    "場": {
        "level": 8,
        "meaning": "Location",
        "similar": [
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            },
            {
                "kanji": "湯",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "陽",
                "level": 12,
                "meaning": "Sunshine"
            },
            {
                "kanji": "堤",
                "level": 50,
                "meaning": "Embankment"
            },
            {
                "kanji": "募",
                "level": 37,
                "meaning": "Recruit"
            },
            {
                "kanji": "傷",
                "level": 32,
                "meaning": "Wound"
            },
            {
                "kanji": "腸",
                "level": 57,
                "meaning": "Intestines"
            }
        ]
    },
    "森": {
        "level": 8,
        "meaning": "Forest",
        "similar": [
            {
                "kanji": "禁",
                "level": 18,
                "meaning": "Prohibit"
            }
        ]
    },
    "楽": {
        "level": 8,
        "meaning": "Comfort",
        "similar": [
            {
                "kanji": "薬",
                "level": 17,
                "meaning": "Medicine"
            }
        ]
    },
    "馬": {
        "level": 8,
        "meaning": "Horse",
        "similar": [
            {
                "kanji": "焦",
                "level": 42,
                "meaning": "Char"
            },
            {
                "kanji": "駅",
                "level": 13,
                "meaning": "Station"
            },
            {
                "kanji": "駆",
                "level": 40,
                "meaning": "Gallop"
            },
            {
                "kanji": "駄",
                "level": 50,
                "meaning": "Burdensome"
            }
        ]
    },
    "話": {
        "level": 8,
        "meaning": "Talk",
        "similar": [
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "調",
                "level": 10,
                "meaning": "Investigate"
            },
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            }
        ]
    },
    "究": {
        "level": 8,
        "meaning": "Research",
        "similar": [
            {
                "kanji": "突",
                "level": 26,
                "meaning": "Stab"
            }
        ]
    },
    "答": {
        "level": 8,
        "meaning": "Answer",
        "similar": [
            {
                "kanji": "筒",
                "level": 43,
                "meaning": "Cylinder"
            }
        ]
    },
    "対": {
        "level": 8,
        "meaning": "Versus",
        "similar": [
            {
                "kanji": "府",
                "level": 16,
                "meaning": "Government"
            },
            {
                "kanji": "庁",
                "level": 24,
                "meaning": "Agency"
            },
            {
                "kanji": "村",
                "level": 4,
                "meaning": "Village"
            }
        ]
    },
    "局": {
        "level": 8,
        "meaning": "Bureau",
        "similar": [
            {
                "kanji": "居",
                "level": 25,
                "meaning": "Alive"
            },
            {
                "kanji": "句",
                "level": 18,
                "meaning": "Paragraph"
            }
        ]
    },
    "池": {
        "level": 8,
        "meaning": "Pond",
        "similar": []
    },
    "決": {
        "level": 8,
        "meaning": "Decide",
        "similar": [
            {
                "kanji": "沢",
                "level": 23,
                "meaning": "Swamp"
            },
            {
                "kanji": "快",
                "level": 30,
                "meaning": "Pleasant"
            },
            {
                "kanji": "沸",
                "level": 51,
                "meaning": "Boil"
            },
            {
                "kanji": "涙",
                "level": 44,
                "meaning": "Teardrop"
            }
        ]
    },
    "買": {
        "level": 8,
        "meaning": "Buy",
        "similar": [
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "置",
                "level": 22,
                "meaning": "Put"
            }
        ]
    },
    "絵": {
        "level": 8,
        "meaning": "Drawing",
        "similar": [
            {
                "kanji": "給",
                "level": 27,
                "meaning": "Salary"
            }
        ]
    },
    "身": {
        "level": 8,
        "meaning": "Somebody",
        "similar": [
            {
                "kanji": "射",
                "level": 34,
                "meaning": "Shoot"
            }
        ]
    },
    "住": {
        "level": 8,
        "meaning": "Dwelling",
        "similar": [
            {
                "kanji": "往",
                "level": 26,
                "meaning": "Depart"
            },
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            },
            {
                "kanji": "主",
                "level": 4,
                "meaning": "Master"
            },
            {
                "kanji": "狂",
                "level": 45,
                "meaning": "Lunatic"
            },
            {
                "kanji": "仕",
                "level": 4,
                "meaning": "Doing"
            },
            {
                "kanji": "生",
                "level": 3,
                "meaning": "Life"
            },
            {
                "kanji": "全",
                "level": 6,
                "meaning": "All"
            }
        ]
    },
    "役": {
        "level": 8,
        "meaning": "Service",
        "similar": [
            {
                "kanji": "彼",
                "level": 35,
                "meaning": "He"
            },
            {
                "kanji": "般",
                "level": 36,
                "meaning": "Generally"
            }
        ]
    },
    "送": {
        "level": 9,
        "meaning": "Send",
        "similar": [
            {
                "kanji": "迭",
                "level": 58,
                "meaning": "Alternate"
            },
            {
                "kanji": "迷",
                "level": 27,
                "meaning": "Astray"
            }
        ]
    },
    "部": {
        "level": 9,
        "meaning": "Part",
        "similar": [
            {
                "kanji": "郡",
                "level": 51,
                "meaning": "County"
            },
            {
                "kanji": "剖",
                "level": 58,
                "meaning": "Divide"
            }
        ]
    },
    "具": {
        "level": 9,
        "meaning": "Tool",
        "similar": [
            {
                "kanji": "真",
                "level": 16,
                "meaning": "Reality"
            },
            {
                "kanji": "臭",
                "level": 20,
                "meaning": "Stinking"
            },
            {
                "kanji": "見",
                "level": 4,
                "meaning": "See"
            },
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            }
        ]
    },
    "重": {
        "level": 9,
        "meaning": "Heavy",
        "similar": [
            {
                "kanji": "里",
                "level": 5,
                "meaning": "Home"
            },
            {
                "kanji": "皇",
                "level": 33,
                "meaning": "Emperor"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            },
            {
                "kanji": "動",
                "level": 12,
                "meaning": "Move"
            },
            {
                "kanji": "理",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "埋",
                "level": 39,
                "meaning": "Bury"
            }
        ]
    },
    "物": {
        "level": 9,
        "meaning": "Thing",
        "similar": [
            {
                "kanji": "牧",
                "level": 43,
                "meaning": "Pasture"
            }
        ]
    },
    "勝": {
        "level": 9,
        "meaning": "Win",
        "similar": []
    },
    "苦": {
        "level": 9,
        "meaning": "Suffering",
        "similar": [
            {
                "kanji": "若",
                "level": 19,
                "meaning": "Young"
            },
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            }
        ]
    },
    "持": {
        "level": 9,
        "meaning": "Hold",
        "similar": [
            {
                "kanji": "特",
                "level": 11,
                "meaning": "Special"
            },
            {
                "kanji": "掛",
                "level": 25,
                "meaning": "Hang"
            }
        ]
    },
    "受": {
        "level": 9,
        "meaning": "Accept",
        "similar": [
            {
                "kanji": "授",
                "level": 26,
                "meaning": "Instruct"
            }
        ]
    },
    "和": {
        "level": 9,
        "meaning": "Peace",
        "similar": [
            {
                "kanji": "知",
                "level": 6,
                "meaning": "Know"
            },
            {
                "kanji": "利",
                "level": 11,
                "meaning": "Profit"
            },
            {
                "kanji": "粘",
                "level": 47,
                "meaning": "Sticky"
            }
        ]
    },
    "界": {
        "level": 9,
        "meaning": "World",
        "similar": [
            {
                "kanji": "畔",
                "level": 60,
                "meaning": "Shore"
            }
        ]
    },
    "新": {
        "level": 9,
        "meaning": "New",
        "similar": [
            {
                "kanji": "粋",
                "level": 34,
                "meaning": "Stylish"
            },
            {
                "kanji": "断",
                "level": 21,
                "meaning": "Cut"
            }
        ]
    },
    "発": {
        "level": 9,
        "meaning": "Departure",
        "similar": [
            {
                "kanji": "廃",
                "level": 36,
                "meaning": "Obsolete"
            }
        ]
    },
    "相": {
        "level": 9,
        "meaning": "Mutual",
        "similar": [
            {
                "kanji": "想",
                "level": 13,
                "meaning": "Concept"
            }
        ]
    },
    "県": {
        "level": 9,
        "meaning": "Prefecture",
        "similar": [
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            }
        ]
    },
    "服": {
        "level": 9,
        "meaning": "Clothes",
        "similar": []
    },
    "表": {
        "level": 9,
        "meaning": "Express",
        "similar": [
            {
                "kanji": "俵",
                "level": 46,
                "meaning": "Sack"
            },
            {
                "kanji": "衣",
                "level": 41,
                "meaning": "Clothes"
            },
            {
                "kanji": "麦",
                "level": 5,
                "meaning": "Wheat"
            }
        ]
    },
    "売": {
        "level": 9,
        "meaning": "Sell",
        "similar": [
            {
                "kanji": "老",
                "level": 11,
                "meaning": "Elderly"
            }
        ]
    },
    "要": {
        "level": 9,
        "meaning": "Need",
        "similar": [
            {
                "kanji": "腰",
                "level": 24,
                "meaning": "Waist"
            }
        ]
    },
    "験": {
        "level": 9,
        "meaning": "Test",
        "similar": [
            {
                "kanji": "騎",
                "level": 48,
                "meaning": "Horse"
            },
            {
                "kanji": "駅",
                "level": 13,
                "meaning": "Station"
            },
            {
                "kanji": "騒",
                "level": 30,
                "meaning": "Boisterous"
            }
        ]
    },
    "試": {
        "level": 9,
        "meaning": "Try",
        "similar": [
            {
                "kanji": "誌",
                "level": 33,
                "meaning": "Magazine"
            },
            {
                "kanji": "誠",
                "level": 41,
                "meaning": "Sincerity"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "証",
                "level": 16,
                "meaning": "Evidence"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            }
        ]
    },
    "談": {
        "level": 9,
        "meaning": "Discuss",
        "similar": [
            {
                "kanji": "診",
                "level": 29,
                "meaning": "Diagnose"
            }
        ]
    },
    "定": {
        "level": 9,
        "meaning": "Determine",
        "similar": [
            {
                "kanji": "実",
                "level": 9,
                "meaning": "Truth"
            }
        ]
    },
    "実": {
        "level": 9,
        "meaning": "Truth",
        "similar": [
            {
                "kanji": "突",
                "level": 26,
                "meaning": "Stab"
            },
            {
                "kanji": "定",
                "level": 9,
                "meaning": "Determine"
            },
            {
                "kanji": "完",
                "level": 14,
                "meaning": "Perfect"
            },
            {
                "kanji": "宗",
                "level": 29,
                "meaning": "Religion"
            },
            {
                "kanji": "案",
                "level": 22,
                "meaning": "Plan"
            }
        ]
    },
    "客": {
        "level": 9,
        "meaning": "Guest",
        "similar": [
            {
                "kanji": "容",
                "level": 19,
                "meaning": "Form"
            }
        ]
    },
    "屋": {
        "level": 9,
        "meaning": "Roof",
        "similar": [
            {
                "kanji": "握",
                "level": 42,
                "meaning": "Grip"
            }
        ]
    },
    "負": {
        "level": 9,
        "meaning": "Lose",
        "similar": [
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            },
            {
                "kanji": "貞",
                "level": 51,
                "meaning": "Chastity"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "側",
                "level": 17,
                "meaning": "Side"
            },
            {
                "kanji": "貧",
                "level": 30,
                "meaning": "Poor"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "原",
                "level": 17,
                "meaning": "Original"
            }
        ]
    },
    "泳": {
        "level": 9,
        "meaning": "Swim",
        "similar": []
    },
    "乗": {
        "level": 9,
        "meaning": "Ride",
        "similar": [
            {
                "kanji": "剰",
                "level": 53,
                "meaning": "Surplus"
            }
        ]
    },
    "予": {
        "level": 9,
        "meaning": "Beforehand",
        "similar": []
    },
    "事": {
        "level": 9,
        "meaning": "Action",
        "similar": []
    },
    "度": {
        "level": 9,
        "meaning": "Degrees",
        "similar": [
            {
                "kanji": "渡",
                "level": 25,
                "meaning": "Transit"
            },
            {
                "kanji": "席",
                "level": 17,
                "meaning": "Seat"
            }
        ]
    },
    "仮": {
        "level": 9,
        "meaning": "Temporary",
        "similar": []
    },
    "使": {
        "level": 9,
        "meaning": "Use",
        "similar": [
            {
                "kanji": "倹",
                "level": 60,
                "meaning": "Thrifty"
            },
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            },
            {
                "kanji": "休",
                "level": 4,
                "meaning": "Rest"
            }
        ]
    },
    "美": {
        "level": 9,
        "meaning": "Beauty",
        "similar": [
            {
                "kanji": "兼",
                "level": 40,
                "meaning": "Concurrently"
            },
            {
                "kanji": "差",
                "level": 24,
                "meaning": "Distinction"
            }
        ]
    },
    "返": {
        "level": 9,
        "meaning": "Return",
        "similar": [
            {
                "kanji": "込",
                "level": 32,
                "meaning": "Crowded"
            }
        ]
    },
    "保": {
        "level": 9,
        "meaning": "Preserve",
        "similar": [
            {
                "kanji": "促",
                "level": 29,
                "meaning": "Urge"
            },
            {
                "kanji": "架",
                "level": 46,
                "meaning": "Shelf"
            }
        ]
    },
    "速": {
        "level": 10,
        "meaning": "Fast",
        "similar": [
            {
                "kanji": "遠",
                "level": 16,
                "meaning": "Far"
            }
        ]
    },
    "進": {
        "level": 10,
        "meaning": "Advance",
        "similar": [
            {
                "kanji": "焦",
                "level": 42,
                "meaning": "Char"
            },
            {
                "kanji": "隻",
                "level": 51,
                "meaning": "Ship"
            }
        ]
    },
    "運": {
        "level": 10,
        "meaning": "Carry",
        "similar": [
            {
                "kanji": "連",
                "level": 19,
                "meaning": "Take"
            },
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            }
        ]
    },
    "聞": {
        "level": 10,
        "meaning": "Hear",
        "similar": [
            {
                "kanji": "間",
                "level": 8,
                "meaning": "Interval"
            },
            {
                "kanji": "開",
                "level": 10,
                "meaning": "Open"
            }
        ]
    },
    "配": {
        "level": 10,
        "meaning": "Distribute",
        "similar": [
            {
                "kanji": "酔",
                "level": 35,
                "meaning": "Drunk"
            },
            {
                "kanji": "酌",
                "level": 58,
                "meaning": "Serve"
            }
        ]
    },
    "酒": {
        "level": 10,
        "meaning": "Alcohol",
        "similar": [
            {
                "kanji": "泊",
                "level": 42,
                "meaning": "Overnight"
            },
            {
                "kanji": "油",
                "level": 35,
                "meaning": "Oil"
            }
        ]
    },
    "鉄": {
        "level": 10,
        "meaning": "Iron",
        "similar": [
            {
                "kanji": "銭",
                "level": 32,
                "meaning": "Coin"
            },
            {
                "kanji": "鉢",
                "level": 48,
                "meaning": "Bowl"
            },
            {
                "kanji": "鋳",
                "level": 59,
                "meaning": "Cast"
            },
            {
                "kanji": "銀",
                "level": 13,
                "meaning": "Silver"
            },
            {
                "kanji": "銃",
                "level": 39,
                "meaning": "Gun"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            },
            {
                "kanji": "鈴",
                "level": 39,
                "meaning": "Buzzer"
            }
        ]
    },
    "落": {
        "level": 10,
        "meaning": "Fall",
        "similar": []
    },
    "葉": {
        "level": 10,
        "meaning": "Leaf",
        "similar": []
    },
    "開": {
        "level": 10,
        "meaning": "Open",
        "similar": [
            {
                "kanji": "閉",
                "level": 33,
                "meaning": "Closed"
            },
            {
                "kanji": "閑",
                "level": 59,
                "meaning": "Leisure"
            },
            {
                "kanji": "関",
                "level": 16,
                "meaning": "Related"
            },
            {
                "kanji": "聞",
                "level": 10,
                "meaning": "Hear"
            }
        ]
    },
    "病": {
        "level": 10,
        "meaning": "Sick",
        "similar": []
    },
    "院": {
        "level": 10,
        "meaning": "Institution",
        "similar": [
            {
                "kanji": "完",
                "level": 14,
                "meaning": "Perfect"
            }
        ]
    },
    "集": {
        "level": 10,
        "meaning": "Collect",
        "similar": [
            {
                "kanji": "隻",
                "level": 51,
                "meaning": "Ship"
            }
        ]
    },
    "最": {
        "level": 10,
        "meaning": "Most",
        "similar": [
            {
                "kanji": "撮",
                "level": 30,
                "meaning": "Photograph"
            }
        ]
    },
    "頭": {
        "level": 10,
        "meaning": "Head",
        "similar": [
            {
                "kanji": "頼",
                "level": 36,
                "meaning": "Trust"
            },
            {
                "kanji": "瀬",
                "level": 41,
                "meaning": "Rapids"
            }
        ]
    },
    "顔": {
        "level": 10,
        "meaning": "Face",
        "similar": [
            {
                "kanji": "頻",
                "level": 40,
                "meaning": "Frequent"
            }
        ]
    },
    "飲": {
        "level": 10,
        "meaning": "Drink",
        "similar": [
            {
                "kanji": "飢",
                "level": 48,
                "meaning": "Starve"
            },
            {
                "kanji": "飯",
                "level": 15,
                "meaning": "Meal"
            },
            {
                "kanji": "飽",
                "level": 56,
                "meaning": "Bored"
            },
            {
                "kanji": "飾",
                "level": 30,
                "meaning": "Decorate"
            }
        ]
    },
    "業": {
        "level": 10,
        "meaning": "Business",
        "similar": [
            {
                "kanji": "僕",
                "level": 12,
                "meaning": "I"
            },
            {
                "kanji": "撲",
                "level": 43,
                "meaning": "Slap"
            }
        ]
    },
    "親": {
        "level": 10,
        "meaning": "Parent",
        "similar": []
    },
    "始": {
        "level": 10,
        "meaning": "Begin",
        "similar": [
            {
                "kanji": "如",
                "level": 47,
                "meaning": "Likeness"
            }
        ]
    },
    "横": {
        "level": 10,
        "meaning": "Side",
        "similar": [
            {
                "kanji": "積",
                "level": 29,
                "meaning": "Accumulate"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            },
            {
                "kanji": "績",
                "level": 32,
                "meaning": "Exploits"
            }
        ]
    },
    "語": {
        "level": 10,
        "meaning": "Language",
        "similar": [
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            },
            {
                "kanji": "調",
                "level": 10,
                "meaning": "Investigate"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            }
        ]
    },
    "読": {
        "level": 10,
        "meaning": "Read",
        "similar": [
            {
                "kanji": "誌",
                "level": 33,
                "meaning": "Magazine"
            },
            {
                "kanji": "訪",
                "level": 27,
                "meaning": "Visit"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "該",
                "level": 55,
                "meaning": "The"
            }
        ]
    },
    "調": {
        "level": 10,
        "meaning": "Investigate",
        "similar": [
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            },
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            }
        ]
    },
    "歌": {
        "level": 10,
        "meaning": "Song",
        "similar": []
    },
    "算": {
        "level": 10,
        "meaning": "Calculate",
        "similar": [
            {
                "kanji": "笛",
                "level": 19,
                "meaning": "Flute"
            }
        ]
    },
    "求": {
        "level": 10,
        "meaning": "Request",
        "similar": []
    },
    "鳴": {
        "level": 10,
        "meaning": "Chirp",
        "similar": [
            {
                "kanji": "鳥",
                "level": 7,
                "meaning": "Bird"
            }
        ]
    },
    "終": {
        "level": 10,
        "meaning": "End",
        "similar": [
            {
                "kanji": "絡",
                "level": 19,
                "meaning": "Entangle"
            },
            {
                "kanji": "級",
                "level": 11,
                "meaning": "Level"
            },
            {
                "kanji": "紛",
                "level": 42,
                "meaning": "Distract"
            },
            {
                "kanji": "約",
                "level": 14,
                "meaning": "Promise"
            }
        ]
    },
    "起": {
        "level": 10,
        "meaning": "Wake Up",
        "similar": []
    },
    "線": {
        "level": 10,
        "meaning": "Line",
        "similar": [
            {
                "kanji": "練",
                "level": 13,
                "meaning": "Practice"
            },
            {
                "kanji": "綿",
                "level": 46,
                "meaning": "Cotton"
            }
        ]
    },
    "路": {
        "level": 10,
        "meaning": "Road",
        "similar": []
    },
    "転": {
        "level": 10,
        "meaning": "Revolve",
        "similar": [
            {
                "kanji": "軒",
                "level": 51,
                "meaning": "House"
            },
            {
                "kanji": "時",
                "level": 7,
                "meaning": "Time"
            },
            {
                "kanji": "較",
                "level": 26,
                "meaning": "Contrast"
            }
        ]
    },
    "軽": {
        "level": 10,
        "meaning": "Lightweight",
        "similar": [
            {
                "kanji": "幹",
                "level": 23,
                "meaning": "Tree"
            },
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            }
        ]
    },
    "漢": {
        "level": 10,
        "meaning": "Chinese",
        "similar": [
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            },
            {
                "kanji": "嘆",
                "level": 31,
                "meaning": "Sigh"
            }
        ]
    },
    "農": {
        "level": 10,
        "meaning": "Farming",
        "similar": [
            {
                "kanji": "濃",
                "level": 27,
                "meaning": "Thick"
            }
        ]
    },
    "習": {
        "level": 10,
        "meaning": "Learn",
        "similar": [
            {
                "kanji": "泊",
                "level": 42,
                "meaning": "Overnight"
            }
        ]
    },
    "老": {
        "level": 11,
        "meaning": "Elderly",
        "similar": [
            {
                "kanji": "考",
                "level": 5,
                "meaning": "Think"
            },
            {
                "kanji": "花",
                "level": 4,
                "meaning": "Flower"
            },
            {
                "kanji": "赤",
                "level": 4,
                "meaning": "Red"
            },
            {
                "kanji": "売",
                "level": 9,
                "meaning": "Sell"
            }
        ]
    },
    "育": {
        "level": 11,
        "meaning": "Nurture",
        "similar": []
    },
    "働": {
        "level": 11,
        "meaning": "Work",
        "similar": [
            {
                "kanji": "動",
                "level": 12,
                "meaning": "Move"
            },
            {
                "kanji": "傷",
                "level": 32,
                "meaning": "Wound"
            },
            {
                "kanji": "衝",
                "level": 40,
                "meaning": "Collide"
            }
        ]
    },
    "意": {
        "level": 11,
        "meaning": "Idea",
        "similar": [
            {
                "kanji": "億",
                "level": 13,
                "meaning": "Hundred"
            },
            {
                "kanji": "憶",
                "level": 48,
                "meaning": "Recollection"
            },
            {
                "kanji": "穂",
                "level": 46,
                "meaning": "Head"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            },
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "想",
                "level": 13,
                "meaning": "Concept"
            },
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            }
        ]
    },
    "共": {
        "level": 11,
        "meaning": "Together",
        "similar": [
            {
                "kanji": "茂",
                "level": 40,
                "meaning": "Luxuriant"
            },
            {
                "kanji": "供",
                "level": 24,
                "meaning": "Servant"
            },
            {
                "kanji": "坑",
                "level": 60,
                "meaning": "Pit"
            },
            {
                "kanji": "芸",
                "level": 14,
                "meaning": "Acting"
            }
        ]
    },
    "成": {
        "level": 11,
        "meaning": "Become",
        "similar": [
            {
                "kanji": "我",
                "level": 26,
                "meaning": "I"
            }
        ]
    },
    "初": {
        "level": 11,
        "meaning": "First",
        "similar": []
    },
    "別": {
        "level": 11,
        "meaning": "Separate",
        "similar": []
    },
    "戦": {
        "level": 11,
        "meaning": "War",
        "similar": [
            {
                "kanji": "巣",
                "level": 31,
                "meaning": "Nest"
            },
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            }
        ]
    },
    "利": {
        "level": 11,
        "meaning": "Profit",
        "similar": [
            {
                "kanji": "和",
                "level": 9,
                "meaning": "Peace"
            },
            {
                "kanji": "朴",
                "level": 55,
                "meaning": "Simple"
            },
            {
                "kanji": "私",
                "level": 6,
                "meaning": "I"
            },
            {
                "kanji": "剣",
                "level": 35,
                "meaning": "Sword"
            }
        ]
    },
    "良": {
        "level": 11,
        "meaning": "Good",
        "similar": [
            {
                "kanji": "食",
                "level": 6,
                "meaning": "Eat"
            },
            {
                "kanji": "浪",
                "level": 59,
                "meaning": "Wander"
            },
            {
                "kanji": "娘",
                "level": 29,
                "meaning": "Daughter"
            }
        ]
    },
    "特": {
        "level": 11,
        "meaning": "Special",
        "similar": [
            {
                "kanji": "待",
                "level": 12,
                "meaning": "Wait"
            },
            {
                "kanji": "侍",
                "level": 44,
                "meaning": "Samurai"
            },
            {
                "kanji": "持",
                "level": 9,
                "meaning": "Hold"
            },
            {
                "kanji": "牲",
                "level": 52,
                "meaning": "Offering"
            }
        ]
    },
    "功": {
        "level": 11,
        "meaning": "Achievement",
        "similar": []
    },
    "努": {
        "level": 11,
        "meaning": "Toil",
        "similar": [
            {
                "kanji": "奴",
                "level": 34,
                "meaning": "Dude"
            }
        ]
    },
    "労": {
        "level": 11,
        "meaning": "Labor",
        "similar": []
    },
    "拾": {
        "level": 11,
        "meaning": "Pick Up",
        "similar": [
            {
                "kanji": "捨",
                "level": 32,
                "meaning": "Throw"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            },
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "拘",
                "level": 49,
                "meaning": "Arrest"
            },
            {
                "kanji": "搭",
                "level": 53,
                "meaning": "Board"
            }
        ]
    },
    "指": {
        "level": 11,
        "meaning": "Finger",
        "similar": [
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "挿",
                "level": 47,
                "meaning": "Insert"
            }
        ]
    },
    "味": {
        "level": 11,
        "meaning": "Flavor",
        "similar": []
    },
    "命": {
        "level": 11,
        "meaning": "Fate",
        "similar": [
            {
                "kanji": "合",
                "level": 12,
                "meaning": "Suit"
            }
        ]
    },
    "放": {
        "level": 11,
        "meaning": "Release",
        "similar": [
            {
                "kanji": "旅",
                "level": 12,
                "meaning": "Trip"
            },
            {
                "kanji": "族",
                "level": 12,
                "meaning": "Tribe"
            },
            {
                "kanji": "旋",
                "level": 57,
                "meaning": "Rotation"
            }
        ]
    },
    "昔": {
        "level": 11,
        "meaning": "Long Ago",
        "similar": [
            {
                "kanji": "借",
                "level": 18,
                "meaning": "Borrow"
            },
            {
                "kanji": "垣",
                "level": 43,
                "meaning": "Hedge"
            },
            {
                "kanji": "苗",
                "level": 51,
                "meaning": "Seedling"
            },
            {
                "kanji": "者",
                "level": 8,
                "meaning": "Someone"
            },
            {
                "kanji": "著",
                "level": 33,
                "meaning": "Author"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            },
            {
                "kanji": "措",
                "level": 41,
                "meaning": "Set"
            },
            {
                "kanji": "惜",
                "level": 55,
                "meaning": "Frugal"
            }
        ]
    },
    "神": {
        "level": 11,
        "meaning": "God",
        "similar": [
            {
                "kanji": "視",
                "level": 24,
                "meaning": "Look"
            },
            {
                "kanji": "禅",
                "level": 18,
                "meaning": "Zen"
            },
            {
                "kanji": "裸",
                "level": 45,
                "meaning": "Naked"
            }
        ]
    },
    "好": {
        "level": 11,
        "meaning": "Like",
        "similar": []
    },
    "秒": {
        "level": 11,
        "meaning": "Second",
        "similar": [
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            },
            {
                "kanji": "秘",
                "level": 32,
                "meaning": "Secret"
            }
        ]
    },
    "競": {
        "level": 11,
        "meaning": "Compete",
        "similar": []
    },
    "岸": {
        "level": 11,
        "meaning": "Coast",
        "similar": []
    },
    "波": {
        "level": 11,
        "meaning": "Wave",
        "similar": [
            {
                "kanji": "没",
                "level": 52,
                "meaning": "Die"
            },
            {
                "kanji": "披",
                "level": 53,
                "meaning": "Expose"
            },
            {
                "kanji": "婆",
                "level": 47,
                "meaning": "Old"
            },
            {
                "kanji": "疲",
                "level": 45,
                "meaning": "Exhausted"
            }
        ]
    },
    "注": {
        "level": 11,
        "meaning": "Pour",
        "similar": [
            {
                "kanji": "性",
                "level": 14,
                "meaning": "Gender"
            },
            {
                "kanji": "江",
                "level": 29,
                "meaning": "Inlet"
            }
        ]
    },
    "洋": {
        "level": 11,
        "meaning": "Western Style",
        "similar": [
            {
                "kanji": "津",
                "level": 36,
                "meaning": "Haven"
            },
            {
                "kanji": "祥",
                "level": 52,
                "meaning": "Auspicious"
            }
        ]
    },
    "級": {
        "level": 11,
        "meaning": "Level",
        "similar": [
            {
                "kanji": "約",
                "level": 14,
                "meaning": "Promise"
            },
            {
                "kanji": "終",
                "level": 10,
                "meaning": "End"
            },
            {
                "kanji": "紛",
                "level": 42,
                "meaning": "Distract"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "純",
                "level": 34,
                "meaning": "Pure"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            }
        ]
    },
    "争": {
        "level": 11,
        "meaning": "Conflict",
        "similar": []
    },
    "令": {
        "level": 11,
        "meaning": "Orders",
        "similar": [
            {
                "kanji": "冷",
                "level": 28,
                "meaning": "Cool"
            }
        ]
    },
    "仲": {
        "level": 11,
        "meaning": "Relationship",
        "similar": [
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            }
        ]
    },
    "伝": {
        "level": 11,
        "meaning": "Transmit",
        "similar": [
            {
                "kanji": "会",
                "level": 5,
                "meaning": "Meet"
            }
        ]
    },
    "位": {
        "level": 11,
        "meaning": "Rank",
        "similar": [
            {
                "kanji": "立",
                "level": 2,
                "meaning": "Stand"
            },
            {
                "kanji": "似",
                "level": 31,
                "meaning": "Resemble"
            },
            {
                "kanji": "倍",
                "level": 12,
                "meaning": "Double"
            }
        ]
    },
    "低": {
        "level": 11,
        "meaning": "Low",
        "similar": [
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            }
        ]
    },
    "便": {
        "level": 11,
        "meaning": "Convenience",
        "similar": [
            {
                "kanji": "更",
                "level": 30,
                "meaning": "Again"
            },
            {
                "kanji": "硬",
                "level": 45,
                "meaning": "Stiff"
            },
            {
                "kanji": "復",
                "level": 26,
                "meaning": "Restore"
            },
            {
                "kanji": "陳",
                "level": 52,
                "meaning": "Exhibit"
            },
            {
                "kanji": "凍",
                "level": 28,
                "meaning": "Frozen"
            },
            {
                "kanji": "値",
                "level": 22,
                "meaning": "Value"
            }
        ]
    },
    "追": {
        "level": 11,
        "meaning": "Follow",
        "similar": []
    },
    "倍": {
        "level": 12,
        "meaning": "Double",
        "similar": [
            {
                "kanji": "陪",
                "level": 58,
                "meaning": "Accompany"
            },
            {
                "kanji": "培",
                "level": 48,
                "meaning": "Cultivate"
            },
            {
                "kanji": "位",
                "level": 11,
                "meaning": "Rank"
            },
            {
                "kanji": "俗",
                "level": 49,
                "meaning": "Vulgar"
            },
            {
                "kanji": "信",
                "level": 15,
                "meaning": "Believe"
            }
        ]
    },
    "息": {
        "level": 12,
        "meaning": "Breath",
        "similar": [
            {
                "kanji": "思",
                "level": 6,
                "meaning": "Think"
            },
            {
                "kanji": "恵",
                "level": 37,
                "meaning": "Favor"
            },
            {
                "kanji": "想",
                "level": 13,
                "meaning": "Concept"
            }
        ]
    },
    "悪": {
        "level": 12,
        "meaning": "Bad",
        "similar": [
            {
                "kanji": "恵",
                "level": 37,
                "meaning": "Favor"
            }
        ]
    },
    "僕": {
        "level": 12,
        "meaning": "I",
        "similar": [
            {
                "kanji": "撲",
                "level": 43,
                "meaning": "Slap"
            },
            {
                "kanji": "業",
                "level": 10,
                "meaning": "Business"
            }
        ]
    },
    "都": {
        "level": 12,
        "meaning": "Metropolis",
        "similar": [
            {
                "kanji": "者",
                "level": 8,
                "meaning": "Someone"
            }
        ]
    },
    "野": {
        "level": 12,
        "meaning": "Field",
        "similar": []
    },
    "勉": {
        "level": 12,
        "meaning": "Exertion",
        "similar": [
            {
                "kanji": "逸",
                "level": 54,
                "meaning": "Deviate"
            },
            {
                "kanji": "免",
                "level": 39,
                "meaning": "Excuse"
            }
        ]
    },
    "動": {
        "level": 12,
        "meaning": "Move",
        "similar": [
            {
                "kanji": "働",
                "level": 11,
                "meaning": "Work"
            },
            {
                "kanji": "勲",
                "level": 54,
                "meaning": "Merit"
            },
            {
                "kanji": "重",
                "level": 9,
                "meaning": "Heavy"
            }
        ]
    },
    "球": {
        "level": 12,
        "meaning": "Sphere",
        "similar": []
    },
    "合": {
        "level": 12,
        "meaning": "Suit",
        "similar": [
            {
                "kanji": "含",
                "level": 25,
                "meaning": "Include"
            },
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "命",
                "level": 11,
                "meaning": "Fate"
            },
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            },
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            }
        ]
    },
    "員": {
        "level": 12,
        "meaning": "Member",
        "similar": [
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            },
            {
                "kanji": "賀",
                "level": 22,
                "meaning": "Congratulations"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "貞",
                "level": 51,
                "meaning": "Chastity"
            },
            {
                "kanji": "損",
                "level": 34,
                "meaning": "Loss"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "喝",
                "level": 57,
                "meaning": "Scold"
            },
            {
                "kanji": "負",
                "level": 9,
                "meaning": "Lose"
            }
        ]
    },
    "商": {
        "level": 12,
        "meaning": "Merchandise",
        "similar": [
            {
                "kanji": "尚",
                "level": 54,
                "meaning": "Furthermore"
            }
        ]
    },
    "旅": {
        "level": 12,
        "meaning": "Trip",
        "similar": [
            {
                "kanji": "族",
                "level": 12,
                "meaning": "Tribe"
            },
            {
                "kanji": "放",
                "level": 11,
                "meaning": "Release"
            },
            {
                "kanji": "旋",
                "level": 57,
                "meaning": "Rotation"
            },
            {
                "kanji": "施",
                "level": 23,
                "meaning": "Carry"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            }
        ]
    },
    "族": {
        "level": 12,
        "meaning": "Tribe",
        "similar": [
            {
                "kanji": "旅",
                "level": 12,
                "meaning": "Trip"
            },
            {
                "kanji": "放",
                "level": 11,
                "meaning": "Release"
            },
            {
                "kanji": "旋",
                "level": 57,
                "meaning": "Rotation"
            },
            {
                "kanji": "疾",
                "level": 54,
                "meaning": "Rapidly"
            }
        ]
    },
    "登": {
        "level": 12,
        "meaning": "Climb",
        "similar": [
            {
                "kanji": "澄",
                "level": 45,
                "meaning": "Lucidity"
            }
        ]
    },
    "陽": {
        "level": 12,
        "meaning": "Sunshine",
        "similar": [
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            },
            {
                "kanji": "湯",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "傷",
                "level": 32,
                "meaning": "Wound"
            },
            {
                "kanji": "腸",
                "level": 57,
                "meaning": "Intestines"
            }
        ]
    },
    "階": {
        "level": 12,
        "meaning": "Floor",
        "similar": [
            {
                "kanji": "皆",
                "level": 13,
                "meaning": "All"
            }
        ]
    },
    "暑": {
        "level": 12,
        "meaning": "Hot",
        "similar": [
            {
                "kanji": "署",
                "level": 17,
                "meaning": "Government"
            },
            {
                "kanji": "暗",
                "level": 13,
                "meaning": "Dark"
            },
            {
                "kanji": "晴",
                "level": 15,
                "meaning": "Clear"
            }
        ]
    },
    "期": {
        "level": 12,
        "meaning": "Period Of Time",
        "similar": [
            {
                "kanji": "欺",
                "level": 47,
                "meaning": "Deceit"
            }
        ]
    },
    "着": {
        "level": 12,
        "meaning": "Wear",
        "similar": [
            {
                "kanji": "首",
                "level": 6,
                "meaning": "Neck"
            },
            {
                "kanji": "看",
                "level": 23,
                "meaning": "Watch"
            }
        ]
    },
    "短": {
        "level": 12,
        "meaning": "Short",
        "similar": []
    },
    "根": {
        "level": 12,
        "meaning": "Root",
        "similar": []
    },
    "植": {
        "level": 12,
        "meaning": "Plant",
        "similar": [
            {
                "kanji": "殖",
                "level": 40,
                "meaning": "Multiply"
            },
            {
                "kanji": "値",
                "level": 22,
                "meaning": "Value"
            },
            {
                "kanji": "模",
                "level": 25,
                "meaning": "Imitation"
            }
        ]
    },
    "祭": {
        "level": 12,
        "meaning": "Festival",
        "similar": [
            {
                "kanji": "察",
                "level": 17,
                "meaning": "Guess"
            },
            {
                "kanji": "際",
                "level": 21,
                "meaning": "Occasion"
            }
        ]
    },
    "章": {
        "level": 12,
        "meaning": "Chapter",
        "similar": [
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            },
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            },
            {
                "kanji": "彰",
                "level": 50,
                "meaning": "Clear"
            },
            {
                "kanji": "障",
                "level": 26,
                "meaning": "Hinder"
            },
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "宣",
                "level": 33,
                "meaning": "Proclaim"
            }
        ]
    },
    "童": {
        "level": 12,
        "meaning": "Juvenile",
        "similar": [
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "重",
                "level": 9,
                "meaning": "Heavy"
            },
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            },
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "種",
                "level": 18,
                "meaning": "Kind"
            },
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            }
        ]
    },
    "第": {
        "level": 12,
        "meaning": "Ordinal Number Prefix",
        "similar": []
    },
    "歯": {
        "level": 12,
        "meaning": "Tooth",
        "similar": [
            {
                "kanji": "齢",
                "level": 38,
                "meaning": "Age"
            }
        ]
    },
    "寒": {
        "level": 12,
        "meaning": "Cold",
        "similar": []
    },
    "泉": {
        "level": 12,
        "meaning": "Spring",
        "similar": [
            {
                "kanji": "臭",
                "level": 20,
                "meaning": "Stinking"
            }
        ]
    },
    "島": {
        "level": 12,
        "meaning": "Island",
        "similar": []
    },
    "流": {
        "level": 12,
        "meaning": "Stream",
        "similar": [
            {
                "kanji": "泣",
                "level": 15,
                "meaning": "Cry"
            }
        ]
    },
    "消": {
        "level": 12,
        "meaning": "Extinguish",
        "similar": [
            {
                "kanji": "清",
                "level": 28,
                "meaning": "Pure"
            },
            {
                "kanji": "肖",
                "level": 58,
                "meaning": "Resemblance"
            },
            {
                "kanji": "滑",
                "level": 42,
                "meaning": "Slippery"
            }
        ]
    },
    "深": {
        "level": 12,
        "meaning": "Deep",
        "similar": [
            {
                "kanji": "探",
                "level": 31,
                "meaning": "Look"
            },
            {
                "kanji": "栄",
                "level": 17,
                "meaning": "Prosper"
            },
            {
                "kanji": "染",
                "level": 32,
                "meaning": "Dye"
            }
        ]
    },
    "温": {
        "level": 12,
        "meaning": "Warm",
        "similar": [
            {
                "kanji": "湿",
                "level": 45,
                "meaning": "Damp"
            }
        ]
    },
    "港": {
        "level": 12,
        "meaning": "Harbor",
        "similar": []
    },
    "湯": {
        "level": 12,
        "meaning": "Hot Water",
        "similar": [
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            },
            {
                "kanji": "渇",
                "level": 30,
                "meaning": "Thirst"
            },
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "陽",
                "level": 12,
                "meaning": "Sunshine"
            },
            {
                "kanji": "傷",
                "level": 32,
                "meaning": "Wound"
            },
            {
                "kanji": "腸",
                "level": 57,
                "meaning": "Intestines"
            }
        ]
    },
    "庭": {
        "level": 12,
        "meaning": "Garden",
        "similar": [
            {
                "kanji": "廷",
                "level": 50,
                "meaning": "Courts"
            }
        ]
    },
    "待": {
        "level": 12,
        "meaning": "Wait",
        "similar": [
            {
                "kanji": "侍",
                "level": 44,
                "meaning": "Samurai"
            },
            {
                "kanji": "特",
                "level": 11,
                "meaning": "Special"
            },
            {
                "kanji": "徐",
                "level": 53,
                "meaning": "Gently"
            }
        ]
    },
    "選": {
        "level": 13,
        "meaning": "Choose",
        "similar": []
    },
    "情": {
        "level": 13,
        "meaning": "Feeling",
        "similar": [
            {
                "kanji": "清",
                "level": 28,
                "meaning": "Pure"
            },
            {
                "kanji": "惰",
                "level": 52,
                "meaning": "Lazy"
            },
            {
                "kanji": "惜",
                "level": 55,
                "meaning": "Frugal"
            },
            {
                "kanji": "青",
                "level": 5,
                "meaning": "Blue"
            },
            {
                "kanji": "精",
                "level": 28,
                "meaning": "Spirit"
            }
        ]
    },
    "像": {
        "level": 13,
        "meaning": "Statue",
        "similar": [
            {
                "kanji": "象",
                "level": 24,
                "meaning": "Elephant"
            }
        ]
    },
    "想": {
        "level": 13,
        "meaning": "Concept",
        "similar": [
            {
                "kanji": "息",
                "level": 12,
                "meaning": "Breath"
            },
            {
                "kanji": "穂",
                "level": 46,
                "meaning": "Head"
            },
            {
                "kanji": "相",
                "level": 9,
                "meaning": "Mutual"
            },
            {
                "kanji": "恵",
                "level": 37,
                "meaning": "Favor"
            },
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            }
        ]
    },
    "億": {
        "level": 13,
        "meaning": "Hundred Million",
        "similar": [
            {
                "kanji": "憶",
                "level": 48,
                "meaning": "Recollection"
            },
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            }
        ]
    },
    "感": {
        "level": 13,
        "meaning": "Feeling",
        "similar": [
            {
                "kanji": "憾",
                "level": 55,
                "meaning": "Remorse"
            },
            {
                "kanji": "認",
                "level": 21,
                "meaning": "Recognize"
            },
            {
                "kanji": "惑",
                "level": 27,
                "meaning": "Misguided"
            }
        ]
    },
    "然": {
        "level": 13,
        "meaning": "Nature",
        "similar": []
    },
    "熱": {
        "level": 13,
        "meaning": "Heat",
        "similar": [
            {
                "kanji": "勢",
                "level": 22,
                "meaning": "Force"
            }
        ]
    },
    "銀": {
        "level": 13,
        "meaning": "Silver",
        "similar": [
            {
                "kanji": "錬",
                "level": 46,
                "meaning": "Tempering"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            }
        ]
    },
    "鏡": {
        "level": 13,
        "meaning": "Mirror",
        "similar": [
            {
                "kanji": "鐘",
                "level": 45,
                "meaning": "Bell"
            },
            {
                "kanji": "鎖",
                "level": 52,
                "meaning": "Chain"
            },
            {
                "kanji": "錯",
                "level": 56,
                "meaning": "Confused"
            },
            {
                "kanji": "境",
                "level": 24,
                "meaning": "Boundary"
            }
        ]
    },
    "問": {
        "level": 13,
        "meaning": "Problem",
        "similar": [
            {
                "kanji": "閣",
                "level": 29,
                "meaning": "The"
            },
            {
                "kanji": "閑",
                "level": 59,
                "meaning": "Leisure"
            },
            {
                "kanji": "間",
                "level": 8,
                "meaning": "Interval"
            },
            {
                "kanji": "閲",
                "level": 57,
                "meaning": "Inspection"
            },
            {
                "kanji": "閉",
                "level": 33,
                "meaning": "Closed"
            },
            {
                "kanji": "門",
                "level": 16,
                "meaning": "Gates"
            }
        ]
    },
    "整": {
        "level": 13,
        "meaning": "Arrange",
        "similar": []
    },
    "疑": {
        "level": 13,
        "meaning": "Doubt",
        "similar": [
            {
                "kanji": "凝",
                "level": 55,
                "meaning": "Congeal"
            },
            {
                "kanji": "擬",
                "level": 59,
                "meaning": "Imitate"
            }
        ]
    },
    "料": {
        "level": 13,
        "meaning": "Fee",
        "similar": [
            {
                "kanji": "粋",
                "level": 34,
                "meaning": "Stylish"
            },
            {
                "kanji": "科",
                "level": 6,
                "meaning": "Course"
            },
            {
                "kanji": "断",
                "level": 21,
                "meaning": "Cut"
            },
            {
                "kanji": "迷",
                "level": 27,
                "meaning": "Astray"
            }
        ]
    },
    "映": {
        "level": 13,
        "meaning": "Reflect",
        "similar": []
    },
    "器": {
        "level": 13,
        "meaning": "Container",
        "similar": []
    },
    "皆": {
        "level": 13,
        "meaning": "All",
        "similar": [
            {
                "kanji": "階",
                "level": 12,
                "meaning": "Floor"
            }
        ]
    },
    "暗": {
        "level": 13,
        "meaning": "Dark",
        "similar": [
            {
                "kanji": "暑",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "賄",
                "level": 38,
                "meaning": "Bribe"
            },
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            }
        ]
    },
    "題": {
        "level": 13,
        "meaning": "Topic",
        "similar": [
            {
                "kanji": "顕",
                "level": 54,
                "meaning": "Appear"
            }
        ]
    },
    "願": {
        "level": 13,
        "meaning": "Request",
        "similar": []
    },
    "士": {
        "level": 13,
        "meaning": "Samurai",
        "similar": [
            {
                "kanji": "土",
                "level": 2,
                "meaning": "Dirt"
            },
            {
                "kanji": "工",
                "level": 1,
                "meaning": "Construction"
            },
            {
                "kanji": "王",
                "level": 2,
                "meaning": "King"
            },
            {
                "kanji": "五",
                "level": 2,
                "meaning": "Five"
            }
        ]
    },
    "養": {
        "level": 13,
        "meaning": "Foster",
        "similar": []
    },
    "館": {
        "level": 13,
        "meaning": "Public Building",
        "similar": []
    },
    "福": {
        "level": 13,
        "meaning": "Luck",
        "similar": [
            {
                "kanji": "幅",
                "level": 36,
                "meaning": "Width"
            },
            {
                "kanji": "富",
                "level": 31,
                "meaning": "Rich"
            }
        ]
    },
    "駅": {
        "level": 13,
        "meaning": "Station",
        "similar": [
            {
                "kanji": "駄",
                "level": 50,
                "meaning": "Burdensome"
            },
            {
                "kanji": "験",
                "level": 9,
                "meaning": "Test"
            },
            {
                "kanji": "駆",
                "level": 40,
                "meaning": "Gallop"
            },
            {
                "kanji": "馬",
                "level": 8,
                "meaning": "Horse"
            }
        ]
    },
    "様": {
        "level": 13,
        "meaning": "Formal Name Title",
        "similar": [
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            }
        ]
    },
    "標": {
        "level": 13,
        "meaning": "Signpost",
        "similar": [
            {
                "kanji": "禁",
                "level": 18,
                "meaning": "Prohibit"
            },
            {
                "kanji": "漂",
                "level": 50,
                "meaning": "Drift"
            },
            {
                "kanji": "票",
                "level": 25,
                "meaning": "Ballot"
            }
        ]
    },
    "橋": {
        "level": 13,
        "meaning": "Bridge",
        "similar": [
            {
                "kanji": "矯",
                "level": 60,
                "meaning": "Correct"
            }
        ]
    },
    "詩": {
        "level": 13,
        "meaning": "Poem",
        "similar": [
            {
                "kanji": "誌",
                "level": 33,
                "meaning": "Magazine"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "請",
                "level": 29,
                "meaning": "Request"
            },
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            },
            {
                "kanji": "読",
                "level": 10,
                "meaning": "Read"
            },
            {
                "kanji": "訪",
                "level": 27,
                "meaning": "Visit"
            },
            {
                "kanji": "試",
                "level": 9,
                "meaning": "Try"
            }
        ]
    },
    "課": {
        "level": 13,
        "meaning": "Section",
        "similar": [
            {
                "kanji": "謀",
                "level": 49,
                "meaning": "Conspire"
            }
        ]
    },
    "謝": {
        "level": 13,
        "meaning": "Apologize",
        "similar": []
    },
    "殺": {
        "level": 13,
        "meaning": "Kill",
        "similar": []
    },
    "宿": {
        "level": 13,
        "meaning": "Lodge",
        "similar": []
    },
    "賞": {
        "level": 13,
        "meaning": "Prize",
        "similar": [
            {
                "kanji": "償",
                "level": 37,
                "meaning": "Reparation"
            },
            {
                "kanji": "賀",
                "level": 22,
                "meaning": "Congratulations"
            },
            {
                "kanji": "額",
                "level": 24,
                "meaning": "Amount"
            }
        ]
    },
    "緑": {
        "level": 13,
        "meaning": "Green",
        "similar": [
            {
                "kanji": "縁",
                "level": 44,
                "meaning": "Edge"
            },
            {
                "kanji": "絞",
                "level": 25,
                "meaning": "Strangle"
            }
        ]
    },
    "練": {
        "level": 13,
        "meaning": "Practice",
        "similar": [
            {
                "kanji": "線",
                "level": 10,
                "meaning": "Line"
            },
            {
                "kanji": "綿",
                "level": 46,
                "meaning": "Cotton"
            },
            {
                "kanji": "紳",
                "level": 56,
                "meaning": "Gentleman"
            },
            {
                "kanji": "棟",
                "level": 46,
                "meaning": "Pillar"
            },
            {
                "kanji": "紺",
                "level": 57,
                "meaning": "Navy"
            },
            {
                "kanji": "績",
                "level": 32,
                "meaning": "Exploits"
            }
        ]
    },
    "輪": {
        "level": 13,
        "meaning": "Wheel",
        "similar": [
            {
                "kanji": "輸",
                "level": 24,
                "meaning": "Transport"
            }
        ]
    },
    "性": {
        "level": 14,
        "meaning": "Gender",
        "similar": [
            {
                "kanji": "注",
                "level": 11,
                "meaning": "Pour"
            }
        ]
    },
    "能": {
        "level": 14,
        "meaning": "Ability",
        "similar": [
            {
                "kanji": "態",
                "level": 22,
                "meaning": "Appearance"
            }
        ]
    },
    "技": {
        "level": 14,
        "meaning": "Skill",
        "similar": [
            {
                "kanji": "抜",
                "level": 25,
                "meaning": "Extract"
            },
            {
                "kanji": "披",
                "level": 53,
                "meaning": "Expose"
            },
            {
                "kanji": "投",
                "level": 8,
                "meaning": "Throw"
            },
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            }
        ]
    },
    "折": {
        "level": 14,
        "meaning": "Fold",
        "similar": [
            {
                "kanji": "抑",
                "level": 38,
                "meaning": "Suppress"
            },
            {
                "kanji": "逝",
                "level": 60,
                "meaning": "Die"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            }
        ]
    },
    "芸": {
        "level": 14,
        "meaning": "Acting",
        "similar": [
            {
                "kanji": "共",
                "level": 11,
                "meaning": "Together"
            },
            {
                "kanji": "芋",
                "level": 34,
                "meaning": "Potato"
            },
            {
                "kanji": "寺",
                "level": 15,
                "meaning": "Temple"
            },
            {
                "kanji": "去",
                "level": 4,
                "meaning": "Past"
            },
            {
                "kanji": "玉",
                "level": 2,
                "meaning": "Ball"
            }
        ]
    },
    "卒": {
        "level": 14,
        "meaning": "Graduate",
        "similar": [
            {
                "kanji": "座",
                "level": 18,
                "meaning": "Sit"
            }
        ]
    },
    "協": {
        "level": 14,
        "meaning": "Cooperation",
        "similar": []
    },
    "参": {
        "level": 14,
        "meaning": "Participate",
        "similar": [
            {
                "kanji": "惨",
                "level": 53,
                "meaning": "Disaster"
            }
        ]
    },
    "周": {
        "level": 14,
        "meaning": "Circumference",
        "similar": [
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            },
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "週",
                "level": 7,
                "meaning": "Week"
            },
            {
                "kanji": "彫",
                "level": 35,
                "meaning": "Carve"
            }
        ]
    },
    "的": {
        "level": 14,
        "meaning": "Target",
        "similar": [
            {
                "kanji": "鬼",
                "level": 23,
                "meaning": "Demon"
            },
            {
                "kanji": "酌",
                "level": 58,
                "meaning": "Serve"
            }
        ]
    },
    "雰": {
        "level": 14,
        "meaning": "Atmosphere",
        "similar": [
            {
                "kanji": "零",
                "level": 46,
                "meaning": "Zero"
            }
        ]
    },
    "囲": {
        "level": 14,
        "meaning": "Surround",
        "similar": [
            {
                "kanji": "困",
                "level": 20,
                "meaning": "Distressed"
            },
            {
                "kanji": "因",
                "level": 17,
                "meaning": "Cause"
            }
        ]
    },
    "固": {
        "level": 14,
        "meaning": "Hard",
        "similar": [
            {
                "kanji": "個",
                "level": 20,
                "meaning": "Individual"
            },
            {
                "kanji": "回",
                "level": 5,
                "meaning": "Times"
            }
        ]
    },
    "望": {
        "level": 14,
        "meaning": "Hope",
        "similar": []
    },
    "材": {
        "level": 14,
        "meaning": "Lumber",
        "similar": [
            {
                "kanji": "村",
                "level": 4,
                "meaning": "Village"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "朽",
                "level": 58,
                "meaning": "Rot"
            },
            {
                "kanji": "杉",
                "level": 35,
                "meaning": "Cedar"
            },
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            }
        ]
    },
    "束": {
        "level": 14,
        "meaning": "Bundle",
        "similar": [
            {
                "kanji": "豆",
                "level": 34,
                "meaning": "Beans"
            },
            {
                "kanji": "史",
                "level": 19,
                "meaning": "History"
            }
        ]
    },
    "松": {
        "level": 14,
        "meaning": "Pine",
        "similar": []
    },
    "基": {
        "level": 14,
        "meaning": "Foundation",
        "similar": [
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            },
            {
                "kanji": "碁",
                "level": 46,
                "meaning": "Go"
            }
        ]
    },
    "頑": {
        "level": 14,
        "meaning": "Stubborn",
        "similar": [
            {
                "kanji": "賛",
                "level": 32,
                "meaning": "Agree"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            }
        ]
    },
    "格": {
        "level": 14,
        "meaning": "Status",
        "similar": [
            {
                "kanji": "枯",
                "level": 51,
                "meaning": "Wither"
            },
            {
                "kanji": "俗",
                "level": 49,
                "meaning": "Vulgar"
            },
            {
                "kanji": "酪",
                "level": 59,
                "meaning": "Dairy"
            }
        ]
    },
    "術": {
        "level": 14,
        "meaning": "Art",
        "similar": []
    },
    "妥": {
        "level": 14,
        "meaning": "Gentle",
        "similar": [
            {
                "kanji": "桜",
                "level": 32,
                "meaning": "Sakura"
            }
        ]
    },
    "骨": {
        "level": 14,
        "meaning": "Bone",
        "similar": [
            {
                "kanji": "滑",
                "level": 42,
                "meaning": "Slippery"
            }
        ]
    },
    "季": {
        "level": 14,
        "meaning": "Seasons",
        "similar": [
            {
                "kanji": "委",
                "level": 21,
                "meaning": "Committee"
            }
        ]
    },
    "残": {
        "level": 14,
        "meaning": "Remainder",
        "similar": [
            {
                "kanji": "殊",
                "level": 52,
                "meaning": "Especially"
            },
            {
                "kanji": "桟",
                "level": 60,
                "meaning": "Jetty"
            }
        ]
    },
    "完": {
        "level": 14,
        "meaning": "Perfect",
        "similar": [
            {
                "kanji": "宗",
                "level": 29,
                "meaning": "Religion"
            },
            {
                "kanji": "実",
                "level": 9,
                "meaning": "Truth"
            },
            {
                "kanji": "宅",
                "level": 23,
                "meaning": "House"
            },
            {
                "kanji": "光",
                "level": 5,
                "meaning": "Sunlight"
            },
            {
                "kanji": "宇",
                "level": 19,
                "meaning": "Outer"
            },
            {
                "kanji": "院",
                "level": 10,
                "meaning": "Institution"
            }
        ]
    },
    "約": {
        "level": 14,
        "meaning": "Promise",
        "similar": [
            {
                "kanji": "紛",
                "level": 42,
                "meaning": "Distract"
            },
            {
                "kanji": "級",
                "level": 11,
                "meaning": "Level"
            },
            {
                "kanji": "終",
                "level": 10,
                "meaning": "End"
            },
            {
                "kanji": "純",
                "level": 34,
                "meaning": "Pure"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            }
        ]
    },
    "希": {
        "level": 14,
        "meaning": "Wish",
        "similar": [
            {
                "kanji": "布",
                "level": 19,
                "meaning": "Cloth"
            }
        ]
    },
    "例": {
        "level": 14,
        "meaning": "Example",
        "similar": [
            {
                "kanji": "列",
                "level": 15,
                "meaning": "Row"
            }
        ]
    },
    "念": {
        "level": 14,
        "meaning": "Thought",
        "similar": []
    },
    "列": {
        "level": 15,
        "meaning": "Row",
        "similar": [
            {
                "kanji": "例",
                "level": 14,
                "meaning": "Example"
            },
            {
                "kanji": "序",
                "level": 32,
                "meaning": "Preface"
            }
        ]
    },
    "勇": {
        "level": 15,
        "meaning": "Courage",
        "similar": [
            {
                "kanji": "男",
                "level": 4,
                "meaning": "Man"
            }
        ]
    },
    "英": {
        "level": 15,
        "meaning": "England",
        "similar": []
    },
    "猫": {
        "level": 15,
        "meaning": "Cat",
        "similar": [
            {
                "kanji": "描",
                "level": 38,
                "meaning": "Draw"
            },
            {
                "kanji": "苗",
                "level": 51,
                "meaning": "Seedling"
            },
            {
                "kanji": "盾",
                "level": 48,
                "meaning": "Shield"
            }
        ]
    },
    "区": {
        "level": 15,
        "meaning": "District",
        "similar": [
            {
                "kanji": "匹",
                "level": 44,
                "meaning": "Small"
            }
        ]
    },
    "単": {
        "level": 15,
        "meaning": "Simple",
        "similar": [
            {
                "kanji": "巣",
                "level": 31,
                "meaning": "Nest"
            },
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            },
            {
                "kanji": "弾",
                "level": 37,
                "meaning": "Bullet"
            },
            {
                "kanji": "悼",
                "level": 55,
                "meaning": "Grieve"
            },
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "戦",
                "level": 11,
                "meaning": "War"
            },
            {
                "kanji": "禅",
                "level": 18,
                "meaning": "Zen"
            }
        ]
    },
    "司": {
        "level": 15,
        "meaning": "Director",
        "similar": [
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "召",
                "level": 51,
                "meaning": "Call"
            },
            {
                "kanji": "加",
                "level": 19,
                "meaning": "Add"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            }
        ]
    },
    "春": {
        "level": 15,
        "meaning": "Spring",
        "similar": [
            {
                "kanji": "者",
                "level": 8,
                "meaning": "Someone"
            },
            {
                "kanji": "香",
                "level": 37,
                "meaning": "Fragrance"
            },
            {
                "kanji": "替",
                "level": 25,
                "meaning": "Replace"
            },
            {
                "kanji": "書",
                "level": 16,
                "meaning": "Write"
            }
        ]
    },
    "昨": {
        "level": 15,
        "meaning": "Previous",
        "similar": [
            {
                "kanji": "酢",
                "level": 35,
                "meaning": "Vinegar"
            }
        ]
    },
    "昼": {
        "level": 15,
        "meaning": "Noon",
        "similar": []
    },
    "晩": {
        "level": 15,
        "meaning": "Night",
        "similar": []
    },
    "晴": {
        "level": 15,
        "meaning": "Clear Up",
        "similar": [
            {
                "kanji": "暑",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "賄",
                "level": 38,
                "meaning": "Bribe"
            }
        ]
    },
    "坂": {
        "level": 15,
        "meaning": "Slope",
        "similar": [
            {
                "kanji": "麦",
                "level": 5,
                "meaning": "Wheat"
            },
            {
                "kanji": "攻",
                "level": 28,
                "meaning": "Aggression"
            },
            {
                "kanji": "抜",
                "level": 25,
                "meaning": "Extract"
            }
        ]
    },
    "飯": {
        "level": 15,
        "meaning": "Meal",
        "similar": [
            {
                "kanji": "飢",
                "level": 48,
                "meaning": "Starve"
            },
            {
                "kanji": "飲",
                "level": 10,
                "meaning": "Drink"
            },
            {
                "kanji": "飼",
                "level": 32,
                "meaning": "Domesticate"
            },
            {
                "kanji": "飾",
                "level": 30,
                "meaning": "Decorate"
            }
        ]
    },
    "変": {
        "level": 15,
        "meaning": "Change",
        "similar": [
            {
                "kanji": "赦",
                "level": 58,
                "meaning": "Pardon"
            }
        ]
    },
    "夫": {
        "level": 15,
        "meaning": "Husband",
        "similar": [
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "失",
                "level": 7,
                "meaning": "Fault"
            },
            {
                "kanji": "矢",
                "level": 3,
                "meaning": "Arrow"
            },
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "丈",
                "level": 15,
                "meaning": "Height"
            },
            {
                "kanji": "元",
                "level": 3,
                "meaning": "Origin"
            },
            {
                "kanji": "木",
                "level": 2,
                "meaning": "Tree"
            }
        ]
    },
    "秋": {
        "level": 15,
        "meaning": "Autumn",
        "similar": [
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            },
            {
                "kanji": "秘",
                "level": 32,
                "meaning": "Secret"
            }
        ]
    },
    "計": {
        "level": 15,
        "meaning": "Measure",
        "similar": [
            {
                "kanji": "訂",
                "level": 50,
                "meaning": "Revise"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "記",
                "level": 7,
                "meaning": "Write"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            }
        ]
    },
    "築": {
        "level": 15,
        "meaning": "Construct",
        "similar": []
    },
    "毒": {
        "level": 15,
        "meaning": "Poison",
        "similar": []
    },
    "寺": {
        "level": 15,
        "meaning": "Temple",
        "similar": [
            {
                "kanji": "玉",
                "level": 2,
                "meaning": "Ball"
            },
            {
                "kanji": "侍",
                "level": 44,
                "meaning": "Samurai"
            },
            {
                "kanji": "寿",
                "level": 35,
                "meaning": "Lifespan"
            },
            {
                "kanji": "芸",
                "level": 14,
                "meaning": "Acting"
            },
            {
                "kanji": "赤",
                "level": 4,
                "meaning": "Red"
            }
        ]
    },
    "岩": {
        "level": 15,
        "meaning": "Boulder",
        "similar": [
            {
                "kanji": "崎",
                "level": 23,
                "meaning": "Cape"
            }
        ]
    },
    "法": {
        "level": 15,
        "meaning": "Method",
        "similar": [
            {
                "kanji": "洪",
                "level": 56,
                "meaning": "Flood"
            },
            {
                "kanji": "江",
                "level": 29,
                "meaning": "Inlet"
            }
        ]
    },
    "泣": {
        "level": 15,
        "meaning": "Cry",
        "similar": [
            {
                "kanji": "翌",
                "level": 30,
                "meaning": "The"
            },
            {
                "kanji": "流",
                "level": 12,
                "meaning": "Stream"
            }
        ]
    },
    "紀": {
        "level": 15,
        "meaning": "Account",
        "similar": [
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "純",
                "level": 34,
                "meaning": "Pure"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            }
        ]
    },
    "浅": {
        "level": 15,
        "meaning": "Shallow",
        "similar": []
    },
    "丈": {
        "level": 15,
        "meaning": "Height",
        "similar": [
            {
                "kanji": "大",
                "level": 1,
                "meaning": "Big"
            },
            {
                "kanji": "犬",
                "level": 2,
                "meaning": "Dog"
            },
            {
                "kanji": "文",
                "level": 2,
                "meaning": "Writing"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "太",
                "level": 3,
                "meaning": "Fat"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            },
            {
                "kanji": "木",
                "level": 2,
                "meaning": "Tree"
            },
            {
                "kanji": "友",
                "level": 3,
                "meaning": "Friend"
            }
        ]
    },
    "帰": {
        "level": 15,
        "meaning": "Return",
        "similar": [
            {
                "kanji": "掃",
                "level": 31,
                "meaning": "Sweep"
            }
        ]
    },
    "軍": {
        "level": 15,
        "meaning": "Army",
        "similar": [
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "宣",
                "level": 33,
                "meaning": "Proclaim"
            },
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "揮",
                "level": 34,
                "meaning": "Brandish"
            },
            {
                "kanji": "運",
                "level": 10,
                "meaning": "Carry"
            },
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "陣",
                "level": 37,
                "meaning": "Army"
            }
        ]
    },
    "仏": {
        "level": 15,
        "meaning": "Buddha",
        "similar": [
            {
                "kanji": "公",
                "level": 3,
                "meaning": "Public"
            }
        ]
    },
    "建": {
        "level": 15,
        "meaning": "Build",
        "similar": [
            {
                "kanji": "健",
                "level": 27,
                "meaning": "Healthy"
            }
        ]
    },
    "式": {
        "level": 15,
        "meaning": "Ritual",
        "similar": [
            {
                "kanji": "武",
                "level": 24,
                "meaning": "Military"
            }
        ]
    },
    "信": {
        "level": 15,
        "meaning": "Believe",
        "similar": [
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            },
            {
                "kanji": "倍",
                "level": 12,
                "meaning": "Double"
            }
        ]
    },
    "急": {
        "level": 16,
        "meaning": "Hurry",
        "similar": []
    },
    "遠": {
        "level": 16,
        "meaning": "Far",
        "similar": [
            {
                "kanji": "速",
                "level": 10,
                "meaning": "Fast"
            }
        ]
    },
    "典": {
        "level": 16,
        "meaning": "Rule",
        "similar": []
    },
    "冒": {
        "level": 16,
        "meaning": "Dare",
        "similar": [
            {
                "kanji": "門",
                "level": 16,
                "meaning": "Gates"
            },
            {
                "kanji": "帽",
                "level": 47,
                "meaning": "Hat"
            },
            {
                "kanji": "晶",
                "level": 50,
                "meaning": "Crystal"
            }
        ]
    },
    "冗": {
        "level": 16,
        "meaning": "Superfluous",
        "similar": []
    },
    "危": {
        "level": 16,
        "meaning": "Dangerous",
        "similar": []
    },
    "荷": {
        "level": 16,
        "meaning": "Luggage",
        "similar": [
            {
                "kanji": "若",
                "level": 19,
                "meaning": "Young"
            },
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            },
            {
                "kanji": "匿",
                "level": 60,
                "meaning": "Hide"
            },
            {
                "kanji": "奇",
                "level": 28,
                "meaning": "Odd"
            }
        ]
    },
    "取": {
        "level": 16,
        "meaning": "Take",
        "similar": [
            {
                "kanji": "耳",
                "level": 4,
                "meaning": "Ear"
            }
        ]
    },
    "品": {
        "level": 16,
        "meaning": "Product",
        "similar": []
    },
    "政": {
        "level": 16,
        "meaning": "Politics",
        "similar": [
            {
                "kanji": "攻",
                "level": 28,
                "meaning": "Aggression"
            },
            {
                "kanji": "致",
                "level": 38,
                "meaning": "Do"
            }
        ]
    },
    "留": {
        "level": 16,
        "meaning": "Detain",
        "similar": [
            {
                "kanji": "貿",
                "level": 36,
                "meaning": "Trade"
            }
        ]
    },
    "門": {
        "level": 16,
        "meaning": "Gates",
        "similar": [
            {
                "kanji": "明",
                "level": 6,
                "meaning": "Bright"
            },
            {
                "kanji": "冒",
                "level": 16,
                "meaning": "Dare"
            },
            {
                "kanji": "胃",
                "level": 27,
                "meaning": "Stomach"
            },
            {
                "kanji": "閉",
                "level": 33,
                "meaning": "Closed"
            },
            {
                "kanji": "問",
                "level": 13,
                "meaning": "Problem"
            }
        ]
    },
    "関": {
        "level": 16,
        "meaning": "Related",
        "similar": [
            {
                "kanji": "閑",
                "level": 59,
                "meaning": "Leisure"
            },
            {
                "kanji": "閲",
                "level": 57,
                "meaning": "Inspection"
            },
            {
                "kanji": "閉",
                "level": 33,
                "meaning": "Closed"
            },
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            },
            {
                "kanji": "開",
                "level": 10,
                "meaning": "Open"
            },
            {
                "kanji": "閥",
                "level": 19,
                "meaning": "Clique"
            }
        ]
    },
    "阪": {
        "level": 16,
        "meaning": "Heights",
        "similar": []
    },
    "険": {
        "level": 16,
        "meaning": "Risky",
        "similar": [
            {
                "kanji": "倹",
                "level": 60,
                "meaning": "Thrifty"
            }
        ]
    },
    "曜": {
        "level": 16,
        "meaning": "Weekday",
        "similar": []
    },
    "書": {
        "level": 16,
        "meaning": "Write",
        "similar": [
            {
                "kanji": "春",
                "level": 15,
                "meaning": "Spring"
            }
        ]
    },
    "園": {
        "level": 16,
        "meaning": "Garden",
        "similar": []
    },
    "真": {
        "level": 16,
        "meaning": "Reality",
        "similar": [
            {
                "kanji": "具",
                "level": 9,
                "meaning": "Tool"
            },
            {
                "kanji": "慎",
                "level": 39,
                "meaning": "Humility"
            },
            {
                "kanji": "直",
                "level": 6,
                "meaning": "Fix"
            },
            {
                "kanji": "臭",
                "level": 20,
                "meaning": "Stinking"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            }
        ]
    },
    "面": {
        "level": 16,
        "meaning": "Face",
        "similar": []
    },
    "証": {
        "level": 16,
        "meaning": "Evidence",
        "similar": [
            {
                "kanji": "誕",
                "level": 22,
                "meaning": "Birth"
            },
            {
                "kanji": "謹",
                "level": 60,
                "meaning": "Humble"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "誇",
                "level": 46,
                "meaning": "Pride"
            },
            {
                "kanji": "試",
                "level": 9,
                "meaning": "Try"
            }
        ]
    },
    "笑": {
        "level": 16,
        "meaning": "Laugh",
        "similar": [
            {
                "kanji": "符",
                "level": 30,
                "meaning": "Token"
            }
        ]
    },
    "存": {
        "level": 16,
        "meaning": "Exist",
        "similar": []
    },
    "守": {
        "level": 16,
        "meaning": "Protect",
        "similar": []
    },
    "箱": {
        "level": 16,
        "meaning": "Box",
        "similar": []
    },
    "専": {
        "level": 16,
        "meaning": "Specialty",
        "similar": [
            {
                "kanji": "博",
                "level": 28,
                "meaning": "Exhibition"
            },
            {
                "kanji": "恵",
                "level": 37,
                "meaning": "Favor"
            },
            {
                "kanji": "時",
                "level": 7,
                "meaning": "Time"
            }
        ]
    },
    "治": {
        "level": 16,
        "meaning": "Cure",
        "similar": [
            {
                "kanji": "沿",
                "level": 34,
                "meaning": "Run"
            },
            {
                "kanji": "沼",
                "level": 43,
                "meaning": "Bog"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            }
        ]
    },
    "浴": {
        "level": 16,
        "meaning": "Bathe",
        "similar": [
            {
                "kanji": "容",
                "level": 19,
                "meaning": "Form"
            },
            {
                "kanji": "沿",
                "level": 34,
                "meaning": "Run"
            },
            {
                "kanji": "溶",
                "level": 48,
                "meaning": "Melt"
            },
            {
                "kanji": "治",
                "level": 16,
                "meaning": "Cure"
            },
            {
                "kanji": "沼",
                "level": 43,
                "meaning": "Bog"
            },
            {
                "kanji": "活",
                "level": 6,
                "meaning": "Lively"
            },
            {
                "kanji": "俗",
                "level": 49,
                "meaning": "Vulgar"
            },
            {
                "kanji": "谷",
                "level": 5,
                "meaning": "Valley"
            }
        ]
    },
    "幸": {
        "level": 16,
        "meaning": "Happiness",
        "similar": [
            {
                "kanji": "辛",
                "level": 44,
                "meaning": "Spicy"
            },
            {
                "kanji": "南",
                "level": 6,
                "meaning": "South"
            },
            {
                "kanji": "坪",
                "level": 57,
                "meaning": "Two"
            },
            {
                "kanji": "執",
                "level": 37,
                "meaning": "Tenacious"
            },
            {
                "kanji": "珠",
                "level": 49,
                "meaning": "Pearl"
            },
            {
                "kanji": "宰",
                "level": 56,
                "meaning": "Manager"
            }
        ]
    },
    "府": {
        "level": 16,
        "meaning": "Government",
        "similar": [
            {
                "kanji": "対",
                "level": 8,
                "meaning": "Versus"
            }
        ]
    },
    "弁": {
        "level": 16,
        "meaning": "Dialect",
        "similar": []
    },
    "辞": {
        "level": 16,
        "meaning": "Quit",
        "similar": []
    },
    "係": {
        "level": 16,
        "meaning": "Connection",
        "similar": [
            {
                "kanji": "系",
                "level": 30,
                "meaning": "Lineage"
            },
            {
                "kanji": "孫",
                "level": 31,
                "meaning": "Grandchild"
            }
        ]
    },
    "恋": {
        "level": 17,
        "meaning": "Romance",
        "similar": [
            {
                "kanji": "応",
                "level": 22,
                "meaning": "Respond"
            }
        ]
    },
    "側": {
        "level": 17,
        "meaning": "Side",
        "similar": [
            {
                "kanji": "則",
                "level": 23,
                "meaning": "Rule"
            },
            {
                "kanji": "測",
                "level": 35,
                "meaning": "Measure"
            },
            {
                "kanji": "負",
                "level": 9,
                "meaning": "Lose"
            }
        ]
    },
    "悲": {
        "level": 17,
        "meaning": "Sad",
        "similar": []
    },
    "愛": {
        "level": 17,
        "meaning": "Love",
        "similar": []
    },
    "無": {
        "level": 17,
        "meaning": "Nothing",
        "similar": []
    },
    "兵": {
        "level": 17,
        "meaning": "Soldier",
        "similar": []
    },
    "劇": {
        "level": 17,
        "meaning": "Drama",
        "similar": []
    },
    "原": {
        "level": 17,
        "meaning": "Original",
        "similar": [
            {
                "kanji": "源",
                "level": 34,
                "meaning": "Origin"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "僚",
                "level": 29,
                "meaning": "Colleague"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "負",
                "level": 9,
                "meaning": "Lose"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            }
        ]
    },
    "敗": {
        "level": 17,
        "meaning": "Failure",
        "similar": [
            {
                "kanji": "販",
                "level": 24,
                "meaning": "Sell"
            },
            {
                "kanji": "眺",
                "level": 45,
                "meaning": "Stare"
            },
            {
                "kanji": "財",
                "level": 19,
                "meaning": "Wealth"
            },
            {
                "kanji": "関",
                "level": 16,
                "meaning": "Related"
            },
            {
                "kanji": "賊",
                "level": 57,
                "meaning": "Robber"
            },
            {
                "kanji": "賄",
                "level": 38,
                "meaning": "Bribe"
            },
            {
                "kanji": "暖",
                "level": 32,
                "meaning": "Warm"
            }
        ]
    },
    "喜": {
        "level": 17,
        "meaning": "Rejoice",
        "similar": [
            {
                "kanji": "鼓",
                "level": 57,
                "meaning": "Drum"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            }
        ]
    },
    "薬": {
        "level": 17,
        "meaning": "Medicine",
        "similar": [
            {
                "kanji": "楽",
                "level": 8,
                "meaning": "Comfort"
            }
        ]
    },
    "是": {
        "level": 17,
        "meaning": "Absolutely",
        "similar": [
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "提",
                "level": 22,
                "meaning": "Present"
            },
            {
                "kanji": "堤",
                "level": 50,
                "meaning": "Embankment"
            }
        ]
    },
    "虚": {
        "level": 17,
        "meaning": "Void",
        "similar": [
            {
                "kanji": "戯",
                "level": 58,
                "meaning": "Play"
            }
        ]
    },
    "因": {
        "level": 17,
        "meaning": "Cause",
        "similar": [
            {
                "kanji": "囲",
                "level": 14,
                "meaning": "Surround"
            },
            {
                "kanji": "困",
                "level": 20,
                "meaning": "Distressed"
            },
            {
                "kanji": "図",
                "level": 5,
                "meaning": "Diagram"
            }
        ]
    },
    "非": {
        "level": 17,
        "meaning": "Injustice",
        "similar": [
            {
                "kanji": "俳",
                "level": 23,
                "meaning": "Haiku"
            },
            {
                "kanji": "排",
                "level": 40,
                "meaning": "Reject"
            }
        ]
    },
    "果": {
        "level": 17,
        "meaning": "Fruit",
        "similar": [
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "是",
                "level": 17,
                "meaning": "Absolutely"
            },
            {
                "kanji": "某",
                "level": 60,
                "meaning": "Certain"
            },
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "巣",
                "level": 31,
                "meaning": "Nest"
            },
            {
                "kanji": "軟",
                "level": 51,
                "meaning": "Soft"
            }
        ]
    },
    "堂": {
        "level": 17,
        "meaning": "Hall",
        "similar": [
            {
                "kanji": "掌",
                "level": 47,
                "meaning": "Manipulate"
            },
            {
                "kanji": "常",
                "level": 17,
                "meaning": "Ordinary"
            },
            {
                "kanji": "党",
                "level": 32,
                "meaning": "Group"
            }
        ]
    },
    "栄": {
        "level": 17,
        "meaning": "Prosper",
        "similar": [
            {
                "kanji": "深",
                "level": 12,
                "meaning": "Deep"
            }
        ]
    },
    "塩": {
        "level": 17,
        "meaning": "Salt",
        "similar": []
    },
    "梅": {
        "level": 17,
        "meaning": "Ume",
        "similar": []
    },
    "覚": {
        "level": 17,
        "meaning": "Memorize",
        "similar": [
            {
                "kanji": "視",
                "level": 24,
                "meaning": "Look"
            }
        ]
    },
    "詳": {
        "level": 17,
        "meaning": "Detailed",
        "similar": [
            {
                "kanji": "群",
                "level": 39,
                "meaning": "Flock"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "誇",
                "level": 46,
                "meaning": "Pride"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "謙",
                "level": 39,
                "meaning": "Modesty"
            },
            {
                "kanji": "謡",
                "level": 54,
                "meaning": "Noh"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            }
        ]
    },
    "説": {
        "level": 17,
        "meaning": "Theory",
        "similar": [
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            }
        ]
    },
    "識": {
        "level": 17,
        "meaning": "Discerning",
        "similar": []
    },
    "警": {
        "level": 17,
        "meaning": "Warn",
        "similar": []
    },
    "官": {
        "level": 17,
        "meaning": "Government",
        "similar": [
            {
                "kanji": "宮",
                "level": 22,
                "meaning": "Shinto"
            }
        ]
    },
    "察": {
        "level": 17,
        "meaning": "Guess",
        "similar": [
            {
                "kanji": "擦",
                "level": 43,
                "meaning": "Grate"
            },
            {
                "kanji": "際",
                "level": 21,
                "meaning": "Occasion"
            },
            {
                "kanji": "祭",
                "level": 12,
                "meaning": "Festival"
            }
        ]
    },
    "細": {
        "level": 17,
        "meaning": "Thin",
        "similar": [
            {
                "kanji": "紳",
                "level": 56,
                "meaning": "Gentleman"
            },
            {
                "kanji": "紺",
                "level": 57,
                "meaning": "Navy"
            },
            {
                "kanji": "絹",
                "level": 58,
                "meaning": "Silk"
            }
        ]
    },
    "結": {
        "level": 17,
        "meaning": "Bind",
        "similar": [
            {
                "kanji": "給",
                "level": 27,
                "meaning": "Salary"
            },
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "紹",
                "level": 35,
                "meaning": "Introduce"
            },
            {
                "kanji": "絡",
                "level": 19,
                "meaning": "Entangle"
            },
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            },
            {
                "kanji": "緒",
                "level": 38,
                "meaning": "Together"
            },
            {
                "kanji": "続",
                "level": 19,
                "meaning": "Continue"
            }
        ]
    },
    "渉": {
        "level": 17,
        "meaning": "Ford",
        "similar": [
            {
                "kanji": "歩",
                "level": 6,
                "meaning": "Walk"
            },
            {
                "kanji": "淑",
                "level": 58,
                "meaning": "Graceful"
            }
        ]
    },
    "席": {
        "level": 17,
        "meaning": "Seat",
        "similar": [
            {
                "kanji": "度",
                "level": 9,
                "meaning": "Degrees"
            }
        ]
    },
    "常": {
        "level": 17,
        "meaning": "Ordinary",
        "similar": [
            {
                "kanji": "党",
                "level": 32,
                "meaning": "Group"
            },
            {
                "kanji": "堂",
                "level": 17,
                "meaning": "Hall"
            }
        ]
    },
    "干": {
        "level": 17,
        "meaning": "Dry",
        "similar": [
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            },
            {
                "kanji": "井",
                "level": 45,
                "meaning": "Well"
            },
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            }
        ]
    },
    "幻": {
        "level": 17,
        "meaning": "Illusion",
        "similar": [
            {
                "kanji": "幼",
                "level": 28,
                "meaning": "Infancy"
            }
        ]
    },
    "底": {
        "level": 17,
        "meaning": "Bottom",
        "similar": []
    },
    "鼻": {
        "level": 17,
        "meaning": "Nose",
        "similar": []
    },
    "署": {
        "level": 17,
        "meaning": "Government Office",
        "similar": [
            {
                "kanji": "暑",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "著",
                "level": 33,
                "meaning": "Author"
            },
            {
                "kanji": "置",
                "level": 22,
                "meaning": "Put"
            }
        ]
    },
    "借": {
        "level": 18,
        "meaning": "Borrow",
        "similar": [
            {
                "kanji": "惜",
                "level": 55,
                "meaning": "Frugal"
            },
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "措",
                "level": 41,
                "meaning": "Set"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            }
        ]
    },
    "達": {
        "level": 18,
        "meaning": "Attain",
        "similar": [
            {
                "kanji": "遅",
                "level": 35,
                "meaning": "Slow"
            }
        ]
    },
    "僧": {
        "level": 18,
        "meaning": "Priest",
        "similar": [
            {
                "kanji": "憎",
                "level": 47,
                "meaning": "Hate"
            },
            {
                "kanji": "層",
                "level": 24,
                "meaning": "Layer"
            },
            {
                "kanji": "増",
                "level": 21,
                "meaning": "Increase"
            },
            {
                "kanji": "唱",
                "level": 40,
                "meaning": "Chant"
            }
        ]
    },
    "胸": {
        "level": 18,
        "meaning": "Chest",
        "similar": [
            {
                "kanji": "脳",
                "level": 18,
                "meaning": "Brain"
            }
        ]
    },
    "脳": {
        "level": 18,
        "meaning": "Brain",
        "similar": [
            {
                "kanji": "胸",
                "level": 18,
                "meaning": "Chest"
            }
        ]
    },
    "焼": {
        "level": 18,
        "meaning": "Bake",
        "similar": []
    },
    "煙": {
        "level": 18,
        "meaning": "Smoke",
        "similar": []
    },
    "句": {
        "level": 18,
        "meaning": "Paragraph",
        "similar": [
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "局",
                "level": 8,
                "meaning": "Bureau"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            }
        ]
    },
    "可": {
        "level": 18,
        "meaning": "Possible",
        "similar": [
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            }
        ]
    },
    "告": {
        "level": 18,
        "meaning": "Announce",
        "similar": [
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            },
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            },
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            },
            {
                "kanji": "周",
                "level": 14,
                "meaning": "Circumference"
            },
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            },
            {
                "kanji": "乱",
                "level": 19,
                "meaning": "Riot"
            }
        ]
    },
    "喫": {
        "level": 18,
        "meaning": "Consume",
        "similar": []
    },
    "静": {
        "level": 18,
        "meaning": "Quiet",
        "similar": []
    },
    "枚": {
        "level": 18,
        "meaning": "Flat Objects Counter",
        "similar": [
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "板",
                "level": 29,
                "meaning": "Board"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "杉",
                "level": 35,
                "meaning": "Cedar"
            },
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            },
            {
                "kanji": "校",
                "level": 7,
                "meaning": "School"
            }
        ]
    },
    "報": {
        "level": 18,
        "meaning": "News",
        "similar": []
    },
    "類": {
        "level": 18,
        "meaning": "Type",
        "similar": [
            {
                "kanji": "積",
                "level": 29,
                "meaning": "Accumulate"
            },
            {
                "kanji": "瀬",
                "level": 41,
                "meaning": "Rapids"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            },
            {
                "kanji": "頼",
                "level": 36,
                "meaning": "Trust"
            },
            {
                "kanji": "質",
                "level": 24,
                "meaning": "Quality"
            }
        ]
    },
    "祈": {
        "level": 18,
        "meaning": "Pray",
        "similar": [
            {
                "kanji": "祥",
                "level": 52,
                "meaning": "Auspicious"
            }
        ]
    },
    "禁": {
        "level": 18,
        "meaning": "Prohibit",
        "similar": [
            {
                "kanji": "標",
                "level": 13,
                "meaning": "Signpost"
            },
            {
                "kanji": "襟",
                "level": 51,
                "meaning": "Collar"
            },
            {
                "kanji": "桟",
                "level": 60,
                "meaning": "Jetty"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "森",
                "level": 8,
                "meaning": "Forest"
            },
            {
                "kanji": "棒",
                "level": 31,
                "meaning": "Pole"
            }
        ]
    },
    "禅": {
        "level": 18,
        "meaning": "Zen",
        "similar": [
            {
                "kanji": "神",
                "level": 11,
                "meaning": "God"
            },
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "弾",
                "level": 37,
                "meaning": "Bullet"
            }
        ]
    },
    "訓": {
        "level": 18,
        "meaning": "Instruction",
        "similar": [
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "設",
                "level": 21,
                "meaning": "Establish"
            }
        ]
    },
    "種": {
        "level": 18,
        "meaning": "Kind",
        "similar": [
            {
                "kanji": "糧",
                "level": 52,
                "meaning": "Provisions"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            }
        ]
    },
    "許": {
        "level": 18,
        "meaning": "Permit",
        "similar": [
            {
                "kanji": "詳",
                "level": 17,
                "meaning": "Detailed"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "誇",
                "level": 46,
                "meaning": "Pride"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            }
        ]
    },
    "等": {
        "level": 18,
        "meaning": "Equal",
        "similar": [
            {
                "kanji": "符",
                "level": 30,
                "meaning": "Token"
            }
        ]
    },
    "汽": {
        "level": 18,
        "meaning": "Steam",
        "similar": [
            {
                "kanji": "汚",
                "level": 32,
                "meaning": "Dirty"
            },
            {
                "kanji": "汗",
                "level": 26,
                "meaning": "Sweat"
            }
        ]
    },
    "洗": {
        "level": 18,
        "meaning": "Wash",
        "similar": [
            {
                "kanji": "浜",
                "level": 28,
                "meaning": "Beach"
            }
        ]
    },
    "座": {
        "level": 18,
        "meaning": "Sit",
        "similar": [
            {
                "kanji": "卒",
                "level": 14,
                "meaning": "Graduate"
            }
        ]
    },
    "弓": {
        "level": 18,
        "meaning": "Bow",
        "similar": [
            {
                "kanji": "引",
                "level": 3,
                "meaning": "Pull"
            },
            {
                "kanji": "弔",
                "level": 57,
                "meaning": "Condolence"
            }
        ]
    },
    "忘": {
        "level": 18,
        "meaning": "Forget",
        "similar": [
            {
                "kanji": "応",
                "level": 22,
                "meaning": "Respond"
            },
            {
                "kanji": "志",
                "level": 32,
                "meaning": "Intention"
            },
            {
                "kanji": "忌",
                "level": 59,
                "meaning": "Mourning"
            }
        ]
    },
    "連": {
        "level": 19,
        "meaning": "Take Along",
        "similar": [
            {
                "kanji": "運",
                "level": 10,
                "meaning": "Carry"
            },
            {
                "kanji": "軒",
                "level": 51,
                "meaning": "House"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "迫",
                "level": 27,
                "meaning": "Urge"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            }
        ]
    },
    "冊": {
        "level": 19,
        "meaning": "Book Counter",
        "similar": []
    },
    "舌": {
        "level": 19,
        "meaning": "Tongue",
        "similar": [
            {
                "kanji": "乱",
                "level": 19,
                "meaning": "Riot"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "古",
                "level": 3,
                "meaning": "Old"
            },
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "居",
                "level": 25,
                "meaning": "Alive"
            },
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            },
            {
                "kanji": "含",
                "level": 25,
                "meaning": "Include"
            }
        ]
    },
    "加": {
        "level": 19,
        "meaning": "Add",
        "similar": [
            {
                "kanji": "召",
                "level": 51,
                "meaning": "Call"
            },
            {
                "kanji": "石",
                "level": 4,
                "meaning": "Stone"
            },
            {
                "kanji": "司",
                "level": 15,
                "meaning": "Director"
            }
        ]
    },
    "若": {
        "level": 19,
        "meaning": "Young",
        "similar": [
            {
                "kanji": "匿",
                "level": 60,
                "meaning": "Hide"
            },
            {
                "kanji": "荷",
                "level": 16,
                "meaning": "Luggage"
            },
            {
                "kanji": "苦",
                "level": 9,
                "meaning": "Suffering"
            },
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            },
            {
                "kanji": "培",
                "level": 48,
                "meaning": "Cultivate"
            }
        ]
    },
    "史": {
        "level": 19,
        "meaning": "History",
        "similar": [
            {
                "kanji": "吸",
                "level": 22,
                "meaning": "Suck"
            },
            {
                "kanji": "兄",
                "level": 5,
                "meaning": "Older"
            },
            {
                "kanji": "吹",
                "level": 40,
                "meaning": "Blow"
            },
            {
                "kanji": "束",
                "level": 14,
                "meaning": "Bundle"
            },
            {
                "kanji": "吟",
                "level": 59,
                "meaning": "Recital"
            },
            {
                "kanji": "足",
                "level": 4,
                "meaning": "Foot"
            }
        ]
    },
    "改": {
        "level": 19,
        "meaning": "Renew",
        "similar": []
    },
    "善": {
        "level": 19,
        "meaning": "Morally Good",
        "similar": []
    },
    "閥": {
        "level": 19,
        "meaning": "Clique",
        "similar": [
            {
                "kanji": "閲",
                "level": 57,
                "meaning": "Inspection"
            },
            {
                "kanji": "閉",
                "level": 33,
                "meaning": "Closed"
            },
            {
                "kanji": "閑",
                "level": 59,
                "meaning": "Leisure"
            },
            {
                "kanji": "関",
                "level": 16,
                "meaning": "Related"
            }
        ]
    },
    "昆": {
        "level": 19,
        "meaning": "Descendants",
        "similar": [
            {
                "kanji": "見",
                "level": 4,
                "meaning": "See"
            },
            {
                "kanji": "混",
                "level": 19,
                "meaning": "Mix"
            }
        ]
    },
    "易": {
        "level": 19,
        "meaning": "Easy",
        "similar": []
    },
    "暴": {
        "level": 19,
        "meaning": "Violence",
        "similar": [
            {
                "kanji": "爆",
                "level": 37,
                "meaning": "Explode"
            }
        ]
    },
    "団": {
        "level": 19,
        "meaning": "Group",
        "similar": []
    },
    "順": {
        "level": 19,
        "meaning": "Order",
        "similar": [
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            }
        ]
    },
    "詞": {
        "level": 19,
        "meaning": "Part Of Speech",
        "similar": [
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            },
            {
                "kanji": "調",
                "level": 10,
                "meaning": "Investigate"
            }
        ]
    },
    "笛": {
        "level": 19,
        "meaning": "Flute",
        "similar": [
            {
                "kanji": "算",
                "level": 10,
                "meaning": "Calculate"
            }
        ]
    },
    "歴": {
        "level": 19,
        "meaning": "Continuation",
        "similar": [
            {
                "kanji": "暦",
                "level": 45,
                "meaning": "Calendar"
            }
        ]
    },
    "宇": {
        "level": 19,
        "meaning": "Outer Space",
        "similar": [
            {
                "kanji": "完",
                "level": 14,
                "meaning": "Perfect"
            }
        ]
    },
    "宙": {
        "level": 19,
        "meaning": "Midair",
        "similar": [
            {
                "kanji": "油",
                "level": 35,
                "meaning": "Oil"
            }
        ]
    },
    "容": {
        "level": 19,
        "meaning": "Form",
        "similar": [
            {
                "kanji": "客",
                "level": 9,
                "meaning": "Guest"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            },
            {
                "kanji": "溶",
                "level": 48,
                "meaning": "Melt"
            },
            {
                "kanji": "俗",
                "level": 49,
                "meaning": "Vulgar"
            },
            {
                "kanji": "谷",
                "level": 5,
                "meaning": "Valley"
            }
        ]
    },
    "節": {
        "level": 19,
        "meaning": "Season",
        "similar": []
    },
    "比": {
        "level": 19,
        "meaning": "Compare",
        "similar": []
    },
    "履": {
        "level": 19,
        "meaning": "Boots",
        "similar": [
            {
                "kanji": "復",
                "level": 26,
                "meaning": "Restore"
            }
        ]
    },
    "財": {
        "level": 19,
        "meaning": "Wealth",
        "similar": [
            {
                "kanji": "則",
                "level": 23,
                "meaning": "Rule"
            },
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            },
            {
                "kanji": "眺",
                "level": 45,
                "meaning": "Stare"
            },
            {
                "kanji": "販",
                "level": 24,
                "meaning": "Sell"
            },
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            },
            {
                "kanji": "賊",
                "level": 57,
                "meaning": "Robber"
            }
        ]
    },
    "絡": {
        "level": 19,
        "meaning": "Entangle",
        "similar": [
            {
                "kanji": "給",
                "level": 27,
                "meaning": "Salary"
            },
            {
                "kanji": "終",
                "level": 10,
                "meaning": "End"
            },
            {
                "kanji": "紹",
                "level": 35,
                "meaning": "Introduce"
            },
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            }
        ]
    },
    "続": {
        "level": 19,
        "meaning": "Continue",
        "similar": [
            {
                "kanji": "統",
                "level": 22,
                "meaning": "Unite"
            },
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "絞",
                "level": 25,
                "meaning": "Strangle"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            }
        ]
    },
    "混": {
        "level": 19,
        "meaning": "Mix",
        "similar": [
            {
                "kanji": "渇",
                "level": 30,
                "meaning": "Thirst"
            },
            {
                "kanji": "昆",
                "level": 19,
                "meaning": "Descendants"
            }
        ]
    },
    "布": {
        "level": 19,
        "meaning": "Cloth",
        "similar": [
            {
                "kanji": "市",
                "level": 3,
                "meaning": "City"
            },
            {
                "kanji": "希",
                "level": 14,
                "meaning": "Wish"
            }
        ]
    },
    "減": {
        "level": 19,
        "meaning": "Decrease",
        "similar": [
            {
                "kanji": "涼",
                "level": 46,
                "meaning": "Cool"
            },
            {
                "kanji": "滅",
                "level": 43,
                "meaning": "Destroy"
            }
        ]
    },
    "乱": {
        "level": 19,
        "meaning": "Riot",
        "similar": [
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            },
            {
                "kanji": "克",
                "level": 42,
                "meaning": "Overcome"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "古",
                "level": 3,
                "meaning": "Old"
            }
        ]
    },
    "徒": {
        "level": 19,
        "meaning": "Junior",
        "similar": [
            {
                "kanji": "従",
                "level": 26,
                "meaning": "Obey"
            }
        ]
    },
    "得": {
        "level": 19,
        "meaning": "Acquire",
        "similar": []
    },
    "忙": {
        "level": 19,
        "meaning": "Busy",
        "similar": []
    },
    "個": {
        "level": 20,
        "meaning": "Individual",
        "similar": [
            {
                "kanji": "固",
                "level": 14,
                "meaning": "Hard"
            }
        ]
    },
    "倒": {
        "level": 20,
        "meaning": "Overthrow",
        "similar": [
            {
                "kanji": "到",
                "level": 42,
                "meaning": "Arrival"
            }
        ]
    },
    "災": {
        "level": 20,
        "meaning": "Disaster",
        "similar": []
    },
    "臭": {
        "level": 20,
        "meaning": "Stinking",
        "similar": [
            {
                "kanji": "具",
                "level": 9,
                "meaning": "Tool"
            },
            {
                "kanji": "泉",
                "level": 12,
                "meaning": "Spring"
            },
            {
                "kanji": "真",
                "level": 16,
                "meaning": "Reality"
            },
            {
                "kanji": "夏",
                "level": 7,
                "meaning": "Summer"
            }
        ]
    },
    "犯": {
        "level": 20,
        "meaning": "Crime",
        "similar": []
    },
    "率": {
        "level": 20,
        "meaning": "Percent",
        "similar": []
    },
    "厚": {
        "level": 20,
        "meaning": "Thick",
        "similar": []
    },
    "産": {
        "level": 20,
        "meaning": "Give Birth",
        "similar": []
    },
    "防": {
        "level": 20,
        "meaning": "Prevent",
        "similar": []
    },
    "難": {
        "level": 20,
        "meaning": "Difficult",
        "similar": []
    },
    "困": {
        "level": 20,
        "meaning": "Distressed",
        "similar": [
            {
                "kanji": "因",
                "level": 17,
                "meaning": "Cause"
            },
            {
                "kanji": "囚",
                "level": 60,
                "meaning": "Criminal"
            },
            {
                "kanji": "囲",
                "level": 14,
                "meaning": "Surround"
            }
        ]
    },
    "震": {
        "level": 20,
        "meaning": "Earthquake",
        "similar": []
    },
    "圧": {
        "level": 20,
        "meaning": "Pressure",
        "similar": [
            {
                "kanji": "左",
                "level": 2,
                "meaning": "Left"
            },
            {
                "kanji": "在",
                "level": 20,
                "meaning": "Exist"
            },
            {
                "kanji": "佐",
                "level": 47,
                "meaning": "Help"
            }
        ]
    },
    "在": {
        "level": 20,
        "meaning": "Exist",
        "similar": [
            {
                "kanji": "圧",
                "level": 20,
                "meaning": "Pressure"
            },
            {
                "kanji": "左",
                "level": 2,
                "meaning": "Left"
            },
            {
                "kanji": "仕",
                "level": 4,
                "meaning": "Doing"
            }
        ]
    },
    "被": {
        "level": 20,
        "meaning": "Incur",
        "similar": []
    },
    "械": {
        "level": 20,
        "meaning": "Contraption",
        "similar": [
            {
                "kanji": "桟",
                "level": 60,
                "meaning": "Jetty"
            },
            {
                "kanji": "杯",
                "level": 29,
                "meaning": "Cup"
            }
        ]
    },
    "確": {
        "level": 20,
        "meaning": "Certain",
        "similar": [
            {
                "kanji": "唯",
                "level": 49,
                "meaning": "Solely"
            },
            {
                "kanji": "雄",
                "level": 29,
                "meaning": "Male"
            }
        ]
    },
    "裕": {
        "level": 20,
        "meaning": "Abundant",
        "similar": [
            {
                "kanji": "溶",
                "level": 48,
                "meaning": "Melt"
            }
        ]
    },
    "飛": {
        "level": 20,
        "meaning": "Fly",
        "similar": []
    },
    "夢": {
        "level": 20,
        "meaning": "Dream",
        "similar": []
    },
    "妨": {
        "level": 20,
        "meaning": "Obstruct",
        "similar": [
            {
                "kanji": "姉",
                "level": 6,
                "meaning": "Older"
            },
            {
                "kanji": "坊",
                "level": 22,
                "meaning": "Monk"
            }
        ]
    },
    "妻": {
        "level": 20,
        "meaning": "Wife",
        "similar": []
    },
    "機": {
        "level": 20,
        "meaning": "Machine",
        "similar": [
            {
                "kanji": "幾",
                "level": 31,
                "meaning": "How"
            }
        ]
    },
    "穴": {
        "level": 20,
        "meaning": "Hole",
        "similar": []
    },
    "嫌": {
        "level": 20,
        "meaning": "Dislike",
        "similar": [
            {
                "kanji": "兼",
                "level": 40,
                "meaning": "Concurrently"
            },
            {
                "kanji": "廉",
                "level": 60,
                "meaning": "Bargain"
            }
        ]
    },
    "論": {
        "level": 20,
        "meaning": "Theory",
        "similar": [
            {
                "kanji": "諭",
                "level": 53,
                "meaning": "Admonish"
            }
        ]
    },
    "議": {
        "level": 20,
        "meaning": "Deliberation",
        "similar": [
            {
                "kanji": "犠",
                "level": 40,
                "meaning": "Sacrifice"
            },
            {
                "kanji": "儀",
                "level": 41,
                "meaning": "Ceremony"
            }
        ]
    },
    "害": {
        "level": 20,
        "meaning": "Damage",
        "similar": [
            {
                "kanji": "割",
                "level": 23,
                "meaning": "Divide"
            },
            {
                "kanji": "寄",
                "level": 29,
                "meaning": "Approach"
            },
            {
                "kanji": "宝",
                "level": 4,
                "meaning": "Treasure"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            },
            {
                "kanji": "悟",
                "level": 49,
                "meaning": "Comprehension"
            }
        ]
    },
    "尻": {
        "level": 20,
        "meaning": "Butt",
        "similar": []
    },
    "尾": {
        "level": 20,
        "meaning": "Tail",
        "similar": [
            {
                "kanji": "尼",
                "level": 49,
                "meaning": "Nun"
            }
        ]
    },
    "経": {
        "level": 20,
        "meaning": "Passage of Time",
        "similar": [
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            }
        ]
    },
    "余": {
        "level": 20,
        "meaning": "Surplus",
        "similar": [
            {
                "kanji": "会",
                "level": 5,
                "meaning": "Meet"
            },
            {
                "kanji": "示",
                "level": 22,
                "meaning": "Indicate"
            },
            {
                "kanji": "徐",
                "level": 53,
                "meaning": "Gently"
            },
            {
                "kanji": "除",
                "level": 31,
                "meaning": "Exclude"
            },
            {
                "kanji": "途",
                "level": 27,
                "meaning": "Route"
            }
        ]
    },
    "罪": {
        "level": 20,
        "meaning": "Guilt",
        "similar": []
    },
    "判": {
        "level": 21,
        "meaning": "Judge",
        "similar": [
            {
                "kanji": "刊",
                "level": 38,
                "meaning": "Edition"
            },
            {
                "kanji": "羊",
                "level": 6,
                "meaning": "Sheep"
            },
            {
                "kanji": "半",
                "level": 3,
                "meaning": "Half"
            }
        ]
    },
    "制": {
        "level": 21,
        "meaning": "Control",
        "similar": []
    },
    "批": {
        "level": 21,
        "meaning": "Criticism",
        "similar": []
    },
    "務": {
        "level": 21,
        "meaning": "Task",
        "similar": []
    },
    "挙": {
        "level": 21,
        "meaning": "Raise",
        "similar": []
    },
    "敵": {
        "level": 21,
        "meaning": "Enemy",
        "similar": [
            {
                "kanji": "適",
                "level": 30,
                "meaning": "Suitable"
            }
        ]
    },
    "断": {
        "level": 21,
        "meaning": "Cut Off",
        "similar": [
            {
                "kanji": "粋",
                "level": 34,
                "meaning": "Stylish"
            },
            {
                "kanji": "料",
                "level": 13,
                "meaning": "Fee"
            },
            {
                "kanji": "析",
                "level": 42,
                "meaning": "Analysis"
            },
            {
                "kanji": "数",
                "level": 8,
                "meaning": "Count"
            },
            {
                "kanji": "新",
                "level": 9,
                "meaning": "New"
            }
        ]
    },
    "際": {
        "level": 21,
        "meaning": "Occasion",
        "similar": [
            {
                "kanji": "察",
                "level": 17,
                "meaning": "Guess"
            },
            {
                "kanji": "祭",
                "level": 12,
                "meaning": "Festival"
            }
        ]
    },
    "省": {
        "level": 21,
        "meaning": "Conserve",
        "similar": [
            {
                "kanji": "首",
                "level": 6,
                "meaning": "Neck"
            }
        ]
    },
    "条": {
        "level": 21,
        "meaning": "Clause",
        "similar": [
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "休",
                "level": 4,
                "meaning": "Rest"
            }
        ]
    },
    "査": {
        "level": 21,
        "meaning": "Inspect",
        "similar": [
            {
                "kanji": "租",
                "level": 46,
                "meaning": "Tariff"
            },
            {
                "kanji": "粗",
                "level": 55,
                "meaning": "Coarse"
            }
        ]
    },
    "増": {
        "level": 21,
        "meaning": "Increase",
        "similar": [
            {
                "kanji": "憎",
                "level": 47,
                "meaning": "Hate"
            },
            {
                "kanji": "僧",
                "level": 18,
                "meaning": "Priest"
            },
            {
                "kanji": "層",
                "level": 24,
                "meaning": "Layer"
            }
        ]
    },
    "検": {
        "level": 21,
        "meaning": "Examine",
        "similar": [
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "倹",
                "level": 60,
                "meaning": "Thrifty"
            }
        ]
    },
    "委": {
        "level": 21,
        "meaning": "Committee",
        "similar": [
            {
                "kanji": "季",
                "level": 14,
                "meaning": "Seasons"
            },
            {
                "kanji": "秀",
                "level": 23,
                "meaning": "Excel"
            }
        ]
    },
    "解": {
        "level": 21,
        "meaning": "Untie",
        "similar": []
    },
    "税": {
        "level": 21,
        "meaning": "Tax",
        "similar": []
    },
    "権": {
        "level": 21,
        "meaning": "Rights",
        "similar": [
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "設": {
        "level": 21,
        "meaning": "Establish",
        "similar": [
            {
                "kanji": "詠",
                "level": 59,
                "meaning": "Compose"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "訟",
                "level": 25,
                "meaning": "Lawsuit"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "訳",
                "level": 32,
                "meaning": "Translation"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            }
        ]
    },
    "評": {
        "level": 21,
        "meaning": "Evaluate",
        "similar": [
            {
                "kanji": "詳",
                "level": 17,
                "meaning": "Detailed"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            },
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            }
        ]
    },
    "認": {
        "level": 21,
        "meaning": "Recognize",
        "similar": [
            {
                "kanji": "誌",
                "level": 33,
                "meaning": "Magazine"
            },
            {
                "kanji": "感",
                "level": 13,
                "meaning": "Feeling"
            },
            {
                "kanji": "憾",
                "level": 55,
                "meaning": "Remorse"
            }
        ]
    },
    "審": {
        "level": 21,
        "meaning": "Judge",
        "similar": [
            {
                "kanji": "番",
                "level": 8,
                "meaning": "Number"
            },
            {
                "kanji": "藩",
                "level": 58,
                "meaning": "Fiefdom"
            }
        ]
    },
    "岡": {
        "level": 21,
        "meaning": "Hill",
        "similar": []
    },
    "責": {
        "level": 21,
        "meaning": "Blame",
        "similar": [
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            },
            {
                "kanji": "現",
                "level": 23,
                "meaning": "Present"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "載",
                "level": 24,
                "meaning": "Publish"
            }
        ]
    },
    "資": {
        "level": 21,
        "meaning": "Resources",
        "similar": [
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            }
        ]
    },
    "素": {
        "level": 21,
        "meaning": "Element",
        "similar": [
            {
                "kanji": "索",
                "level": 29,
                "meaning": "Search"
            }
        ]
    },
    "派": {
        "level": 21,
        "meaning": "Sect",
        "similar": [
            {
                "kanji": "染",
                "level": 32,
                "meaning": "Dye"
            }
        ]
    },
    "総": {
        "level": 21,
        "meaning": "Whole",
        "similar": []
    },
    "済": {
        "level": 21,
        "meaning": "Come To An End",
        "similar": [
            {
                "kanji": "斉",
                "level": 43,
                "meaning": "Simultaneous"
            }
        ]
    },
    "件": {
        "level": 21,
        "meaning": "Matter",
        "similar": [
            {
                "kanji": "伴",
                "level": 38,
                "meaning": "Accompany"
            },
            {
                "kanji": "併",
                "level": 38,
                "meaning": "Join"
            }
        ]
    },
    "任": {
        "level": 21,
        "meaning": "Duty",
        "similar": [
            {
                "kanji": "佐",
                "level": 47,
                "meaning": "Help"
            },
            {
                "kanji": "仕",
                "level": 4,
                "meaning": "Doing"
            },
            {
                "kanji": "侮",
                "level": 59,
                "meaning": "Despise"
            },
            {
                "kanji": "狂",
                "level": 45,
                "meaning": "Lunatic"
            },
            {
                "kanji": "妊",
                "level": 38,
                "meaning": "Pregnant"
            },
            {
                "kanji": "低",
                "level": 11,
                "meaning": "Low"
            },
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            }
        ]
    },
    "企": {
        "level": 21,
        "meaning": "Plan",
        "similar": []
    },
    "義": {
        "level": 21,
        "meaning": "Righteousness",
        "similar": [
            {
                "kanji": "儀",
                "level": 41,
                "meaning": "Ceremony"
            },
            {
                "kanji": "犠",
                "level": 40,
                "meaning": "Sacrifice"
            }
        ]
    },
    "値": {
        "level": 22,
        "meaning": "Value",
        "similar": [
            {
                "kanji": "盾",
                "level": 48,
                "meaning": "Shield"
            },
            {
                "kanji": "直",
                "level": 6,
                "meaning": "Fix"
            },
            {
                "kanji": "植",
                "level": 12,
                "meaning": "Plant"
            },
            {
                "kanji": "殖",
                "level": 40,
                "meaning": "Multiply"
            },
            {
                "kanji": "看",
                "level": 23,
                "meaning": "Watch"
            },
            {
                "kanji": "便",
                "level": 11,
                "meaning": "Convenience"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            }
        ]
    },
    "過": {
        "level": 22,
        "meaning": "Surpass",
        "similar": []
    },
    "脱": {
        "level": 22,
        "meaning": "Undress",
        "similar": []
    },
    "態": {
        "level": 22,
        "meaning": "Appearance",
        "similar": [
            {
                "kanji": "能",
                "level": 14,
                "meaning": "Ability"
            }
        ]
    },
    "副": {
        "level": 22,
        "meaning": "Vice",
        "similar": []
    },
    "状": {
        "level": 22,
        "meaning": "Condition",
        "similar": []
    },
    "勢": {
        "level": 22,
        "meaning": "Force",
        "similar": [
            {
                "kanji": "熱",
                "level": 13,
                "meaning": "Heat"
            }
        ]
    },
    "提": {
        "level": 22,
        "meaning": "Present",
        "similar": [
            {
                "kanji": "堤",
                "level": 50,
                "meaning": "Embankment"
            },
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            },
            {
                "kanji": "是",
                "level": 17,
                "meaning": "Absolutely"
            },
            {
                "kanji": "捜",
                "level": 25,
                "meaning": "Search"
            }
        ]
    },
    "援": {
        "level": 22,
        "meaning": "Aid",
        "similar": [
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            },
            {
                "kanji": "揺",
                "level": 42,
                "meaning": "Shake"
            },
            {
                "kanji": "授",
                "level": 26,
                "meaning": "Instruct"
            },
            {
                "kanji": "渓",
                "level": 60,
                "meaning": "Valley"
            },
            {
                "kanji": "暖",
                "level": 32,
                "meaning": "Warm"
            }
        ]
    },
    "各": {
        "level": 22,
        "meaning": "Each",
        "similar": [
            {
                "kanji": "名",
                "level": 4,
                "meaning": "Name"
            },
            {
                "kanji": "谷",
                "level": 5,
                "meaning": "Valley"
            }
        ]
    },
    "吸": {
        "level": 22,
        "meaning": "Suck",
        "similar": [
            {
                "kanji": "史",
                "level": 19,
                "meaning": "History"
            },
            {
                "kanji": "吹",
                "level": 40,
                "meaning": "Blow"
            }
        ]
    },
    "営": {
        "level": 22,
        "meaning": "Manage",
        "similar": [
            {
                "kanji": "宮",
                "level": 22,
                "meaning": "Shinto"
            }
        ]
    },
    "藤": {
        "level": 22,
        "meaning": "Wisteria",
        "similar": []
    },
    "坊": {
        "level": 22,
        "meaning": "Monk",
        "similar": [
            {
                "kanji": "芳",
                "level": 52,
                "meaning": "Perfume"
            },
            {
                "kanji": "妨",
                "level": 20,
                "meaning": "Obstruct"
            },
            {
                "kanji": "坑",
                "level": 60,
                "meaning": "Pit"
            }
        ]
    },
    "域": {
        "level": 22,
        "meaning": "Region",
        "similar": []
    },
    "領": {
        "level": 22,
        "meaning": "Territory",
        "similar": [
            {
                "kanji": "預",
                "level": 30,
                "meaning": "Deposit"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "貿",
                "level": 36,
                "meaning": "Trade"
            }
        ]
    },
    "案": {
        "level": 22,
        "meaning": "Plan",
        "similar": [
            {
                "kanji": "突",
                "level": 26,
                "meaning": "Stab"
            },
            {
                "kanji": "実",
                "level": 9,
                "meaning": "Truth"
            },
            {
                "kanji": "宗",
                "level": 29,
                "meaning": "Religion"
            }
        ]
    },
    "示": {
        "level": 22,
        "meaning": "Indicate",
        "similar": [
            {
                "kanji": "赤",
                "level": 4,
                "meaning": "Red"
            },
            {
                "kanji": "余",
                "level": 20,
                "meaning": "Surplus"
            }
        ]
    },
    "観": {
        "level": 22,
        "meaning": "View",
        "similar": []
    },
    "姿": {
        "level": 22,
        "meaning": "Figure",
        "similar": []
    },
    "誕": {
        "level": 22,
        "meaning": "Birth",
        "similar": [
            {
                "kanji": "証",
                "level": 16,
                "meaning": "Evidence"
            }
        ]
    },
    "策": {
        "level": 22,
        "meaning": "Plan",
        "similar": []
    },
    "宮": {
        "level": 22,
        "meaning": "Shinto Shrine",
        "similar": [
            {
                "kanji": "官",
                "level": 17,
                "meaning": "Government"
            },
            {
                "kanji": "営",
                "level": 22,
                "meaning": "Manage"
            }
        ]
    },
    "寝": {
        "level": 22,
        "meaning": "Lie Down",
        "similar": [
            {
                "kanji": "浸",
                "level": 49,
                "meaning": "Immersed"
            }
        ]
    },
    "費": {
        "level": 22,
        "meaning": "Expense",
        "similar": []
    },
    "賀": {
        "level": 22,
        "meaning": "Congratulations",
        "similar": [
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            },
            {
                "kanji": "損",
                "level": 34,
                "meaning": "Loss"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "賞",
                "level": 13,
                "meaning": "Prize"
            }
        ]
    },
    "統": {
        "level": 22,
        "meaning": "Unite",
        "similar": [
            {
                "kanji": "絞",
                "level": 25,
                "meaning": "Strangle"
            },
            {
                "kanji": "続",
                "level": 19,
                "meaning": "Continue"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            }
        ]
    },
    "置": {
        "level": 22,
        "meaning": "Put",
        "similar": [
            {
                "kanji": "買",
                "level": 8,
                "meaning": "Buy"
            },
            {
                "kanji": "署",
                "level": 17,
                "meaning": "Government"
            }
        ]
    },
    "罰": {
        "level": 22,
        "meaning": "Penalty",
        "similar": []
    },
    "価": {
        "level": 22,
        "meaning": "Value",
        "similar": []
    },
    "応": {
        "level": 22,
        "meaning": "Respond",
        "similar": [
            {
                "kanji": "忘",
                "level": 18,
                "meaning": "Forget"
            },
            {
                "kanji": "志",
                "level": 32,
                "meaning": "Intention"
            },
            {
                "kanji": "忌",
                "level": 59,
                "meaning": "Mourning"
            },
            {
                "kanji": "恋",
                "level": 17,
                "meaning": "Romance"
            }
        ]
    },
    "停": {
        "level": 23,
        "meaning": "Halt",
        "similar": [
            {
                "kanji": "亭",
                "level": 50,
                "meaning": "Restaurant"
            }
        ]
    },
    "職": {
        "level": 23,
        "meaning": "Employment",
        "similar": []
    },
    "備": {
        "level": 23,
        "meaning": "Provide",
        "similar": []
    },
    "優": {
        "level": 23,
        "meaning": "Superior",
        "similar": [
            {
                "kanji": "憂",
                "level": 55,
                "meaning": "Grief"
            }
        ]
    },
    "則": {
        "level": 23,
        "meaning": "Rule",
        "similar": [
            {
                "kanji": "側",
                "level": 17,
                "meaning": "Side"
            },
            {
                "kanji": "財",
                "level": 19,
                "meaning": "Wealth"
            },
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            },
            {
                "kanji": "測",
                "level": 35,
                "meaning": "Measure"
            }
        ]
    },
    "割": {
        "level": 23,
        "meaning": "Divide",
        "similar": [
            {
                "kanji": "害",
                "level": 20,
                "meaning": "Damage"
            },
            {
                "kanji": "寄",
                "level": 29,
                "meaning": "Approach"
            }
        ]
    },
    "収": {
        "level": 23,
        "meaning": "Obtain",
        "similar": []
    },
    "現": {
        "level": 23,
        "meaning": "Present Time",
        "similar": [
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "理",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "規",
                "level": 23,
                "meaning": "Standard"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            }
        ]
    },
    "呼": {
        "level": 23,
        "meaning": "Call",
        "similar": []
    },
    "施": {
        "level": 23,
        "meaning": "Carry Out",
        "similar": [
            {
                "kanji": "旅",
                "level": 12,
                "meaning": "Trip"
            }
        ]
    },
    "看": {
        "level": 23,
        "meaning": "Watch Over",
        "similar": [
            {
                "kanji": "首",
                "level": 6,
                "meaning": "Neck"
            },
            {
                "kanji": "盾",
                "level": 48,
                "meaning": "Shield"
            },
            {
                "kanji": "着",
                "level": 12,
                "meaning": "Wear"
            },
            {
                "kanji": "値",
                "level": 22,
                "meaning": "Value"
            }
        ]
    },
    "革": {
        "level": 23,
        "meaning": "Leather",
        "similar": [
            {
                "kanji": "靴",
                "level": 27,
                "meaning": "Shoes"
            }
        ]
    },
    "城": {
        "level": 23,
        "meaning": "Castle",
        "similar": [
            {
                "kanji": "茂",
                "level": 40,
                "meaning": "Luxuriant"
            }
        ]
    },
    "裁": {
        "level": 23,
        "meaning": "Judge",
        "similar": [
            {
                "kanji": "栽",
                "level": 54,
                "meaning": "Planting"
            }
        ]
    },
    "規": {
        "level": 23,
        "meaning": "Standard",
        "similar": [
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "現",
                "level": 23,
                "meaning": "Present"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            }
        ]
    },
    "秀": {
        "level": 23,
        "meaning": "Excel",
        "similar": [
            {
                "kanji": "委",
                "level": 21,
                "meaning": "Committee"
            },
            {
                "kanji": "透",
                "level": 40,
                "meaning": "Transparent"
            }
        ]
    },
    "鬼": {
        "level": 23,
        "meaning": "Demon",
        "similar": [
            {
                "kanji": "塊",
                "level": 45,
                "meaning": "Lump"
            },
            {
                "kanji": "魂",
                "level": 45,
                "meaning": "Soul"
            },
            {
                "kanji": "的",
                "level": 14,
                "meaning": "Target"
            },
            {
                "kanji": "卑",
                "level": 59,
                "meaning": "Lowly"
            }
        ]
    },
    "護": {
        "level": 23,
        "meaning": "Defend",
        "similar": [
            {
                "kanji": "穫",
                "level": 48,
                "meaning": "Harvest"
            }
        ]
    },
    "宅": {
        "level": 23,
        "meaning": "House",
        "similar": [
            {
                "kanji": "完",
                "level": 14,
                "meaning": "Perfect"
            }
        ]
    },
    "導": {
        "level": 23,
        "meaning": "Lead",
        "similar": [
            {
                "kanji": "道",
                "level": 8,
                "meaning": "Road"
            }
        ]
    },
    "沢": {
        "level": 23,
        "meaning": "Swamp",
        "similar": [
            {
                "kanji": "決",
                "level": 8,
                "meaning": "Decide"
            },
            {
                "kanji": "泥",
                "level": 31,
                "meaning": "Mud"
            },
            {
                "kanji": "快",
                "level": 30,
                "meaning": "Pleasant"
            },
            {
                "kanji": "択",
                "level": 38,
                "meaning": "Select"
            },
            {
                "kanji": "涙",
                "level": 44,
                "meaning": "Teardrop"
            }
        ]
    },
    "贅": {
        "level": 23,
        "meaning": "Luxury",
        "similar": []
    },
    "崎": {
        "level": 23,
        "meaning": "Cape",
        "similar": [
            {
                "kanji": "寄",
                "level": 29,
                "meaning": "Approach"
            },
            {
                "kanji": "奇",
                "level": 28,
                "meaning": "Odd"
            },
            {
                "kanji": "岩",
                "level": 15,
                "meaning": "Boulder"
            }
        ]
    },
    "師": {
        "level": 23,
        "meaning": "Teacher",
        "similar": [
            {
                "kanji": "帥",
                "level": 53,
                "meaning": "Commander"
            }
        ]
    },
    "乳": {
        "level": 23,
        "meaning": "Milk",
        "similar": []
    },
    "幹": {
        "level": 23,
        "meaning": "Tree Trunk",
        "similar": [
            {
                "kanji": "軒",
                "level": 51,
                "meaning": "House"
            },
            {
                "kanji": "乾",
                "level": 29,
                "meaning": "Dry"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "朝",
                "level": 8,
                "meaning": "Morning"
            },
            {
                "kanji": "軽",
                "level": 10,
                "meaning": "Lightweight"
            },
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            },
            {
                "kanji": "幕",
                "level": 34,
                "meaning": "Curtain"
            }
        ]
    },
    "準": {
        "level": 23,
        "meaning": "Standard",
        "similar": [
            {
                "kanji": "准",
                "level": 53,
                "meaning": "Semi"
            },
            {
                "kanji": "携",
                "level": 40,
                "meaning": "Portable"
            },
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            }
        ]
    },
    "演": {
        "level": 23,
        "meaning": "Perform",
        "similar": [
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            }
        ]
    },
    "張": {
        "level": 23,
        "meaning": "Stretch",
        "similar": [
            {
                "kanji": "帳",
                "level": 48,
                "meaning": "Notebook"
            },
            {
                "kanji": "長",
                "level": 6,
                "meaning": "Long"
            }
        ]
    },
    "律": {
        "level": 23,
        "meaning": "Law",
        "similar": []
    },
    "俳": {
        "level": 23,
        "meaning": "Haiku",
        "similar": [
            {
                "kanji": "非",
                "level": 17,
                "meaning": "Injustice"
            },
            {
                "kanji": "排",
                "level": 40,
                "meaning": "Reject"
            }
        ]
    },
    "違": {
        "level": 24,
        "meaning": "Different",
        "similar": []
    },
    "肩": {
        "level": 24,
        "meaning": "Shoulder",
        "similar": []
    },
    "腕": {
        "level": 24,
        "meaning": "Arm",
        "similar": []
    },
    "腰": {
        "level": 24,
        "meaning": "Waist",
        "similar": [
            {
                "kanji": "要",
                "level": 9,
                "meaning": "Need"
            }
        ]
    },
    "燃": {
        "level": 24,
        "meaning": "Burn",
        "similar": []
    },
    "量": {
        "level": 24,
        "meaning": "Quantity",
        "similar": []
    },
    "担": {
        "level": 24,
        "meaning": "Carry",
        "similar": [
            {
                "kanji": "押",
                "level": 30,
                "meaning": "Push"
            },
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "抽",
                "level": 49,
                "meaning": "Pluck"
            },
            {
                "kanji": "捜",
                "level": 25,
                "meaning": "Search"
            },
            {
                "kanji": "挿",
                "level": 47,
                "meaning": "Insert"
            }
        ]
    },
    "狭": {
        "level": 24,
        "meaning": "Narrow",
        "similar": []
    },
    "環": {
        "level": 24,
        "meaning": "Loop",
        "similar": []
    },
    "型": {
        "level": 24,
        "meaning": "Model",
        "similar": []
    },
    "株": {
        "level": 24,
        "meaning": "Stocks",
        "similar": [
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            },
            {
                "kanji": "検",
                "level": 21,
                "meaning": "Examine"
            },
            {
                "kanji": "様",
                "level": 13,
                "meaning": "Formal"
            },
            {
                "kanji": "殊",
                "level": 52,
                "meaning": "Especially"
            },
            {
                "kanji": "桟",
                "level": 60,
                "meaning": "Jetty"
            },
            {
                "kanji": "析",
                "level": 42,
                "meaning": "Analysis"
            }
        ]
    },
    "額": {
        "level": 24,
        "meaning": "Amount",
        "similar": [
            {
                "kanji": "賞",
                "level": 13,
                "meaning": "Prize"
            }
        ]
    },
    "境": {
        "level": 24,
        "meaning": "Boundary",
        "similar": [
            {
                "kanji": "鏡",
                "level": 13,
                "meaning": "Mirror"
            },
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "滝",
                "level": 45,
                "meaning": "Waterfall"
            }
        ]
    },
    "製": {
        "level": 24,
        "meaning": "Manufacture",
        "similar": []
    },
    "祝": {
        "level": 24,
        "meaning": "Celebrate",
        "similar": [
            {
                "kanji": "悦",
                "level": 56,
                "meaning": "Delight"
            }
        ]
    },
    "視": {
        "level": 24,
        "meaning": "Look At",
        "similar": [
            {
                "kanji": "覚",
                "level": 17,
                "meaning": "Memorize"
            },
            {
                "kanji": "神",
                "level": 11,
                "meaning": "God"
            },
            {
                "kanji": "裸",
                "level": 45,
                "meaning": "Naked"
            }
        ]
    },
    "触": {
        "level": 24,
        "meaning": "Touch",
        "similar": []
    },
    "武": {
        "level": 24,
        "meaning": "Military",
        "similar": [
            {
                "kanji": "式",
                "level": 15,
                "meaning": "Ritual"
            }
        ]
    },
    "管": {
        "level": 24,
        "meaning": "Pipe",
        "similar": []
    },
    "届": {
        "level": 24,
        "meaning": "Deliver",
        "similar": []
    },
    "展": {
        "level": 24,
        "meaning": "Expand",
        "similar": []
    },
    "象": {
        "level": 24,
        "meaning": "Elephant",
        "similar": [
            {
                "kanji": "像",
                "level": 13,
                "meaning": "Statue"
            }
        ]
    },
    "層": {
        "level": 24,
        "meaning": "Layer",
        "similar": [
            {
                "kanji": "僧",
                "level": 18,
                "meaning": "Priest"
            },
            {
                "kanji": "増",
                "level": 21,
                "meaning": "Increase"
            },
            {
                "kanji": "憎",
                "level": 47,
                "meaning": "Hate"
            }
        ]
    },
    "販": {
        "level": 24,
        "meaning": "Sell",
        "similar": [
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            },
            {
                "kanji": "財",
                "level": 19,
                "meaning": "Wealth"
            },
            {
                "kanji": "暖",
                "level": 32,
                "meaning": "Warm"
            }
        ]
    },
    "質": {
        "level": 24,
        "meaning": "Quality",
        "similar": [
            {
                "kanji": "循",
                "level": 55,
                "meaning": "Circulation"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "類",
                "level": 18,
                "meaning": "Type"
            }
        ]
    },
    "差": {
        "level": 24,
        "meaning": "Distinction",
        "similar": [
            {
                "kanji": "美",
                "level": 9,
                "meaning": "Beauty"
            }
        ]
    },
    "庁": {
        "level": 24,
        "meaning": "Agency",
        "similar": [
            {
                "kanji": "対",
                "level": 8,
                "meaning": "Versus"
            }
        ]
    },
    "載": {
        "level": 24,
        "meaning": "Publish",
        "similar": [
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            }
        ]
    },
    "輸": {
        "level": 24,
        "meaning": "Transport",
        "similar": [
            {
                "kanji": "輪",
                "level": 13,
                "meaning": "Wheel"
            }
        ]
    },
    "供": {
        "level": 24,
        "meaning": "Servant",
        "similar": [
            {
                "kanji": "侍",
                "level": 44,
                "meaning": "Samurai"
            },
            {
                "kanji": "共",
                "level": 11,
                "meaning": "Together"
            }
        ]
    },
    "述": {
        "level": 24,
        "meaning": "Mention",
        "similar": []
    },
    "候": {
        "level": 25,
        "meaning": "Climate",
        "similar": [
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            }
        ]
    },
    "逮": {
        "level": 25,
        "meaning": "Apprehend",
        "similar": []
    },
    "肥": {
        "level": 25,
        "meaning": "Obese",
        "similar": []
    },
    "慣": {
        "level": 25,
        "meaning": "Accustomed",
        "similar": [
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "貫",
                "level": 52,
                "meaning": "Pierce"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            }
        ]
    },
    "抜": {
        "level": 25,
        "meaning": "Extract",
        "similar": [
            {
                "kanji": "技",
                "level": 14,
                "meaning": "Skill"
            },
            {
                "kanji": "投",
                "level": 8,
                "meaning": "Throw"
            },
            {
                "kanji": "扱",
                "level": 38,
                "meaning": "Handle"
            },
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            },
            {
                "kanji": "麦",
                "level": 5,
                "meaning": "Wheat"
            },
            {
                "kanji": "坂",
                "level": 15,
                "meaning": "Slope"
            }
        ]
    },
    "効": {
        "level": 25,
        "meaning": "Effective",
        "similar": [
            {
                "kanji": "劾",
                "level": 60,
                "meaning": "Censure"
            }
        ]
    },
    "捕": {
        "level": 25,
        "meaning": "Catch",
        "similar": [
            {
                "kanji": "浦",
                "level": 51,
                "meaning": "Bay"
            },
            {
                "kanji": "挿",
                "level": 47,
                "meaning": "Insert"
            },
            {
                "kanji": "押",
                "level": 30,
                "meaning": "Push"
            }
        ]
    },
    "捜": {
        "level": 25,
        "meaning": "Search",
        "similar": [
            {
                "kanji": "提",
                "level": 22,
                "meaning": "Present"
            },
            {
                "kanji": "担",
                "level": 24,
                "meaning": "Carry"
            },
            {
                "kanji": "押",
                "level": 30,
                "meaning": "Push"
            }
        ]
    },
    "掛": {
        "level": 25,
        "meaning": "Hang",
        "similar": [
            {
                "kanji": "持",
                "level": 9,
                "meaning": "Hold"
            }
        ]
    },
    "含": {
        "level": 25,
        "meaning": "Include",
        "similar": [
            {
                "kanji": "合",
                "level": 12,
                "meaning": "Suit"
            },
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            },
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "后",
                "level": 50,
                "meaning": "Empress"
            },
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            }
        ]
    },
    "限": {
        "level": 25,
        "meaning": "Limit",
        "similar": [
            {
                "kanji": "恨",
                "level": 47,
                "meaning": "Grudge"
            }
        ]
    },
    "景": {
        "level": 25,
        "meaning": "Scene",
        "similar": [
            {
                "kanji": "影",
                "level": 25,
                "meaning": "Shadow"
            }
        ]
    },
    "隠": {
        "level": 25,
        "meaning": "Hide",
        "similar": []
    },
    "替": {
        "level": 25,
        "meaning": "Replace",
        "similar": [
            {
                "kanji": "賛",
                "level": 32,
                "meaning": "Agree"
            },
            {
                "kanji": "潜",
                "level": 41,
                "meaning": "Conceal"
            },
            {
                "kanji": "暦",
                "level": 45,
                "meaning": "Calendar"
            },
            {
                "kanji": "春",
                "level": 15,
                "meaning": "Spring"
            }
        ]
    },
    "響": {
        "level": 25,
        "meaning": "Echo",
        "similar": []
    },
    "補": {
        "level": 25,
        "meaning": "Supplement",
        "similar": []
    },
    "票": {
        "level": 25,
        "meaning": "Ballot",
        "similar": [
            {
                "kanji": "漂",
                "level": 50,
                "meaning": "Drift"
            },
            {
                "kanji": "標",
                "level": 13,
                "meaning": "Signpost"
            }
        ]
    },
    "構": {
        "level": 25,
        "meaning": "Set Up",
        "similar": [
            {
                "kanji": "溝",
                "level": 45,
                "meaning": "Gutter"
            },
            {
                "kanji": "講",
                "level": 35,
                "meaning": "Lecture"
            }
        ]
    },
    "訟": {
        "level": 25,
        "meaning": "Lawsuit",
        "similar": [
            {
                "kanji": "診",
                "level": 29,
                "meaning": "Diagnose"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "設",
                "level": 21,
                "meaning": "Establish"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "誠",
                "level": 41,
                "meaning": "Sincerity"
            }
        ]
    },
    "模": {
        "level": 25,
        "meaning": "Imitation",
        "similar": [
            {
                "kanji": "棋",
                "level": 39,
                "meaning": "Chess"
            },
            {
                "kanji": "棟",
                "level": 46,
                "meaning": "Pillar"
            },
            {
                "kanji": "植",
                "level": 12,
                "meaning": "Plant"
            },
            {
                "kanji": "膜",
                "level": 57,
                "meaning": "Membrane"
            },
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            }
        ]
    },
    "訴": {
        "level": 25,
        "meaning": "Sue",
        "similar": [
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "訟",
                "level": 25,
                "meaning": "Lawsuit"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            }
        ]
    },
    "鮮": {
        "level": 25,
        "meaning": "Fresh",
        "similar": []
    },
    "居": {
        "level": 25,
        "meaning": "Alive",
        "similar": [
            {
                "kanji": "局",
                "level": 8,
                "meaning": "Bureau"
            },
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            },
            {
                "kanji": "据",
                "level": 53,
                "meaning": "Install"
            }
        ]
    },
    "豊": {
        "level": 25,
        "meaning": "Plentiful",
        "similar": []
    },
    "属": {
        "level": 25,
        "meaning": "Belong",
        "similar": [
            {
                "kanji": "嘱",
                "level": 58,
                "meaning": "Request"
            }
        ]
    },
    "況": {
        "level": 25,
        "meaning": "Condition",
        "similar": [
            {
                "kanji": "沖",
                "level": 36,
                "meaning": "Open"
            },
            {
                "kanji": "悦",
                "level": 56,
                "meaning": "Delight"
            },
            {
                "kanji": "党",
                "level": 32,
                "meaning": "Group"
            }
        ]
    },
    "絞": {
        "level": 25,
        "meaning": "Strangle",
        "similar": [
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "統",
                "level": 22,
                "meaning": "Unite"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "緑",
                "level": 13,
                "meaning": "Green"
            },
            {
                "kanji": "続",
                "level": 19,
                "meaning": "Continue"
            }
        ]
    },
    "巻": {
        "level": 25,
        "meaning": "Scroll",
        "similar": [
            {
                "kanji": "圏",
                "level": 39,
                "meaning": "Range"
            }
        ]
    },
    "与": {
        "level": 25,
        "meaning": "Give",
        "similar": []
    },
    "渡": {
        "level": 25,
        "meaning": "Transit",
        "similar": [
            {
                "kanji": "度",
                "level": 9,
                "meaning": "Degrees"
            }
        ]
    },
    "満": {
        "level": 25,
        "meaning": "Full",
        "similar": [
            {
                "kanji": "溝",
                "level": 45,
                "meaning": "Gutter"
            }
        ]
    },
    "輩": {
        "level": 25,
        "meaning": "Comrade",
        "similar": []
    },
    "影": {
        "level": 25,
        "meaning": "Shadow",
        "similar": [
            {
                "kanji": "景",
                "level": 25,
                "meaning": "Scene"
            }
        ]
    },
    "造": {
        "level": 26,
        "meaning": "Create",
        "similar": [
            {
                "kanji": "週",
                "level": 7,
                "meaning": "Week"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            }
        ]
    },
    "怪": {
        "level": 26,
        "meaning": "Suspicious",
        "similar": [
            {
                "kanji": "径",
                "level": 31,
                "meaning": "Diameter"
            }
        ]
    },
    "郵": {
        "level": 26,
        "meaning": "Mail",
        "similar": []
    },
    "再": {
        "level": 26,
        "meaning": "Again",
        "similar": []
    },
    "針": {
        "level": 26,
        "meaning": "Needle",
        "similar": [
            {
                "kanji": "鉢",
                "level": 48,
                "meaning": "Bowl"
            },
            {
                "kanji": "鈍",
                "level": 46,
                "meaning": "Dull"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            },
            {
                "kanji": "銅",
                "level": 35,
                "meaning": "Copper"
            },
            {
                "kanji": "金",
                "level": 5,
                "meaning": "Gold"
            },
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "鉱",
                "level": 41,
                "meaning": "Mineral"
            }
        ]
    },
    "我": {
        "level": 26,
        "meaning": "I",
        "similar": [
            {
                "kanji": "成",
                "level": 11,
                "meaning": "Become"
            }
        ]
    },
    "刺": {
        "level": 26,
        "meaning": "Stab",
        "similar": []
    },
    "鉛": {
        "level": 26,
        "meaning": "Lead",
        "similar": [
            {
                "kanji": "銘",
                "level": 50,
                "meaning": "Inscription"
            },
            {
                "kanji": "銅",
                "level": 35,
                "meaning": "Copper"
            },
            {
                "kanji": "鈴",
                "level": 39,
                "meaning": "Buzzer"
            },
            {
                "kanji": "鈍",
                "level": 46,
                "meaning": "Dull"
            },
            {
                "kanji": "鋭",
                "level": 40,
                "meaning": "Sharp"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            }
        ]
    },
    "創": {
        "level": 26,
        "meaning": "Create",
        "similar": []
    },
    "励": {
        "level": 26,
        "meaning": "Encourage",
        "similar": []
    },
    "独": {
        "level": 26,
        "meaning": "Alone",
        "similar": [
            {
                "kanji": "風",
                "level": 7,
                "meaning": "Wind"
            }
        ]
    },
    "振": {
        "level": 26,
        "meaning": "Shake",
        "similar": [
            {
                "kanji": "娠",
                "level": 38,
                "meaning": "Pregnant"
            },
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            },
            {
                "kanji": "挟",
                "level": 51,
                "meaning": "Between"
            },
            {
                "kanji": "抹",
                "level": 55,
                "meaning": "Erase"
            }
        ]
    },
    "占": {
        "level": 26,
        "meaning": "Fortune",
        "similar": []
    },
    "獣": {
        "level": 26,
        "meaning": "Beast",
        "similar": []
    },
    "印": {
        "level": 26,
        "meaning": "Seal",
        "similar": []
    },
    "授": {
        "level": 26,
        "meaning": "Instruct",
        "similar": [
            {
                "kanji": "援",
                "level": 22,
                "meaning": "Aid"
            },
            {
                "kanji": "受",
                "level": 9,
                "meaning": "Accept"
            },
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            }
        ]
    },
    "接": {
        "level": 26,
        "meaning": "Adjoin",
        "similar": [
            {
                "kanji": "挟",
                "level": 51,
                "meaning": "Between"
            }
        ]
    },
    "菓": {
        "level": 26,
        "meaning": "Cake",
        "similar": [
            {
                "kanji": "草",
                "level": 5,
                "meaning": "Grass"
            },
            {
                "kanji": "募",
                "level": 37,
                "meaning": "Recruit"
            },
            {
                "kanji": "堤",
                "level": 50,
                "meaning": "Embankment"
            },
            {
                "kanji": "某",
                "level": 60,
                "meaning": "Certain"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "巣",
                "level": 31,
                "meaning": "Nest"
            },
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            }
        ]
    },
    "故": {
        "level": 26,
        "meaning": "Circumstance",
        "similar": [
            {
                "kanji": "敬",
                "level": 33,
                "meaning": "Respect"
            }
        ]
    },
    "障": {
        "level": 26,
        "meaning": "Hinder",
        "similar": [
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "陣",
                "level": 37,
                "meaning": "Army"
            }
        ]
    },
    "討": {
        "level": 26,
        "meaning": "Chastise",
        "similar": [
            {
                "kanji": "訂",
                "level": 50,
                "meaning": "Revise"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "訪",
                "level": 27,
                "meaning": "Visit"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "訟",
                "level": 25,
                "meaning": "Lawsuit"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            }
        ]
    },
    "突": {
        "level": 26,
        "meaning": "Stab",
        "similar": [
            {
                "kanji": "実",
                "level": 9,
                "meaning": "Truth"
            },
            {
                "kanji": "空",
                "level": 5,
                "meaning": "Sky"
            },
            {
                "kanji": "究",
                "level": 8,
                "meaning": "Research"
            },
            {
                "kanji": "案",
                "level": 22,
                "meaning": "Plan"
            }
        ]
    },
    "筆": {
        "level": 26,
        "meaning": "Writing Brush",
        "similar": []
    },
    "汗": {
        "level": 26,
        "meaning": "Sweat",
        "similar": [
            {
                "kanji": "汁",
                "level": 35,
                "meaning": "Soup"
            },
            {
                "kanji": "汚",
                "level": 32,
                "meaning": "Dirty"
            },
            {
                "kanji": "汽",
                "level": 18,
                "meaning": "Steam"
            }
        ]
    },
    "豚": {
        "level": 26,
        "meaning": "Pork",
        "similar": [
            {
                "kanji": "脈",
                "level": 31,
                "meaning": "Vein"
            }
        ]
    },
    "貯": {
        "level": 26,
        "meaning": "Savings",
        "similar": []
    },
    "河": {
        "level": 26,
        "meaning": "River",
        "similar": [
            {
                "kanji": "沖",
                "level": 36,
                "meaning": "Open"
            },
            {
                "kanji": "涼",
                "level": 46,
                "meaning": "Cool"
            }
        ]
    },
    "較": {
        "level": 26,
        "meaning": "Contrast",
        "similar": [
            {
                "kanji": "軟",
                "level": 51,
                "meaning": "Soft"
            },
            {
                "kanji": "転",
                "level": 10,
                "meaning": "Revolve"
            }
        ]
    },
    "往": {
        "level": 26,
        "meaning": "Depart",
        "similar": [
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            }
        ]
    },
    "従": {
        "level": 26,
        "meaning": "Obey",
        "similar": [
            {
                "kanji": "徒",
                "level": 19,
                "meaning": "Junior"
            }
        ]
    },
    "復": {
        "level": 26,
        "meaning": "Restore",
        "similar": [
            {
                "kanji": "履",
                "level": 19,
                "meaning": "Boots"
            },
            {
                "kanji": "腹",
                "level": 27,
                "meaning": "Belly"
            },
            {
                "kanji": "便",
                "level": 11,
                "meaning": "Convenience"
            },
            {
                "kanji": "複",
                "level": 32,
                "meaning": "Duplicate"
            }
        ]
    },
    "徴": {
        "level": 26,
        "meaning": "Indication",
        "similar": [
            {
                "kanji": "微",
                "level": 28,
                "meaning": "Delicate"
            },
            {
                "kanji": "懲",
                "level": 43,
                "meaning": "Chastise"
            }
        ]
    },
    "激": {
        "level": 26,
        "meaning": "Fierce",
        "similar": []
    },
    "退": {
        "level": 27,
        "meaning": "Retreat",
        "similar": []
    },
    "怒": {
        "level": 27,
        "meaning": "Angry",
        "similar": []
    },
    "途": {
        "level": 27,
        "meaning": "Route",
        "similar": [
            {
                "kanji": "余",
                "level": 20,
                "meaning": "Surplus"
            },
            {
                "kanji": "迭",
                "level": 58,
                "meaning": "Alternate"
            }
        ]
    },
    "健": {
        "level": 27,
        "meaning": "Healthy",
        "similar": [
            {
                "kanji": "建",
                "level": 15,
                "meaning": "Build"
            }
        ]
    },
    "悩": {
        "level": 27,
        "meaning": "Worry",
        "similar": []
    },
    "胃": {
        "level": 27,
        "meaning": "Stomach",
        "similar": [
            {
                "kanji": "門",
                "level": 16,
                "meaning": "Gates"
            },
            {
                "kanji": "明",
                "level": 6,
                "meaning": "Bright"
            }
        ]
    },
    "郎": {
        "level": 27,
        "meaning": "Guy",
        "similar": [
            {
                "kanji": "廊",
                "level": 31,
                "meaning": "Corridor"
            },
            {
                "kanji": "郷",
                "level": 41,
                "meaning": "Hometown"
            }
        ]
    },
    "惑": {
        "level": 27,
        "meaning": "Misguided",
        "similar": [
            {
                "kanji": "感",
                "level": 13,
                "meaning": "Feeling"
            }
        ]
    },
    "腹": {
        "level": 27,
        "meaning": "Belly",
        "similar": [
            {
                "kanji": "復",
                "level": 26,
                "meaning": "Restore"
            },
            {
                "kanji": "脂",
                "level": 51,
                "meaning": "Fat"
            }
        ]
    },
    "招": {
        "level": 27,
        "meaning": "Beckon",
        "similar": [
            {
                "kanji": "拓",
                "level": 49,
                "meaning": "Cultivation"
            },
            {
                "kanji": "拘",
                "level": 49,
                "meaning": "Arrest"
            },
            {
                "kanji": "沼",
                "level": 43,
                "meaning": "Bog"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            }
        ]
    },
    "症": {
        "level": 27,
        "meaning": "Symptom",
        "similar": []
    },
    "痛": {
        "level": 27,
        "meaning": "Pain",
        "similar": []
    },
    "昇": {
        "level": 27,
        "meaning": "Ascend",
        "similar": [
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "畔",
                "level": 60,
                "meaning": "Shore"
            }
        ]
    },
    "暇": {
        "level": 27,
        "meaning": "Spare Time",
        "similar": []
    },
    "眠": {
        "level": 27,
        "meaning": "Sleep",
        "similar": []
    },
    "睡": {
        "level": 27,
        "meaning": "Drowsy",
        "similar": [
            {
                "kanji": "購",
                "level": 30,
                "meaning": "Subscription"
            },
            {
                "kanji": "星",
                "level": 6,
                "meaning": "Star"
            }
        ]
    },
    "靴": {
        "level": 27,
        "meaning": "Shoes",
        "similar": [
            {
                "kanji": "革",
                "level": 23,
                "meaning": "Leather"
            }
        ]
    },
    "極": {
        "level": 27,
        "meaning": "Extreme",
        "similar": []
    },
    "訪": {
        "level": 27,
        "meaning": "Visit",
        "similar": [
            {
                "kanji": "該",
                "level": 55,
                "meaning": "The"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "訂",
                "level": 50,
                "meaning": "Revise"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "記",
                "level": 7,
                "meaning": "Write"
            },
            {
                "kanji": "読",
                "level": 10,
                "meaning": "Read"
            }
        ]
    },
    "誘": {
        "level": 27,
        "meaning": "Invite",
        "similar": [
            {
                "kanji": "該",
                "level": 55,
                "meaning": "The"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "診",
                "level": 29,
                "meaning": "Diagnose"
            },
            {
                "kanji": "誠",
                "level": 41,
                "meaning": "Sincerity"
            }
        ]
    },
    "端": {
        "level": 27,
        "meaning": "Edge",
        "similar": []
    },
    "段": {
        "level": 27,
        "meaning": "Steps",
        "similar": []
    },
    "就": {
        "level": 27,
        "meaning": "Settle In",
        "similar": []
    },
    "屈": {
        "level": 27,
        "meaning": "Yield",
        "similar": [
            {
                "kanji": "堀",
                "level": 40,
                "meaning": "Ditch"
            },
            {
                "kanji": "掘",
                "level": 42,
                "meaning": "Dig"
            }
        ]
    },
    "貸": {
        "level": 27,
        "meaning": "Lend",
        "similar": [
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "僚",
                "level": 29,
                "meaning": "Colleague"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            }
        ]
    },
    "給": {
        "level": 27,
        "meaning": "Salary",
        "similar": [
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            },
            {
                "kanji": "絡",
                "level": 19,
                "meaning": "Entangle"
            },
            {
                "kanji": "紹",
                "level": 35,
                "meaning": "Introduce"
            },
            {
                "kanji": "絵",
                "level": 8,
                "meaning": "Drawing"
            }
        ]
    },
    "締": {
        "level": 27,
        "meaning": "Tighten",
        "similar": []
    },
    "織": {
        "level": 27,
        "meaning": "Weave",
        "similar": [
            {
                "kanji": "績",
                "level": 32,
                "meaning": "Exploits"
            }
        ]
    },
    "康": {
        "level": 27,
        "meaning": "Ease",
        "similar": []
    },
    "濃": {
        "level": 27,
        "meaning": "Thick",
        "similar": [
            {
                "kanji": "農",
                "level": 10,
                "meaning": "Farming"
            }
        ]
    },
    "迫": {
        "level": 27,
        "meaning": "Urge",
        "similar": [
            {
                "kanji": "連",
                "level": 19,
                "meaning": "Take"
            }
        ]
    },
    "迷": {
        "level": 27,
        "meaning": "Astray",
        "similar": [
            {
                "kanji": "送",
                "level": 9,
                "meaning": "Send"
            },
            {
                "kanji": "迭",
                "level": 58,
                "meaning": "Alternate"
            },
            {
                "kanji": "逆",
                "level": 28,
                "meaning": "Reverse"
            },
            {
                "kanji": "料",
                "level": 13,
                "meaning": "Fee"
            }
        ]
    },
    "逆": {
        "level": 28,
        "meaning": "Reverse",
        "similar": [
            {
                "kanji": "迷",
                "level": 27,
                "meaning": "Astray"
            }
        ]
    },
    "傘": {
        "level": 28,
        "meaning": "Umbrella",
        "similar": []
    },
    "児": {
        "level": 28,
        "meaning": "Child",
        "similar": [
            {
                "kanji": "旧",
                "level": 36,
                "meaning": "Former"
            },
            {
                "kanji": "見",
                "level": 4,
                "meaning": "See"
            },
            {
                "kanji": "更",
                "level": 30,
                "meaning": "Again"
            }
        ]
    },
    "憲": {
        "level": 28,
        "meaning": "Constitution",
        "similar": []
    },
    "冷": {
        "level": 28,
        "meaning": "Cool",
        "similar": [
            {
                "kanji": "令",
                "level": 11,
                "meaning": "Orders"
            }
        ]
    },
    "凍": {
        "level": 28,
        "meaning": "Frozen",
        "similar": [
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "陳",
                "level": 52,
                "meaning": "Exhibit"
            },
            {
                "kanji": "巣",
                "level": 31,
                "meaning": "Nest"
            },
            {
                "kanji": "更",
                "level": 30,
                "meaning": "Again"
            },
            {
                "kanji": "便",
                "level": 11,
                "meaning": "Convenience"
            },
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            }
        ]
    },
    "処": {
        "level": 28,
        "meaning": "Deal With",
        "similar": []
    },
    "券": {
        "level": 28,
        "meaning": "Ticket",
        "similar": [
            {
                "kanji": "粉",
                "level": 31,
                "meaning": "Powder"
            }
        ]
    },
    "録": {
        "level": 28,
        "meaning": "Record",
        "similar": []
    },
    "博": {
        "level": 28,
        "meaning": "Exhibition",
        "similar": [
            {
                "kanji": "専",
                "level": 16,
                "meaning": "Specialty"
            }
        ]
    },
    "撃": {
        "level": 28,
        "meaning": "Attack",
        "similar": []
    },
    "攻": {
        "level": 28,
        "meaning": "Aggression",
        "similar": [
            {
                "kanji": "政",
                "level": 16,
                "meaning": "Politics"
            },
            {
                "kanji": "戻",
                "level": 37,
                "meaning": "Return"
            },
            {
                "kanji": "坂",
                "level": 15,
                "meaning": "Slope"
            },
            {
                "kanji": "坑",
                "level": 60,
                "meaning": "Pit"
            },
            {
                "kanji": "致",
                "level": 38,
                "meaning": "Do"
            },
            {
                "kanji": "珠",
                "level": 49,
                "meaning": "Pearl"
            }
        ]
    },
    "隊": {
        "level": 28,
        "meaning": "Squad",
        "similar": [
            {
                "kanji": "墜",
                "level": 47,
                "meaning": "Crash"
            }
        ]
    },
    "益": {
        "level": 28,
        "meaning": "Benefit",
        "similar": [
            {
                "kanji": "盗",
                "level": 30,
                "meaning": "Steal"
            }
        ]
    },
    "衆": {
        "level": 28,
        "meaning": "Populace",
        "similar": []
    },
    "奇": {
        "level": 28,
        "meaning": "Odd",
        "similar": [
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            },
            {
                "kanji": "崎",
                "level": 23,
                "meaning": "Cape"
            },
            {
                "kanji": "寄",
                "level": 29,
                "meaning": "Approach"
            },
            {
                "kanji": "荷",
                "level": 16,
                "meaning": "Luggage"
            }
        ]
    },
    "妙": {
        "level": 28,
        "meaning": "Strange",
        "similar": []
    },
    "移": {
        "level": 28,
        "meaning": "Shift",
        "similar": [
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            }
        ]
    },
    "程": {
        "level": 28,
        "meaning": "Extent",
        "similar": []
    },
    "稚": {
        "level": 28,
        "meaning": "Immature",
        "similar": [
            {
                "kanji": "雑",
                "level": 32,
                "meaning": "Random"
            },
            {
                "kanji": "権",
                "level": 21,
                "meaning": "Rights"
            },
            {
                "kanji": "穫",
                "level": 48,
                "meaning": "Harvest"
            },
            {
                "kanji": "維",
                "level": 36,
                "meaning": "Maintain"
            },
            {
                "kanji": "雄",
                "level": 29,
                "meaning": "Male"
            },
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "唯",
                "level": 49,
                "meaning": "Solely"
            },
            {
                "kanji": "雅",
                "level": 40,
                "meaning": "Elegant"
            }
        ]
    },
    "婦": {
        "level": 28,
        "meaning": "Wife",
        "similar": []
    },
    "精": {
        "level": 28,
        "meaning": "Spirit",
        "similar": [
            {
                "kanji": "請",
                "level": 29,
                "meaning": "Request"
            },
            {
                "kanji": "情",
                "level": 13,
                "meaning": "Feeling"
            }
        ]
    },
    "浜": {
        "level": 28,
        "meaning": "Beach",
        "similar": [
            {
                "kanji": "洗",
                "level": 18,
                "meaning": "Wash"
            },
            {
                "kanji": "洪",
                "level": 56,
                "meaning": "Flood"
            }
        ]
    },
    "絶": {
        "level": 28,
        "meaning": "Extinction",
        "similar": []
    },
    "綺": {
        "level": 28,
        "meaning": "Beautiful",
        "similar": []
    },
    "巨": {
        "level": 28,
        "meaning": "Giant",
        "similar": [
            {
                "kanji": "臣",
                "level": 29,
                "meaning": "Servant"
            }
        ]
    },
    "清": {
        "level": 28,
        "meaning": "Pure",
        "similar": [
            {
                "kanji": "情",
                "level": 13,
                "meaning": "Feeling"
            },
            {
                "kanji": "惰",
                "level": 52,
                "meaning": "Lazy"
            },
            {
                "kanji": "青",
                "level": 5,
                "meaning": "Blue"
            },
            {
                "kanji": "消",
                "level": 12,
                "meaning": "Extinguish"
            },
            {
                "kanji": "溝",
                "level": 45,
                "meaning": "Gutter"
            }
        ]
    },
    "並": {
        "level": 28,
        "meaning": "Line Up",
        "similar": []
    },
    "幼": {
        "level": 28,
        "meaning": "Infancy",
        "similar": [
            {
                "kanji": "幻",
                "level": 17,
                "meaning": "Illusion"
            }
        ]
    },
    "麗": {
        "level": 28,
        "meaning": "Lovely",
        "similar": []
    },
    "庫": {
        "level": 28,
        "meaning": "Storage",
        "similar": [
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            },
            {
                "kanji": "彰",
                "level": 50,
                "meaning": "Clear"
            },
            {
                "kanji": "障",
                "level": 26,
                "meaning": "Hinder"
            },
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            },
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            }
        ]
    },
    "潔": {
        "level": 28,
        "meaning": "Pure",
        "similar": []
    },
    "微": {
        "level": 28,
        "meaning": "Delicate",
        "similar": [
            {
                "kanji": "徴",
                "level": 26,
                "meaning": "Indication"
            }
        ]
    },
    "修": {
        "level": 28,
        "meaning": "Discipline",
        "similar": []
    },
    "怖": {
        "level": 29,
        "meaning": "Scary",
        "similar": []
    },
    "恐": {
        "level": 29,
        "meaning": "Fear",
        "similar": []
    },
    "催": {
        "level": 29,
        "meaning": "Sponsor",
        "similar": [
            {
                "kanji": "唯",
                "level": 49,
                "meaning": "Solely"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "烈": {
        "level": 29,
        "meaning": "Violent",
        "similar": []
    },
    "僚": {
        "level": 29,
        "meaning": "Colleague",
        "similar": [
            {
                "kanji": "寮",
                "level": 46,
                "meaning": "Dormitory"
            },
            {
                "kanji": "療",
                "level": 36,
                "meaning": "Heal"
            },
            {
                "kanji": "貸",
                "level": 27,
                "meaning": "Lend"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "原",
                "level": 17,
                "meaning": "Original"
            }
        ]
    },
    "臣": {
        "level": 29,
        "meaning": "Servant",
        "similar": [
            {
                "kanji": "巨",
                "level": 28,
                "meaning": "Giant"
            },
            {
                "kanji": "姫",
                "level": 44,
                "meaning": "Princess"
            }
        ]
    },
    "航": {
        "level": 29,
        "meaning": "Navigation",
        "similar": []
    },
    "猛": {
        "level": 29,
        "meaning": "Fierce",
        "similar": []
    },
    "略": {
        "level": 29,
        "meaning": "Abbreviation",
        "similar": [
            {
                "kanji": "酪",
                "level": 59,
                "meaning": "Dairy"
            },
            {
                "kanji": "閣",
                "level": 29,
                "meaning": "The"
            }
        ]
    },
    "閣": {
        "level": 29,
        "meaning": "The Cabinet",
        "similar": [
            {
                "kanji": "問",
                "level": 13,
                "meaning": "Problem"
            },
            {
                "kanji": "略",
                "level": 29,
                "meaning": "Abbreviation"
            }
        ]
    },
    "雄": {
        "level": 29,
        "meaning": "Male",
        "similar": [
            {
                "kanji": "雇",
                "level": 39,
                "meaning": "Employ"
            },
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "確",
                "level": 20,
                "meaning": "Certain"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            },
            {
                "kanji": "雅",
                "level": 40,
                "meaning": "Elegant"
            }
        ]
    },
    "監": {
        "level": 29,
        "meaning": "Oversee",
        "similar": [
            {
                "kanji": "艦",
                "level": 41,
                "meaning": "Warship"
            }
        ]
    },
    "督": {
        "level": 29,
        "meaning": "Coach",
        "similar": []
    },
    "杯": {
        "level": 29,
        "meaning": "Cup Of Liquid",
        "similar": [
            {
                "kanji": "村",
                "level": 4,
                "meaning": "Village"
            },
            {
                "kanji": "枢",
                "level": 42,
                "meaning": "Hinge"
            },
            {
                "kanji": "朴",
                "level": 55,
                "meaning": "Simple"
            },
            {
                "kanji": "板",
                "level": 29,
                "meaning": "Board"
            },
            {
                "kanji": "械",
                "level": 20,
                "meaning": "Contraption"
            }
        ]
    },
    "板": {
        "level": 29,
        "meaning": "Board",
        "similar": [
            {
                "kanji": "枝",
                "level": 34,
                "meaning": "Branch"
            },
            {
                "kanji": "枢",
                "level": 42,
                "meaning": "Hinge"
            },
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            },
            {
                "kanji": "杯",
                "level": 29,
                "meaning": "Cup"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "校",
                "level": 7,
                "meaning": "School"
            }
        ]
    },
    "韓": {
        "level": 29,
        "meaning": "Korea",
        "similar": []
    },
    "街": {
        "level": 29,
        "meaning": "Street",
        "similar": []
    },
    "壊": {
        "level": 29,
        "meaning": "Break",
        "similar": [
            {
                "kanji": "懐",
                "level": 30,
                "meaning": "Nostalgia"
            }
        ]
    },
    "娘": {
        "level": 29,
        "meaning": "Daughter",
        "similar": [
            {
                "kanji": "食",
                "level": 6,
                "meaning": "Eat"
            },
            {
                "kanji": "良",
                "level": 11,
                "meaning": "Good"
            },
            {
                "kanji": "浪",
                "level": 59,
                "meaning": "Wander"
            }
        ]
    },
    "診": {
        "level": 29,
        "meaning": "Diagnose",
        "similar": [
            {
                "kanji": "訟",
                "level": 25,
                "meaning": "Lawsuit"
            },
            {
                "kanji": "談",
                "level": 9,
                "meaning": "Discuss"
            },
            {
                "kanji": "誘",
                "level": 27,
                "meaning": "Invite"
            },
            {
                "kanji": "該",
                "level": 55,
                "meaning": "The"
            },
            {
                "kanji": "誇",
                "level": 46,
                "meaning": "Pride"
            },
            {
                "kanji": "誠",
                "level": 41,
                "meaning": "Sincerity"
            }
        ]
    },
    "積": {
        "level": 29,
        "meaning": "Accumulate",
        "similar": [
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "類",
                "level": 18,
                "meaning": "Type"
            },
            {
                "kanji": "績",
                "level": 32,
                "meaning": "Exploits"
            },
            {
                "kanji": "横",
                "level": 10,
                "meaning": "Side"
            }
        ]
    },
    "詰": {
        "level": 29,
        "meaning": "Stuffed",
        "similar": [
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            },
            {
                "kanji": "調",
                "level": 10,
                "meaning": "Investigate"
            },
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            }
        ]
    },
    "請": {
        "level": 29,
        "meaning": "Request",
        "similar": [
            {
                "kanji": "諸",
                "level": 33,
                "meaning": "Various"
            },
            {
                "kanji": "講",
                "level": 35,
                "meaning": "Lecture"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "精",
                "level": 28,
                "meaning": "Spirit"
            }
        ]
    },
    "欧": {
        "level": 29,
        "meaning": "Europe",
        "similar": [
            {
                "kanji": "殴",
                "level": 48,
                "meaning": "Assault"
            }
        ]
    },
    "宗": {
        "level": 29,
        "meaning": "Religion",
        "similar": [
            {
                "kanji": "完",
                "level": 14,
                "meaning": "Perfect"
            },
            {
                "kanji": "実",
                "level": 9,
                "meaning": "Truth"
            },
            {
                "kanji": "崇",
                "level": 59,
                "meaning": "Worship"
            },
            {
                "kanji": "案",
                "level": 22,
                "meaning": "Plan"
            }
        ]
    },
    "宴": {
        "level": 29,
        "meaning": "Banquet",
        "similar": [
            {
                "kanji": "宣",
                "level": 33,
                "meaning": "Proclaim"
            }
        ]
    },
    "寄": {
        "level": 29,
        "meaning": "Approach",
        "similar": [
            {
                "kanji": "崎",
                "level": 23,
                "meaning": "Cape"
            },
            {
                "kanji": "割",
                "level": 23,
                "meaning": "Divide"
            },
            {
                "kanji": "奇",
                "level": 28,
                "meaning": "Odd"
            },
            {
                "kanji": "害",
                "level": 20,
                "meaning": "Damage"
            }
        ]
    },
    "江": {
        "level": 29,
        "meaning": "Inlet",
        "similar": [
            {
                "kanji": "壮",
                "level": 50,
                "meaning": "Robust"
            },
            {
                "kanji": "法",
                "level": 15,
                "meaning": "Method"
            },
            {
                "kanji": "注",
                "level": 11,
                "meaning": "Pour"
            }
        ]
    },
    "索": {
        "level": 29,
        "meaning": "Search",
        "similar": [
            {
                "kanji": "素",
                "level": 21,
                "meaning": "Element"
            }
        ]
    },
    "緊": {
        "level": 29,
        "meaning": "Tense",
        "similar": []
    },
    "添": {
        "level": 29,
        "meaning": "Append",
        "similar": []
    },
    "乾": {
        "level": 29,
        "meaning": "Dry",
        "similar": [
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "幹",
                "level": 23,
                "meaning": "Tree"
            },
            {
                "kanji": "朝",
                "level": 8,
                "meaning": "Morning"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "軒",
                "level": 51,
                "meaning": "House"
            }
        ]
    },
    "促": {
        "level": 29,
        "meaning": "Urge",
        "similar": [
            {
                "kanji": "足",
                "level": 4,
                "meaning": "Foot"
            },
            {
                "kanji": "保",
                "level": 9,
                "meaning": "Preserve"
            }
        ]
    },
    "遊": {
        "level": 30,
        "meaning": "Play",
        "similar": []
    },
    "適": {
        "level": 30,
        "meaning": "Suitable",
        "similar": [
            {
                "kanji": "敵",
                "level": 21,
                "meaning": "Enemy"
            }
        ]
    },
    "背": {
        "level": 30,
        "meaning": "Back",
        "similar": []
    },
    "照": {
        "level": 30,
        "meaning": "Illuminate",
        "similar": [
            {
                "kanji": "昭",
                "level": 37,
                "meaning": "Shining"
            }
        ]
    },
    "懐": {
        "level": 30,
        "meaning": "Nostalgia",
        "similar": [
            {
                "kanji": "壊",
                "level": 29,
                "meaning": "Break"
            }
        ]
    },
    "版": {
        "level": 30,
        "meaning": "Edition",
        "similar": []
    },
    "押": {
        "level": 30,
        "meaning": "Push",
        "similar": [
            {
                "kanji": "担",
                "level": 24,
                "meaning": "Carry"
            },
            {
                "kanji": "挿",
                "level": 47,
                "meaning": "Insert"
            },
            {
                "kanji": "抽",
                "level": 49,
                "meaning": "Pluck"
            },
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "捜",
                "level": 25,
                "meaning": "Search"
            },
            {
                "kanji": "捕",
                "level": 25,
                "meaning": "Catch"
            }
        ]
    },
    "撮": {
        "level": 30,
        "meaning": "Photograph",
        "similar": [
            {
                "kanji": "最",
                "level": 10,
                "meaning": "Most"
            }
        ]
    },
    "旗": {
        "level": 30,
        "meaning": "Flag",
        "similar": [
            {
                "kanji": "棋",
                "level": 39,
                "meaning": "Chess"
            }
        ]
    },
    "盗": {
        "level": 30,
        "meaning": "Steal",
        "similar": [
            {
                "kanji": "益",
                "level": 28,
                "meaning": "Benefit"
            }
        ]
    },
    "更": {
        "level": 30,
        "meaning": "Again",
        "similar": [
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "便",
                "level": 11,
                "meaning": "Convenience"
            },
            {
                "kanji": "児",
                "level": 28,
                "meaning": "Child"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "凍",
                "level": 28,
                "meaning": "Frozen"
            },
            {
                "kanji": "夏",
                "level": 7,
                "meaning": "Summer"
            }
        ]
    },
    "枕": {
        "level": 30,
        "meaning": "Pillow",
        "similar": []
    },
    "預": {
        "level": 30,
        "meaning": "Deposit",
        "similar": [
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "領",
                "level": 22,
                "meaning": "Territory"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            }
        ]
    },
    "飾": {
        "level": 30,
        "meaning": "Decorate",
        "similar": [
            {
                "kanji": "飼",
                "level": 32,
                "meaning": "Domesticate"
            },
            {
                "kanji": "飢",
                "level": 48,
                "meaning": "Starve"
            },
            {
                "kanji": "飽",
                "level": 56,
                "meaning": "Bored"
            },
            {
                "kanji": "飯",
                "level": 15,
                "meaning": "Meal"
            },
            {
                "kanji": "飲",
                "level": 10,
                "meaning": "Drink"
            }
        ]
    },
    "覧": {
        "level": 30,
        "meaning": "Look At",
        "similar": [
            {
                "kanji": "賢",
                "level": 48,
                "meaning": "Clever"
            }
        ]
    },
    "騒": {
        "level": 30,
        "meaning": "Boisterous",
        "similar": [
            {
                "kanji": "験",
                "level": 9,
                "meaning": "Test"
            }
        ]
    },
    "婚": {
        "level": 30,
        "meaning": "Marriage",
        "similar": []
    },
    "符": {
        "level": 30,
        "meaning": "Token",
        "similar": [
            {
                "kanji": "等",
                "level": 18,
                "meaning": "Equal"
            },
            {
                "kanji": "笑",
                "level": 16,
                "meaning": "Laugh"
            }
        ]
    },
    "魅": {
        "level": 30,
        "meaning": "Alluring",
        "similar": []
    },
    "貧": {
        "level": 30,
        "meaning": "Poor",
        "similar": [
            {
                "kanji": "貿",
                "level": 36,
                "meaning": "Trade"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "負",
                "level": 9,
                "meaning": "Lose"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            }
        ]
    },
    "系": {
        "level": 30,
        "meaning": "Lineage",
        "similar": [
            {
                "kanji": "糸",
                "level": 4,
                "meaning": "Thread"
            },
            {
                "kanji": "係",
                "level": 16,
                "meaning": "Connection"
            },
            {
                "kanji": "孫",
                "level": 31,
                "meaning": "Grandchild"
            }
        ]
    },
    "購": {
        "level": 30,
        "meaning": "Subscription",
        "similar": [
            {
                "kanji": "睡",
                "level": 27,
                "meaning": "Drowsy"
            }
        ]
    },
    "浮": {
        "level": 30,
        "meaning": "Float",
        "similar": [
            {
                "kanji": "学",
                "level": 5,
                "meaning": "Study"
            }
        ]
    },
    "越": {
        "level": 30,
        "meaning": "Go Beyond",
        "similar": []
    },
    "渇": {
        "level": 30,
        "meaning": "Thirst",
        "similar": [
            {
                "kanji": "湯",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "混",
                "level": 19,
                "meaning": "Mix"
            },
            {
                "kanji": "掲",
                "level": 37,
                "meaning": "Display"
            },
            {
                "kanji": "喝",
                "level": 57,
                "meaning": "Scold"
            }
        ]
    },
    "乏": {
        "level": 30,
        "meaning": "Scarce",
        "similar": []
    },
    "延": {
        "level": 30,
        "meaning": "Prolong",
        "similar": [
            {
                "kanji": "廷",
                "level": 50,
                "meaning": "Courts"
            }
        ]
    },
    "漏": {
        "level": 30,
        "meaning": "Leak",
        "similar": []
    },
    "翌": {
        "level": 30,
        "meaning": "The Following",
        "similar": [
            {
                "kanji": "泣",
                "level": 15,
                "meaning": "Cry"
            }
        ]
    },
    "快": {
        "level": 30,
        "meaning": "Pleasant",
        "similar": [
            {
                "kanji": "決",
                "level": 8,
                "meaning": "Decide"
            },
            {
                "kanji": "沢",
                "level": 23,
                "meaning": "Swamp"
            }
        ]
    },
    "倉": {
        "level": 31,
        "meaning": "Warehouse",
        "similar": []
    },
    "偵": {
        "level": 31,
        "meaning": "Spy",
        "similar": [
            {
                "kanji": "賀",
                "level": 22,
                "meaning": "Congratulations"
            },
            {
                "kanji": "貞",
                "level": 51,
                "meaning": "Chastity"
            },
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "貸",
                "level": 27,
                "meaning": "Lend"
            }
        ]
    },
    "脈": {
        "level": 31,
        "meaning": "Vein",
        "similar": [
            {
                "kanji": "豚",
                "level": 26,
                "meaning": "Pork"
            }
        ]
    },
    "掃": {
        "level": 31,
        "meaning": "Sweep",
        "similar": [
            {
                "kanji": "帰",
                "level": 15,
                "meaning": "Return"
            }
        ]
    },
    "探": {
        "level": 31,
        "meaning": "Look For",
        "similar": [
            {
                "kanji": "深",
                "level": 12,
                "meaning": "Deep"
            },
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            }
        ]
    },
    "菜": {
        "level": 31,
        "meaning": "Vegetable",
        "similar": [
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            },
            {
                "kanji": "菊",
                "level": 46,
                "meaning": "Chrysanthemum"
            }
        ]
    },
    "華": {
        "level": 31,
        "meaning": "Showy",
        "similar": []
    },
    "鑑": {
        "level": 31,
        "meaning": "Model",
        "similar": [
            {
                "kanji": "艦",
                "level": 41,
                "meaning": "Warship"
            }
        ]
    },
    "救": {
        "level": 31,
        "meaning": "Rescue",
        "similar": [
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            },
            {
                "kanji": "挟",
                "level": 51,
                "meaning": "Between"
            }
        ]
    },
    "散": {
        "level": 31,
        "meaning": "Scatter",
        "similar": [
            {
                "kanji": "撤",
                "level": 41,
                "meaning": "Withdrawal"
            }
        ]
    },
    "既": {
        "level": 31,
        "meaning": "Previously",
        "similar": [
            {
                "kanji": "慨",
                "level": 58,
                "meaning": "Sigh"
            },
            {
                "kanji": "概",
                "level": 49,
                "meaning": "Approximation"
            }
        ]
    },
    "嘆": {
        "level": 31,
        "meaning": "Sigh",
        "similar": [
            {
                "kanji": "漢",
                "level": 10,
                "meaning": "Chinese"
            }
        ]
    },
    "除": {
        "level": 31,
        "meaning": "Exclude",
        "similar": [
            {
                "kanji": "徐",
                "level": 53,
                "meaning": "Gently"
            },
            {
                "kanji": "陰",
                "level": 45,
                "meaning": "Shade"
            },
            {
                "kanji": "余",
                "level": 20,
                "meaning": "Surplus"
            }
        ]
    },
    "普": {
        "level": 31,
        "meaning": "Normal",
        "similar": [
            {
                "kanji": "滝",
                "level": 45,
                "meaning": "Waterfall"
            }
        ]
    },
    "陸": {
        "level": 31,
        "meaning": "Land",
        "similar": [
            {
                "kanji": "陵",
                "level": 56,
                "meaning": "Mausoleum"
            },
            {
                "kanji": "陛",
                "level": 49,
                "meaning": "Highness"
            }
        ]
    },
    "離": {
        "level": 31,
        "meaning": "Detach",
        "similar": []
    },
    "均": {
        "level": 31,
        "meaning": "Equal",
        "similar": []
    },
    "融": {
        "level": 31,
        "meaning": "Dissolve",
        "similar": []
    },
    "墓": {
        "level": 31,
        "meaning": "Grave",
        "similar": [
            {
                "kanji": "基",
                "level": 14,
                "meaning": "Foundation"
            },
            {
                "kanji": "幕",
                "level": 34,
                "meaning": "Curtain"
            },
            {
                "kanji": "募",
                "level": 37,
                "meaning": "Recruit"
            },
            {
                "kanji": "暮",
                "level": 33,
                "meaning": "Livelihood"
            },
            {
                "kanji": "慕",
                "level": 60,
                "meaning": "Yearn"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "軽",
                "level": 10,
                "meaning": "Lightweight"
            },
            {
                "kanji": "幹",
                "level": 23,
                "meaning": "Tree"
            }
        ]
    },
    "棒": {
        "level": 31,
        "meaning": "Pole",
        "similar": [
            {
                "kanji": "俸",
                "level": 57,
                "meaning": "Salary"
            },
            {
                "kanji": "禁",
                "level": 18,
                "meaning": "Prohibit"
            }
        ]
    },
    "驚": {
        "level": 31,
        "meaning": "Surprised",
        "similar": []
    },
    "孫": {
        "level": 31,
        "meaning": "Grandchild",
        "similar": [
            {
                "kanji": "系",
                "level": 30,
                "meaning": "Lineage"
            },
            {
                "kanji": "係",
                "level": 16,
                "meaning": "Connection"
            }
        ]
    },
    "富": {
        "level": 31,
        "meaning": "Rich",
        "similar": [
            {
                "kanji": "幅",
                "level": 36,
                "meaning": "Width"
            },
            {
                "kanji": "福",
                "level": 13,
                "meaning": "Luck"
            }
        ]
    },
    "尋": {
        "level": 31,
        "meaning": "Inquire",
        "similar": []
    },
    "豪": {
        "level": 31,
        "meaning": "Luxurious",
        "similar": [
            {
                "kanji": "稼",
                "level": 45,
                "meaning": "Earnings"
            },
            {
                "kanji": "塚",
                "level": 51,
                "meaning": "Mound"
            },
            {
                "kanji": "家",
                "level": 7,
                "meaning": "House"
            }
        ]
    },
    "粉": {
        "level": 31,
        "meaning": "Powder",
        "similar": [
            {
                "kanji": "粋",
                "level": 34,
                "meaning": "Stylish"
            },
            {
                "kanji": "券",
                "level": 28,
                "meaning": "Ticket"
            }
        ]
    },
    "貨": {
        "level": 31,
        "meaning": "Freight",
        "similar": [
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "賀",
                "level": 22,
                "meaning": "Congratulations"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "貸",
                "level": 27,
                "meaning": "Lend"
            },
            {
                "kanji": "貧",
                "level": 30,
                "meaning": "Poor"
            },
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            }
        ]
    },
    "泥": {
        "level": 31,
        "meaning": "Mud",
        "similar": [
            {
                "kanji": "沢",
                "level": 23,
                "meaning": "Swamp"
            },
            {
                "kanji": "涙",
                "level": 44,
                "meaning": "Teardrop"
            }
        ]
    },
    "巣": {
        "level": 31,
        "meaning": "Nest",
        "similar": [
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "戦",
                "level": 11,
                "meaning": "War"
            },
            {
                "kanji": "裸",
                "level": 45,
                "meaning": "Naked"
            },
            {
                "kanji": "凍",
                "level": 28,
                "meaning": "Frozen"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            }
        ]
    },
    "編": {
        "level": 31,
        "meaning": "Knit",
        "similar": []
    },
    "帯": {
        "level": 31,
        "meaning": "Belt",
        "similar": [
            {
                "kanji": "滞",
                "level": 35,
                "meaning": "Stagnate"
            }
        ]
    },
    "幾": {
        "level": 31,
        "meaning": "How Many",
        "similar": [
            {
                "kanji": "機",
                "level": 20,
                "meaning": "Machine"
            }
        ]
    },
    "廊": {
        "level": 31,
        "meaning": "Corridor",
        "similar": [
            {
                "kanji": "郎",
                "level": 27,
                "meaning": "Guy"
            }
        ]
    },
    "似": {
        "level": 31,
        "meaning": "Resemble",
        "similar": [
            {
                "kanji": "以",
                "level": 7,
                "meaning": "From"
            },
            {
                "kanji": "位",
                "level": 11,
                "meaning": "Rank"
            }
        ]
    },
    "径": {
        "level": 31,
        "meaning": "Diameter",
        "similar": [
            {
                "kanji": "怪",
                "level": 26,
                "meaning": "Suspicious"
            }
        ]
    },
    "徳": {
        "level": 31,
        "meaning": "Virtue",
        "similar": [
            {
                "kanji": "聴",
                "level": 37,
                "meaning": "Listen"
            }
        ]
    },
    "恩": {
        "level": 32,
        "meaning": "Kindness",
        "similar": [
            {
                "kanji": "思",
                "level": 6,
                "meaning": "Think"
            }
        ]
    },
    "傷": {
        "level": 32,
        "meaning": "Wound",
        "similar": [
            {
                "kanji": "働",
                "level": 11,
                "meaning": "Work"
            },
            {
                "kanji": "腸",
                "level": 57,
                "meaning": "Intestines"
            },
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            },
            {
                "kanji": "湯",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "陽",
                "level": 12,
                "meaning": "Sunshine"
            }
        ]
    },
    "党": {
        "level": 32,
        "meaning": "Group",
        "similar": [
            {
                "kanji": "掌",
                "level": 47,
                "meaning": "Manipulate"
            },
            {
                "kanji": "堂",
                "level": 17,
                "meaning": "Hall"
            },
            {
                "kanji": "常",
                "level": 17,
                "meaning": "Ordinary"
            },
            {
                "kanji": "悦",
                "level": 56,
                "meaning": "Delight"
            },
            {
                "kanji": "況",
                "level": 25,
                "meaning": "Condition"
            }
        ]
    },
    "酸": {
        "level": 32,
        "meaning": "Acid",
        "similar": []
    },
    "興": {
        "level": 32,
        "meaning": "Interest",
        "similar": []
    },
    "銭": {
        "level": 32,
        "meaning": "Coin",
        "similar": [
            {
                "kanji": "鋳",
                "level": 59,
                "meaning": "Cast"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "銃",
                "level": 39,
                "meaning": "Gun"
            },
            {
                "kanji": "鉱",
                "level": 41,
                "meaning": "Mineral"
            }
        ]
    },
    "捨": {
        "level": 32,
        "meaning": "Throw Away",
        "similar": [
            {
                "kanji": "拾",
                "level": 11,
                "meaning": "Pick"
            },
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            },
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            }
        ]
    },
    "卵": {
        "level": 32,
        "meaning": "Egg",
        "similar": []
    },
    "採": {
        "level": 32,
        "meaning": "Gather",
        "similar": [
            {
                "kanji": "援",
                "level": 22,
                "meaning": "Aid"
            },
            {
                "kanji": "菜",
                "level": 31,
                "meaning": "Vegetable"
            },
            {
                "kanji": "救",
                "level": 31,
                "meaning": "Rescue"
            },
            {
                "kanji": "探",
                "level": 31,
                "meaning": "Look"
            },
            {
                "kanji": "授",
                "level": 26,
                "meaning": "Instruct"
            },
            {
                "kanji": "挟",
                "level": 51,
                "meaning": "Between"
            },
            {
                "kanji": "渓",
                "level": 60,
                "meaning": "Valley"
            }
        ]
    },
    "厳": {
        "level": 32,
        "meaning": "Strict",
        "similar": [
            {
                "kanji": "敢",
                "level": 57,
                "meaning": "Daring"
            }
        ]
    },
    "暖": {
        "level": 32,
        "meaning": "Warm",
        "similar": [
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            },
            {
                "kanji": "販",
                "level": 24,
                "meaning": "Sell"
            },
            {
                "kanji": "援",
                "level": 22,
                "meaning": "Aid"
            }
        ]
    },
    "雑": {
        "level": 32,
        "meaning": "Random",
        "similar": [
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            },
            {
                "kanji": "雅",
                "level": 40,
                "meaning": "Elegant"
            },
            {
                "kanji": "維",
                "level": 36,
                "meaning": "Maintain"
            }
        ]
    },
    "机": {
        "level": 32,
        "meaning": "Desk",
        "similar": [
            {
                "kanji": "杉",
                "level": 35,
                "meaning": "Cedar"
            }
        ]
    },
    "眼": {
        "level": 32,
        "meaning": "Eyeball",
        "similar": []
    },
    "染": {
        "level": 32,
        "meaning": "Dye",
        "similar": [
            {
                "kanji": "派",
                "level": 21,
                "meaning": "Sect"
            },
            {
                "kanji": "深",
                "level": 12,
                "meaning": "Deep"
            }
        ]
    },
    "衛": {
        "level": 32,
        "meaning": "Defense",
        "similar": [
            {
                "kanji": "偉",
                "level": 51,
                "meaning": "Greatness"
            }
        ]
    },
    "桜": {
        "level": 32,
        "meaning": "Sakura",
        "similar": [
            {
                "kanji": "妥",
                "level": 14,
                "meaning": "Gentle"
            }
        ]
    },
    "飼": {
        "level": 32,
        "meaning": "Domesticate",
        "similar": [
            {
                "kanji": "飾",
                "level": 30,
                "meaning": "Decorate"
            },
            {
                "kanji": "飯",
                "level": 15,
                "meaning": "Meal"
            }
        ]
    },
    "複": {
        "level": 32,
        "meaning": "Duplicate",
        "similar": [
            {
                "kanji": "復",
                "level": 26,
                "meaning": "Restore"
            }
        ]
    },
    "祖": {
        "level": 32,
        "meaning": "Ancestor",
        "similar": []
    },
    "秘": {
        "level": 32,
        "meaning": "Secret",
        "similar": [
            {
                "kanji": "秒",
                "level": 11,
                "meaning": "Second"
            },
            {
                "kanji": "秋",
                "level": 15,
                "meaning": "Autumn"
            }
        ]
    },
    "訳": {
        "level": 32,
        "meaning": "Translation",
        "similar": [
            {
                "kanji": "詠",
                "level": 59,
                "meaning": "Compose"
            },
            {
                "kanji": "記",
                "level": 7,
                "meaning": "Write"
            },
            {
                "kanji": "設",
                "level": 21,
                "meaning": "Establish"
            }
        ]
    },
    "欲": {
        "level": 32,
        "meaning": "Want",
        "similar": []
    },
    "密": {
        "level": 32,
        "meaning": "Secrecy",
        "similar": []
    },
    "永": {
        "level": 32,
        "meaning": "Eternity",
        "similar": []
    },
    "汚": {
        "level": 32,
        "meaning": "Dirty",
        "similar": [
            {
                "kanji": "汗",
                "level": 26,
                "meaning": "Sweat"
            },
            {
                "kanji": "汽",
                "level": 18,
                "meaning": "Steam"
            }
        ]
    },
    "賛": {
        "level": 32,
        "meaning": "Agree",
        "similar": [
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            },
            {
                "kanji": "替",
                "level": 25,
                "meaning": "Replace"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            }
        ]
    },
    "液": {
        "level": 32,
        "meaning": "Fluid",
        "similar": [
            {
                "kanji": "夜",
                "level": 6,
                "meaning": "Night"
            }
        ]
    },
    "績": {
        "level": 32,
        "meaning": "Exploits",
        "similar": [
            {
                "kanji": "織",
                "level": 27,
                "meaning": "Weave"
            },
            {
                "kanji": "緒",
                "level": 38,
                "meaning": "Together"
            },
            {
                "kanji": "積",
                "level": 29,
                "meaning": "Accumulate"
            },
            {
                "kanji": "横",
                "level": 10,
                "meaning": "Side"
            },
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "練",
                "level": 13,
                "meaning": "Practice"
            }
        ]
    },
    "久": {
        "level": 32,
        "meaning": "Long Time",
        "similar": [
            {
                "kanji": "反",
                "level": 8,
                "meaning": "Anti"
            },
            {
                "kanji": "友",
                "level": 3,
                "meaning": "Friend"
            }
        ]
    },
    "序": {
        "level": 32,
        "meaning": "Preface",
        "similar": [
            {
                "kanji": "列",
                "level": 15,
                "meaning": "Row"
            }
        ]
    },
    "込": {
        "level": 32,
        "meaning": "Crowded",
        "similar": [
            {
                "kanji": "返",
                "level": 9,
                "meaning": "Return"
            }
        ]
    },
    "迎": {
        "level": 32,
        "meaning": "Welcome",
        "similar": [
            {
                "kanji": "近",
                "level": 5,
                "meaning": "Near"
            }
        ]
    },
    "志": {
        "level": 32,
        "meaning": "Intention",
        "similar": [
            {
                "kanji": "応",
                "level": 22,
                "meaning": "Respond"
            },
            {
                "kanji": "忘",
                "level": 18,
                "meaning": "Forget"
            }
        ]
    },
    "灰": {
        "level": 33,
        "meaning": "Ashes",
        "similar": []
    },
    "肺": {
        "level": 33,
        "meaning": "Lung",
        "similar": [
            {
                "kanji": "肪",
                "level": 51,
                "meaning": "Obese"
            }
        ]
    },
    "熟": {
        "level": 33,
        "meaning": "Ripen",
        "similar": [
            {
                "kanji": "塾",
                "level": 45,
                "meaning": "Cram"
            }
        ]
    },
    "拡": {
        "level": 33,
        "meaning": "Extend",
        "similar": [
            {
                "kanji": "抗",
                "level": 37,
                "meaning": "Confront"
            }
        ]
    },
    "否": {
        "level": 33,
        "meaning": "No",
        "similar": [
            {
                "kanji": "名",
                "level": 4,
                "meaning": "Name"
            },
            {
                "kanji": "向",
                "level": 6,
                "meaning": "Yonder"
            },
            {
                "kanji": "石",
                "level": 4,
                "meaning": "Stone"
            }
        ]
    },
    "著": {
        "level": 33,
        "meaning": "Author",
        "similar": [
            {
                "kanji": "署",
                "level": 17,
                "meaning": "Government"
            },
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "者",
                "level": 8,
                "meaning": "Someone"
            }
        ]
    },
    "蒸": {
        "level": 33,
        "meaning": "Steam",
        "similar": []
    },
    "操": {
        "level": 33,
        "meaning": "Manipulate",
        "similar": [
            {
                "kanji": "藻",
                "level": 60,
                "meaning": "Seaweed"
            },
            {
                "kanji": "燥",
                "level": 51,
                "meaning": "Dry"
            }
        ]
    },
    "蔵": {
        "level": 33,
        "meaning": "Storehouse",
        "similar": [
            {
                "kanji": "臓",
                "level": 34,
                "meaning": "Internal"
            }
        ]
    },
    "敬": {
        "level": 33,
        "meaning": "Respect",
        "similar": [
            {
                "kanji": "故",
                "level": 26,
                "meaning": "Circumstance"
            }
        ]
    },
    "異": {
        "level": 33,
        "meaning": "Differ",
        "similar": [
            {
                "kanji": "時",
                "level": 7,
                "meaning": "Time"
            }
        ]
    },
    "閉": {
        "level": 33,
        "meaning": "Closed",
        "similar": [
            {
                "kanji": "閑",
                "level": 59,
                "meaning": "Leisure"
            },
            {
                "kanji": "開",
                "level": 10,
                "meaning": "Open"
            },
            {
                "kanji": "問",
                "level": 13,
                "meaning": "Problem"
            },
            {
                "kanji": "門",
                "level": 16,
                "meaning": "Gates"
            },
            {
                "kanji": "関",
                "level": 16,
                "meaning": "Related"
            },
            {
                "kanji": "閥",
                "level": 19,
                "meaning": "Clique"
            }
        ]
    },
    "皇": {
        "level": 33,
        "meaning": "Emperor",
        "similar": [
            {
                "kanji": "星",
                "level": 6,
                "meaning": "Star"
            },
            {
                "kanji": "重",
                "level": 9,
                "meaning": "Heavy"
            },
            {
                "kanji": "里",
                "level": 5,
                "meaning": "Home"
            },
            {
                "kanji": "時",
                "level": 7,
                "meaning": "Time"
            },
            {
                "kanji": "軒",
                "level": 51,
                "meaning": "House"
            }
        ]
    },
    "暮": {
        "level": 33,
        "meaning": "Livelihood",
        "similar": [
            {
                "kanji": "幕",
                "level": 34,
                "meaning": "Curtain"
            },
            {
                "kanji": "慕",
                "level": 60,
                "meaning": "Yearn"
            },
            {
                "kanji": "募",
                "level": 37,
                "meaning": "Recruit"
            },
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            }
        ]
    },
    "盛": {
        "level": 33,
        "meaning": "Pile",
        "similar": [
            {
                "kanji": "盆",
                "level": 46,
                "meaning": "Lantern"
            }
        ]
    },
    "垂": {
        "level": 33,
        "meaning": "Dangle",
        "similar": [
            {
                "kanji": "佳",
                "level": 55,
                "meaning": "Excellent"
            }
        ]
    },
    "砂": {
        "level": 33,
        "meaning": "Sand",
        "similar": []
    },
    "装": {
        "level": 33,
        "meaning": "Attire",
        "similar": []
    },
    "裏": {
        "level": 33,
        "meaning": "Backside",
        "similar": [
            {
                "kanji": "軟",
                "level": 51,
                "meaning": "Soft"
            },
            {
                "kanji": "衰",
                "level": 49,
                "meaning": "Decline"
            }
        ]
    },
    "誌": {
        "level": 33,
        "meaning": "Magazine",
        "similar": [
            {
                "kanji": "認",
                "level": 21,
                "meaning": "Recognize"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "読",
                "level": 10,
                "meaning": "Read"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "試",
                "level": 9,
                "meaning": "Try"
            }
        ]
    },
    "窓": {
        "level": 33,
        "meaning": "Window",
        "similar": []
    },
    "諸": {
        "level": 33,
        "meaning": "Various",
        "similar": [
            {
                "kanji": "請",
                "level": 29,
                "meaning": "Request"
            },
            {
                "kanji": "譜",
                "level": 58,
                "meaning": "Genealogy"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "講",
                "level": 35,
                "meaning": "Lecture"
            }
        ]
    },
    "筋": {
        "level": 33,
        "meaning": "Muscle",
        "similar": []
    },
    "宣": {
        "level": 33,
        "meaning": "Proclaim",
        "similar": [
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            },
            {
                "kanji": "恒",
                "level": 52,
                "meaning": "Constant"
            },
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "宴",
                "level": 29,
                "meaning": "Banquet"
            }
        ]
    },
    "尊": {
        "level": 33,
        "meaning": "Revered",
        "similar": []
    },
    "簡": {
        "level": 33,
        "meaning": "Simplicity",
        "similar": []
    },
    "賃": {
        "level": 33,
        "meaning": "Rent",
        "similar": [
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "積",
                "level": 29,
                "meaning": "Accumulate"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            }
        ]
    },
    "糖": {
        "level": 33,
        "meaning": "Sugar",
        "similar": []
    },
    "納": {
        "level": 33,
        "meaning": "Supply",
        "similar": [
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            }
        ]
    },
    "漠": {
        "level": 33,
        "meaning": "Desert",
        "similar": [
            {
                "kanji": "漢",
                "level": 10,
                "meaning": "Chinese"
            },
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "膜",
                "level": 57,
                "meaning": "Membrane"
            },
            {
                "kanji": "模",
                "level": 25,
                "meaning": "Imitation"
            },
            {
                "kanji": "凍",
                "level": 28,
                "meaning": "Frozen"
            },
            {
                "kanji": "慎",
                "level": 39,
                "meaning": "Humility"
            },
            {
                "kanji": "寛",
                "level": 53,
                "meaning": "Tolerance"
            },
            {
                "kanji": "源",
                "level": 34,
                "meaning": "Origin"
            }
        ]
    },
    "忠": {
        "level": 33,
        "meaning": "Loyalty",
        "similar": [
            {
                "kanji": "患",
                "level": 37,
                "meaning": "Afflicted"
            }
        ]
    },
    "聖": {
        "level": 34,
        "meaning": "Holy",
        "similar": []
    },
    "腐": {
        "level": 34,
        "meaning": "Rot",
        "similar": []
    },
    "臓": {
        "level": 34,
        "meaning": "Internal Organs",
        "similar": [
            {
                "kanji": "蔵",
                "level": 33,
                "meaning": "Storehouse"
            }
        ]
    },
    "爪": {
        "level": 34,
        "meaning": "Claw",
        "similar": []
    },
    "刻": {
        "level": 34,
        "meaning": "Carve",
        "similar": [
            {
                "kanji": "劾",
                "level": 60,
                "meaning": "Censure"
            }
        ]
    },
    "承": {
        "level": 34,
        "meaning": "Consent",
        "similar": []
    },
    "芋": {
        "level": 34,
        "meaning": "Potato",
        "similar": [
            {
                "kanji": "芽",
                "level": 44,
                "meaning": "Sprout"
            },
            {
                "kanji": "芸",
                "level": 14,
                "meaning": "Acting"
            }
        ]
    },
    "拝": {
        "level": 34,
        "meaning": "Worship",
        "similar": []
    },
    "勤": {
        "level": 34,
        "meaning": "Work",
        "similar": []
    },
    "推": {
        "level": 34,
        "meaning": "Infer",
        "similar": [
            {
                "kanji": "携",
                "level": 40,
                "meaning": "Portable"
            },
            {
                "kanji": "准",
                "level": 53,
                "meaning": "Semi"
            },
            {
                "kanji": "雅",
                "level": 40,
                "meaning": "Elegant"
            },
            {
                "kanji": "雇",
                "level": 39,
                "meaning": "Employ"
            },
            {
                "kanji": "雄",
                "level": 29,
                "meaning": "Male"
            },
            {
                "kanji": "唯",
                "level": 49,
                "meaning": "Solely"
            },
            {
                "kanji": "準",
                "level": 23,
                "meaning": "Standard"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "揮": {
        "level": 34,
        "meaning": "Brandish",
        "similar": [
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            },
            {
                "kanji": "挿",
                "level": 47,
                "meaning": "Insert"
            }
        ]
    },
    "損": {
        "level": 34,
        "meaning": "Loss",
        "similar": [
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            },
            {
                "kanji": "賀",
                "level": 22,
                "meaning": "Congratulations"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            }
        ]
    },
    "吐": {
        "level": 34,
        "meaning": "Throw Up",
        "similar": [
            {
                "kanji": "呈",
                "level": 54,
                "meaning": "Present"
            },
            {
                "kanji": "亜",
                "level": 59,
                "meaning": "Asia"
            }
        ]
    },
    "薦": {
        "level": 34,
        "meaning": "Recommend",
        "similar": []
    },
    "降": {
        "level": 34,
        "meaning": "Descend",
        "similar": [
            {
                "kanji": "隆",
                "level": 39,
                "meaning": "Prosperity"
            },
            {
                "kanji": "峰",
                "level": 50,
                "meaning": "Summit"
            }
        ]
    },
    "隷": {
        "level": 34,
        "meaning": "Slave",
        "similar": []
    },
    "枝": {
        "level": 34,
        "meaning": "Branch",
        "similar": [
            {
                "kanji": "板",
                "level": 29,
                "meaning": "Board"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            }
        ]
    },
    "磁": {
        "level": 34,
        "meaning": "Magnet",
        "similar": []
    },
    "奴": {
        "level": 34,
        "meaning": "Dude",
        "similar": [
            {
                "kanji": "努",
                "level": 11,
                "meaning": "Toil"
            }
        ]
    },
    "誤": {
        "level": 34,
        "meaning": "Mistake",
        "similar": []
    },
    "歓": {
        "level": 34,
        "meaning": "Delight",
        "similar": [
            {
                "kanji": "勧",
                "level": 39,
                "meaning": "Recommend"
            }
        ]
    },
    "射": {
        "level": 34,
        "meaning": "Shoot",
        "similar": [
            {
                "kanji": "身",
                "level": 8,
                "meaning": "Somebody"
            }
        ]
    },
    "豆": {
        "level": 34,
        "meaning": "Beans",
        "similar": [
            {
                "kanji": "束",
                "level": 14,
                "meaning": "Bundle"
            },
            {
                "kanji": "亜",
                "level": 59,
                "meaning": "Asia"
            }
        ]
    },
    "粋": {
        "level": 34,
        "meaning": "Stylish",
        "similar": [
            {
                "kanji": "断",
                "level": 21,
                "meaning": "Cut"
            },
            {
                "kanji": "枠",
                "level": 39,
                "meaning": "Frame"
            },
            {
                "kanji": "料",
                "level": 13,
                "meaning": "Fee"
            },
            {
                "kanji": "粉",
                "level": 31,
                "meaning": "Powder"
            },
            {
                "kanji": "析",
                "level": 42,
                "meaning": "Analysis"
            },
            {
                "kanji": "新",
                "level": 9,
                "meaning": "New"
            }
        ]
    },
    "貴": {
        "level": 34,
        "meaning": "Valuable",
        "similar": [
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            },
            {
                "kanji": "遺",
                "level": 36,
                "meaning": "Leave"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "貫",
                "level": 52,
                "meaning": "Pierce"
            },
            {
                "kanji": "買",
                "level": 8,
                "meaning": "Buy"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "噴",
                "level": 52,
                "meaning": "Erupt"
            },
            {
                "kanji": "慣",
                "level": 25,
                "meaning": "Accustomed"
            }
        ]
    },
    "沿": {
        "level": 34,
        "meaning": "Run Alongside",
        "similar": [
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            },
            {
                "kanji": "活",
                "level": 6,
                "meaning": "Lively"
            },
            {
                "kanji": "沼",
                "level": 43,
                "meaning": "Bog"
            },
            {
                "kanji": "治",
                "level": 16,
                "meaning": "Cure"
            },
            {
                "kanji": "谷",
                "level": 5,
                "meaning": "Valley"
            }
        ]
    },
    "紅": {
        "level": 34,
        "meaning": "Deep Red",
        "similar": [
            {
                "kanji": "経",
                "level": 20,
                "meaning": "Passage"
            },
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "続",
                "level": 19,
                "meaning": "Continue"
            }
        ]
    },
    "純": {
        "level": 34,
        "meaning": "Pure",
        "similar": [
            {
                "kanji": "紛",
                "level": 42,
                "meaning": "Distract"
            },
            {
                "kanji": "級",
                "level": 11,
                "meaning": "Level"
            },
            {
                "kanji": "約",
                "level": 14,
                "meaning": "Promise"
            },
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            },
            {
                "kanji": "紀",
                "level": 15,
                "meaning": "Account"
            }
        ]
    },
    "縦": {
        "level": 34,
        "meaning": "Vertical",
        "similar": []
    },
    "縮": {
        "level": 34,
        "meaning": "Shrink",
        "similar": [
            {
                "kanji": "緒",
                "level": 38,
                "meaning": "Together"
            }
        ]
    },
    "丼": {
        "level": 34,
        "meaning": "Rice Bowl",
        "similar": []
    },
    "幕": {
        "level": 34,
        "meaning": "Curtain",
        "similar": [
            {
                "kanji": "暮",
                "level": 33,
                "meaning": "Livelihood"
            },
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            },
            {
                "kanji": "募",
                "level": 37,
                "meaning": "Recruit"
            },
            {
                "kanji": "慕",
                "level": 60,
                "meaning": "Yearn"
            },
            {
                "kanji": "幹",
                "level": 23,
                "meaning": "Tree"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "草",
                "level": 5,
                "meaning": "Grass"
            }
        ]
    },
    "源": {
        "level": 34,
        "meaning": "Origin",
        "similar": [
            {
                "kanji": "原",
                "level": 17,
                "meaning": "Original"
            },
            {
                "kanji": "寮",
                "level": 46,
                "meaning": "Dormitory"
            },
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "療",
                "level": 36,
                "meaning": "Heal"
            },
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            }
        ]
    },
    "遅": {
        "level": 35,
        "meaning": "Slow",
        "similar": [
            {
                "kanji": "達",
                "level": 18,
                "meaning": "Attain"
            }
        ]
    },
    "恥": {
        "level": 35,
        "meaning": "Shame",
        "similar": []
    },
    "炎": {
        "level": 35,
        "meaning": "Flame",
        "similar": [
            {
                "kanji": "炊",
                "level": 47,
                "meaning": "Cook"
            }
        ]
    },
    "為": {
        "level": 35,
        "meaning": "Sake",
        "similar": [
            {
                "kanji": "偽",
                "level": 41,
                "meaning": "Fake"
            }
        ]
    },
    "酔": {
        "level": 35,
        "meaning": "Drunk",
        "similar": [
            {
                "kanji": "酢",
                "level": 35,
                "meaning": "Vinegar"
            },
            {
                "kanji": "酌",
                "level": 58,
                "meaning": "Serve"
            },
            {
                "kanji": "配",
                "level": 10,
                "meaning": "Distribute"
            },
            {
                "kanji": "酷",
                "level": 54,
                "meaning": "Cruel"
            },
            {
                "kanji": "酬",
                "level": 54,
                "meaning": "Repay"
            },
            {
                "kanji": "酪",
                "level": 59,
                "meaning": "Dairy"
            }
        ]
    },
    "酢": {
        "level": 35,
        "meaning": "Vinegar",
        "similar": [
            {
                "kanji": "酷",
                "level": 54,
                "meaning": "Cruel"
            },
            {
                "kanji": "酪",
                "level": 59,
                "meaning": "Dairy"
            },
            {
                "kanji": "酔",
                "level": 35,
                "meaning": "Drunk"
            },
            {
                "kanji": "昨",
                "level": 15,
                "meaning": "Previous"
            },
            {
                "kanji": "酬",
                "level": 54,
                "meaning": "Repay"
            }
        ]
    },
    "熊": {
        "level": 35,
        "meaning": "Bear",
        "similar": []
    },
    "醤": {
        "level": 35,
        "meaning": "Soy Sauce",
        "similar": []
    },
    "舎": {
        "level": 35,
        "meaning": "Cottage",
        "similar": [
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "合",
                "level": 12,
                "meaning": "Suit"
            },
            {
                "kanji": "吉",
                "level": 44,
                "meaning": "Good"
            },
            {
                "kanji": "舌",
                "level": 19,
                "meaning": "Tongue"
            },
            {
                "kanji": "周",
                "level": 14,
                "meaning": "Circumference"
            },
            {
                "kanji": "含",
                "level": 25,
                "meaning": "Include"
            },
            {
                "kanji": "捨",
                "level": 32,
                "meaning": "Throw"
            }
        ]
    },
    "払": {
        "level": 35,
        "meaning": "Pay",
        "similar": []
    },
    "剣": {
        "level": 35,
        "meaning": "Sword",
        "similar": [
            {
                "kanji": "利",
                "level": 11,
                "meaning": "Profit"
            }
        ]
    },
    "銅": {
        "level": 35,
        "meaning": "Copper",
        "similar": [
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            },
            {
                "kanji": "銘",
                "level": 50,
                "meaning": "Inscription"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            }
        ]
    },
    "獄": {
        "level": 35,
        "meaning": "Prison",
        "similar": []
    },
    "鍋": {
        "level": 35,
        "meaning": "Pot",
        "similar": []
    },
    "厄": {
        "level": 35,
        "meaning": "Unlucky",
        "similar": []
    },
    "噌": {
        "level": 35,
        "meaning": "Boisterous",
        "similar": []
    },
    "杉": {
        "level": 35,
        "meaning": "Cedar",
        "similar": [
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            },
            {
                "kanji": "析",
                "level": 42,
                "meaning": "Analysis"
            },
            {
                "kanji": "机",
                "level": 32,
                "meaning": "Desk"
            },
            {
                "kanji": "材",
                "level": 14,
                "meaning": "Lumber"
            }
        ]
    },
    "破": {
        "level": 35,
        "meaning": "Tear",
        "similar": [
            {
                "kanji": "彼",
                "level": 35,
                "meaning": "He"
            }
        ]
    },
    "講": {
        "level": 35,
        "meaning": "Lecture",
        "similar": [
            {
                "kanji": "請",
                "level": 29,
                "meaning": "Request"
            },
            {
                "kanji": "諸",
                "level": 33,
                "meaning": "Various"
            },
            {
                "kanji": "諾",
                "level": 36,
                "meaning": "Agreement"
            },
            {
                "kanji": "構",
                "level": 25,
                "meaning": "Set"
            }
        ]
    },
    "寿": {
        "level": 35,
        "meaning": "Lifespan",
        "similar": [
            {
                "kanji": "寺",
                "level": 15,
                "meaning": "Temple"
            },
            {
                "kanji": "辱",
                "level": 48,
                "meaning": "Humiliate"
            }
        ]
    },
    "汁": {
        "level": 35,
        "meaning": "Soup",
        "similar": [
            {
                "kanji": "汗",
                "level": 26,
                "meaning": "Sweat"
            },
            {
                "kanji": "斗",
                "level": 44,
                "meaning": "Ladle"
            }
        ]
    },
    "油": {
        "level": 35,
        "meaning": "Oil",
        "similar": [
            {
                "kanji": "宙",
                "level": 19,
                "meaning": "Midair"
            },
            {
                "kanji": "抽",
                "level": 49,
                "meaning": "Pluck"
            },
            {
                "kanji": "泊",
                "level": 42,
                "meaning": "Overnight"
            },
            {
                "kanji": "酒",
                "level": 10,
                "meaning": "Alcohol"
            }
        ]
    },
    "紹": {
        "level": 35,
        "meaning": "Introduce",
        "similar": [
            {
                "kanji": "絡",
                "level": 19,
                "meaning": "Entangle"
            },
            {
                "kanji": "給",
                "level": 27,
                "meaning": "Salary"
            },
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            }
        ]
    },
    "己": {
        "level": 35,
        "meaning": "Oneself",
        "similar": []
    },
    "測": {
        "level": 35,
        "meaning": "Measure",
        "similar": [
            {
                "kanji": "側",
                "level": 17,
                "meaning": "Side"
            },
            {
                "kanji": "則",
                "level": 23,
                "meaning": "Rule"
            }
        ]
    },
    "湖": {
        "level": 35,
        "meaning": "Lake",
        "similar": []
    },
    "亀": {
        "level": 35,
        "meaning": "Turtle",
        "similar": []
    },
    "互": {
        "level": 35,
        "meaning": "Mutual",
        "similar": [
            {
                "kanji": "五",
                "level": 2,
                "meaning": "Five"
            }
        ]
    },
    "介": {
        "level": 35,
        "meaning": "Jammed In",
        "similar": []
    },
    "滞": {
        "level": 35,
        "meaning": "Stagnate",
        "similar": [
            {
                "kanji": "帯",
                "level": 31,
                "meaning": "Belt"
            }
        ]
    },
    "彫": {
        "level": 35,
        "meaning": "Carve",
        "similar": [
            {
                "kanji": "周",
                "level": 14,
                "meaning": "Circumference"
            },
            {
                "kanji": "週",
                "level": 7,
                "meaning": "Week"
            }
        ]
    },
    "彼": {
        "level": 35,
        "meaning": "He",
        "similar": [
            {
                "kanji": "役",
                "level": 8,
                "meaning": "Service"
            },
            {
                "kanji": "破",
                "level": 35,
                "meaning": "Tear"
            }
        ]
    },
    "遺": {
        "level": 36,
        "meaning": "Leave Behind",
        "similar": [
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            }
        ]
    },
    "債": {
        "level": 36,
        "meaning": "Debt",
        "similar": [
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "積",
                "level": 29,
                "meaning": "Accumulate"
            },
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "貸",
                "level": 27,
                "meaning": "Lend"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            }
        ]
    },
    "舞": {
        "level": 36,
        "meaning": "Dance",
        "similar": []
    },
    "般": {
        "level": 36,
        "meaning": "Generally",
        "similar": [
            {
                "kanji": "搬",
                "level": 50,
                "meaning": "Transport"
            },
            {
                "kanji": "役",
                "level": 8,
                "meaning": "Service"
            },
            {
                "kanji": "艇",
                "level": 53,
                "meaning": "Rowboat"
            }
        ]
    },
    "牙": {
        "level": 36,
        "meaning": "Fang",
        "similar": []
    },
    "献": {
        "level": 36,
        "meaning": "Offer",
        "similar": [
            {
                "kanji": "執",
                "level": 37,
                "meaning": "Tenacious"
            },
            {
                "kanji": "南",
                "level": 6,
                "meaning": "South"
            }
        ]
    },
    "及": {
        "level": 36,
        "meaning": "Reach",
        "similar": []
    },
    "換": {
        "level": 36,
        "meaning": "Exchange",
        "similar": []
    },
    "摘": {
        "level": 36,
        "meaning": "Pluck",
        "similar": [
            {
                "kanji": "滴",
                "level": 47,
                "meaning": "Drip"
            }
        ]
    },
    "甘": {
        "level": 36,
        "meaning": "Sweet",
        "similar": []
    },
    "旧": {
        "level": 36,
        "meaning": "Former",
        "similar": [
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            },
            {
                "kanji": "児",
                "level": 28,
                "meaning": "Child"
            },
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            }
        ]
    },
    "療": {
        "level": 36,
        "meaning": "Heal",
        "similar": [
            {
                "kanji": "寮",
                "level": 46,
                "meaning": "Dormitory"
            },
            {
                "kanji": "僚",
                "level": 29,
                "meaning": "Colleague"
            },
            {
                "kanji": "源",
                "level": 34,
                "meaning": "Origin"
            }
        ]
    },
    "盟": {
        "level": 36,
        "meaning": "Alliance",
        "similar": []
    },
    "核": {
        "level": 36,
        "meaning": "Nucleus",
        "similar": [
            {
                "kanji": "校",
                "level": 7,
                "meaning": "School"
            },
            {
                "kanji": "柄",
                "level": 42,
                "meaning": "Pattern"
            }
        ]
    },
    "頼": {
        "level": 36,
        "meaning": "Trust",
        "similar": [
            {
                "kanji": "頭",
                "level": 10,
                "meaning": "Head"
            },
            {
                "kanji": "瀬",
                "level": 41,
                "meaning": "Rapids"
            },
            {
                "kanji": "類",
                "level": 18,
                "meaning": "Type"
            }
        ]
    },
    "奈": {
        "level": 36,
        "meaning": "Nara",
        "similar": []
    },
    "姓": {
        "level": 36,
        "meaning": "Surname",
        "similar": [
            {
                "kanji": "妊",
                "level": 38,
                "meaning": "Pregnant"
            },
            {
                "kanji": "狂",
                "level": 45,
                "meaning": "Lunatic"
            }
        ]
    },
    "諾": {
        "level": 36,
        "meaning": "Agreement",
        "similar": [
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "語",
                "level": 10,
                "meaning": "Language"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "調",
                "level": 10,
                "meaning": "Investigate"
            }
        ]
    },
    "将": {
        "level": 36,
        "meaning": "Commander",
        "similar": [
            {
                "kanji": "奨",
                "level": 49,
                "meaning": "Encourage"
            }
        ]
    },
    "沖": {
        "level": 36,
        "meaning": "Open Sea",
        "similar": [
            {
                "kanji": "況",
                "level": 25,
                "meaning": "Condition"
            },
            {
                "kanji": "河",
                "level": 26,
                "meaning": "River"
            }
        ]
    },
    "貿": {
        "level": 36,
        "meaning": "Trade",
        "similar": [
            {
                "kanji": "貧",
                "level": 30,
                "meaning": "Poor"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "留",
                "level": 16,
                "meaning": "Detain"
            },
            {
                "kanji": "領",
                "level": 22,
                "meaning": "Territory"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            }
        ]
    },
    "津": {
        "level": 36,
        "meaning": "Haven",
        "similar": [
            {
                "kanji": "洋",
                "level": 11,
                "meaning": "Western"
            }
        ]
    },
    "超": {
        "level": 36,
        "meaning": "Ultra",
        "similar": []
    },
    "継": {
        "level": 36,
        "meaning": "Inherit",
        "similar": []
    },
    "維": {
        "level": 36,
        "meaning": "Maintain",
        "similar": [
            {
                "kanji": "羅",
                "level": 57,
                "meaning": "Spread"
            },
            {
                "kanji": "雑",
                "level": 32,
                "meaning": "Random"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "縄": {
        "level": 36,
        "meaning": "Rope",
        "similar": [
            {
                "kanji": "紳",
                "level": 56,
                "meaning": "Gentleman"
            }
        ]
    },
    "踏": {
        "level": 36,
        "meaning": "Step",
        "similar": []
    },
    "幅": {
        "level": 36,
        "meaning": "Width",
        "similar": [
            {
                "kanji": "福",
                "level": 13,
                "meaning": "Luck"
            },
            {
                "kanji": "富",
                "level": 31,
                "meaning": "Rich"
            }
        ]
    },
    "鹿": {
        "level": 36,
        "meaning": "Deer",
        "similar": []
    },
    "廃": {
        "level": 36,
        "meaning": "Obsolete",
        "similar": [
            {
                "kanji": "発",
                "level": 9,
                "meaning": "Departure"
            }
        ]
    },
    "伎": {
        "level": 36,
        "meaning": "Deed",
        "similar": []
    },
    "伸": {
        "level": 36,
        "meaning": "Stretch",
        "similar": [
            {
                "kanji": "岬",
                "level": 59,
                "meaning": "Cape"
            },
            {
                "kanji": "旧",
                "level": 36,
                "meaning": "Former"
            },
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            },
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "旬",
                "level": 37,
                "meaning": "In"
            },
            {
                "kanji": "申",
                "level": 4,
                "meaning": "Say"
            },
            {
                "kanji": "自",
                "level": 5,
                "meaning": "Self"
            }
        ]
    },
    "依": {
        "level": 36,
        "meaning": "Reliant",
        "similar": [
            {
                "kanji": "俵",
                "level": 46,
                "meaning": "Sack"
            },
            {
                "kanji": "衣",
                "level": 41,
                "meaning": "Clothes"
            },
            {
                "kanji": "袋",
                "level": 42,
                "meaning": "Sack"
            }
        ]
    },
    "遣": {
        "level": 37,
        "meaning": "Dispatch",
        "similar": []
    },
    "聴": {
        "level": 37,
        "meaning": "Listen",
        "similar": [
            {
                "kanji": "徳",
                "level": 31,
                "meaning": "Virtue"
            }
        ]
    },
    "恵": {
        "level": 37,
        "meaning": "Favor",
        "similar": [
            {
                "kanji": "悪",
                "level": 12,
                "meaning": "Bad"
            },
            {
                "kanji": "息",
                "level": 12,
                "meaning": "Breath"
            },
            {
                "kanji": "思",
                "level": 6,
                "meaning": "Think"
            },
            {
                "kanji": "専",
                "level": 16,
                "meaning": "Specialty"
            },
            {
                "kanji": "想",
                "level": 13,
                "meaning": "Concept"
            }
        ]
    },
    "患": {
        "level": 37,
        "meaning": "Afflicted",
        "similar": [
            {
                "kanji": "忠",
                "level": 33,
                "meaning": "Loyalty"
            }
        ]
    },
    "償": {
        "level": 37,
        "meaning": "Reparation",
        "similar": [
            {
                "kanji": "賞",
                "level": 13,
                "meaning": "Prize"
            }
        ]
    },
    "兆": {
        "level": 37,
        "meaning": "Omen",
        "similar": []
    },
    "臨": {
        "level": 37,
        "meaning": "Look To",
        "similar": []
    },
    "爆": {
        "level": 37,
        "meaning": "Explode",
        "similar": [
            {
                "kanji": "暴",
                "level": 19,
                "meaning": "Violence"
            }
        ]
    },
    "刑": {
        "level": 37,
        "meaning": "Punish",
        "similar": [
            {
                "kanji": "刊",
                "level": 38,
                "meaning": "Edition"
            }
        ]
    },
    "戻": {
        "level": 37,
        "meaning": "Return",
        "similar": [
            {
                "kanji": "攻",
                "level": 28,
                "meaning": "Aggression"
            },
            {
                "kanji": "涙",
                "level": 44,
                "meaning": "Teardrop"
            }
        ]
    },
    "削": {
        "level": 37,
        "meaning": "Whittle Down",
        "similar": [
            {
                "kanji": "肖",
                "level": 58,
                "meaning": "Resemblance"
            },
            {
                "kanji": "前",
                "level": 6,
                "meaning": "Front"
            }
        ]
    },
    "抗": {
        "level": 37,
        "meaning": "Confront",
        "similar": [
            {
                "kanji": "拡",
                "level": 33,
                "meaning": "Extend"
            },
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            },
            {
                "kanji": "坑",
                "level": 60,
                "meaning": "Pit"
            }
        ]
    },
    "抱": {
        "level": 37,
        "meaning": "Hug",
        "similar": [
            {
                "kanji": "泡",
                "level": 46,
                "meaning": "Bubbles"
            }
        ]
    },
    "抵": {
        "level": 37,
        "meaning": "Resist",
        "similar": []
    },
    "狙": {
        "level": 37,
        "meaning": "Aim",
        "similar": []
    },
    "募": {
        "level": 37,
        "meaning": "Recruit",
        "similar": [
            {
                "kanji": "幕",
                "level": 34,
                "meaning": "Curtain"
            },
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            },
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "慕",
                "level": 60,
                "meaning": "Yearn"
            },
            {
                "kanji": "暮",
                "level": 33,
                "meaning": "Livelihood"
            }
        ]
    },
    "掲": {
        "level": 37,
        "meaning": "Display",
        "similar": [
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            },
            {
                "kanji": "渇",
                "level": 30,
                "meaning": "Thirst"
            },
            {
                "kanji": "喝",
                "level": 57,
                "meaning": "Scold"
            }
        ]
    },
    "葬": {
        "level": 37,
        "meaning": "Burial",
        "similar": []
    },
    "闘": {
        "level": 37,
        "meaning": "Struggle",
        "similar": []
    },
    "旬": {
        "level": 37,
        "meaning": "In Season",
        "similar": [
            {
                "kanji": "旨",
                "level": 43,
                "meaning": "Point"
            },
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            },
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            }
        ]
    },
    "昭": {
        "level": 37,
        "meaning": "Shining",
        "similar": [
            {
                "kanji": "照",
                "level": 30,
                "meaning": "Illuminate"
            }
        ]
    },
    "陣": {
        "level": 37,
        "meaning": "Army Base",
        "similar": [
            {
                "kanji": "陳",
                "level": 52,
                "meaning": "Exhibit"
            },
            {
                "kanji": "障",
                "level": 26,
                "meaning": "Hinder"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "恒",
                "level": 52,
                "meaning": "Constant"
            },
            {
                "kanji": "軍",
                "level": 15,
                "meaning": "Army"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            }
        ]
    },
    "執": {
        "level": 37,
        "meaning": "Tenacious",
        "similar": [
            {
                "kanji": "幸",
                "level": 16,
                "meaning": "Happiness"
            },
            {
                "kanji": "珠",
                "level": 49,
                "meaning": "Pearl"
            },
            {
                "kanji": "献",
                "level": 36,
                "meaning": "Offer"
            }
        ]
    },
    "塁": {
        "level": 37,
        "meaning": "Base",
        "similar": []
    },
    "契": {
        "level": 37,
        "meaning": "Pledge",
        "similar": []
    },
    "香": {
        "level": 37,
        "meaning": "Fragrance",
        "similar": [
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            },
            {
                "kanji": "春",
                "level": 15,
                "meaning": "Spring"
            },
            {
                "kanji": "番",
                "level": 8,
                "meaning": "Number"
            }
        ]
    },
    "崩": {
        "level": 37,
        "meaning": "Crumble",
        "similar": []
    },
    "跡": {
        "level": 37,
        "meaning": "Traces",
        "similar": [
            {
                "kanji": "践",
                "level": 54,
                "meaning": "Practice"
            },
            {
                "kanji": "跳",
                "level": 37,
                "meaning": "Hop"
            }
        ]
    },
    "跳": {
        "level": 37,
        "meaning": "Hop",
        "similar": [
            {
                "kanji": "践",
                "level": 54,
                "meaning": "Practice"
            },
            {
                "kanji": "跡",
                "level": 37,
                "meaning": "Traces"
            }
        ]
    },
    "湾": {
        "level": 37,
        "meaning": "Gulf",
        "similar": []
    },
    "漁": {
        "level": 37,
        "meaning": "Fishing",
        "similar": [
            {
                "kanji": "魚",
                "level": 7,
                "meaning": "Fish"
            }
        ]
    },
    "弾": {
        "level": 37,
        "meaning": "Bullet",
        "similar": [
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "禅",
                "level": 18,
                "meaning": "Zen"
            }
        ]
    },
    "逃": {
        "level": 38,
        "meaning": "Escape",
        "similar": []
    },
    "避": {
        "level": 38,
        "meaning": "Dodge",
        "similar": [
            {
                "kanji": "壁",
                "level": 39,
                "meaning": "Wall"
            }
        ]
    },
    "還": {
        "level": 38,
        "meaning": "Send Back",
        "similar": []
    },
    "傾": {
        "level": 38,
        "meaning": "Lean",
        "similar": [
            {
                "kanji": "貨",
                "level": 31,
                "meaning": "Freight"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "煩",
                "level": 60,
                "meaning": "Annoy"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "質",
                "level": 24,
                "meaning": "Quality"
            }
        ]
    },
    "慮": {
        "level": 38,
        "meaning": "Consider",
        "similar": [
            {
                "kanji": "虜",
                "level": 55,
                "meaning": "Captive"
            },
            {
                "kanji": "膚",
                "level": 51,
                "meaning": "Skin"
            }
        ]
    },
    "致": {
        "level": 38,
        "meaning": "Do",
        "similar": [
            {
                "kanji": "政",
                "level": 16,
                "meaning": "Politics"
            },
            {
                "kanji": "攻",
                "level": 28,
                "meaning": "Aggression"
            }
        ]
    },
    "懸": {
        "level": 38,
        "meaning": "Suspend",
        "similar": []
    },
    "刊": {
        "level": 38,
        "meaning": "Edition",
        "similar": [
            {
                "kanji": "刑",
                "level": 37,
                "meaning": "Punish"
            },
            {
                "kanji": "判",
                "level": 21,
                "meaning": "Judge"
            }
        ]
    },
    "房": {
        "level": 38,
        "meaning": "Cluster",
        "similar": []
    },
    "扱": {
        "level": 38,
        "meaning": "Handle",
        "similar": [
            {
                "kanji": "抜",
                "level": 25,
                "meaning": "Extract"
            },
            {
                "kanji": "投",
                "level": 8,
                "meaning": "Throw"
            }
        ]
    },
    "抑": {
        "level": 38,
        "meaning": "Suppress",
        "similar": [
            {
                "kanji": "折",
                "level": 14,
                "meaning": "Fold"
            }
        ]
    },
    "択": {
        "level": 38,
        "meaning": "Select",
        "similar": [
            {
                "kanji": "沢",
                "level": 23,
                "meaning": "Swamp"
            },
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            }
        ]
    },
    "却": {
        "level": 38,
        "meaning": "Contrary",
        "similar": [
            {
                "kanji": "去",
                "level": 4,
                "meaning": "Past"
            }
        ]
    },
    "描": {
        "level": 38,
        "meaning": "Draw",
        "similar": [
            {
                "kanji": "措",
                "level": 41,
                "meaning": "Set"
            },
            {
                "kanji": "猫",
                "level": 15,
                "meaning": "Cat"
            },
            {
                "kanji": "抽",
                "level": 49,
                "meaning": "Pluck"
            },
            {
                "kanji": "苗",
                "level": 51,
                "meaning": "Seedling"
            }
        ]
    },
    "盤": {
        "level": 38,
        "meaning": "Tray",
        "similar": []
    },
    "需": {
        "level": 38,
        "meaning": "Demand",
        "similar": []
    },
    "奏": {
        "level": 38,
        "meaning": "Play Music",
        "similar": [
            {
                "kanji": "奉",
                "level": 55,
                "meaning": "Dedicate"
            },
            {
                "kanji": "耕",
                "level": 51,
                "meaning": "Plow"
            },
            {
                "kanji": "泰",
                "level": 43,
                "meaning": "Peace"
            }
        ]
    },
    "奥": {
        "level": 38,
        "meaning": "Interior",
        "similar": []
    },
    "妊": {
        "level": 38,
        "meaning": "Pregnant",
        "similar": [
            {
                "kanji": "姓",
                "level": 36,
                "meaning": "Surname"
            },
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            }
        ]
    },
    "称": {
        "level": 38,
        "meaning": "Title",
        "similar": [
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            },
            {
                "kanji": "移",
                "level": 28,
                "meaning": "Shift"
            },
            {
                "kanji": "村",
                "level": 4,
                "meaning": "Village"
            },
            {
                "kanji": "材",
                "level": 14,
                "meaning": "Lumber"
            },
            {
                "kanji": "秒",
                "level": 11,
                "meaning": "Second"
            },
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            },
            {
                "kanji": "徐",
                "level": 53,
                "meaning": "Gently"
            }
        ]
    },
    "託": {
        "level": 38,
        "meaning": "Consign",
        "similar": [
            {
                "kanji": "記",
                "level": 7,
                "meaning": "Write"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "訂",
                "level": 50,
                "meaning": "Revise"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            }
        ]
    },
    "娠": {
        "level": 38,
        "meaning": "Pregnant",
        "similar": [
            {
                "kanji": "振",
                "level": 26,
                "meaning": "Shake"
            },
            {
                "kanji": "妹",
                "level": 6,
                "meaning": "Younger"
            }
        ]
    },
    "宜": {
        "level": 38,
        "meaning": "Best Regards",
        "similar": []
    },
    "賂": {
        "level": 38,
        "meaning": "Bribe",
        "similar": []
    },
    "賄": {
        "level": 38,
        "meaning": "Bribe",
        "similar": [
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            },
            {
                "kanji": "晴",
                "level": 15,
                "meaning": "Clear"
            },
            {
                "kanji": "暗",
                "level": 13,
                "meaning": "Dark"
            }
        ]
    },
    "贈": {
        "level": 38,
        "meaning": "Presents",
        "similar": []
    },
    "緒": {
        "level": 38,
        "meaning": "Together",
        "similar": [
            {
                "kanji": "績",
                "level": 32,
                "meaning": "Exploits"
            },
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            },
            {
                "kanji": "紺",
                "level": 57,
                "meaning": "Navy"
            },
            {
                "kanji": "縮",
                "level": 34,
                "meaning": "Shrink"
            }
        ]
    },
    "緩": {
        "level": 38,
        "meaning": "Loose",
        "similar": []
    },
    "繰": {
        "level": 38,
        "meaning": "Spin",
        "similar": [
            {
                "kanji": "燥",
                "level": 51,
                "meaning": "Dry"
            }
        ]
    },
    "伴": {
        "level": 38,
        "meaning": "Accompany",
        "similar": [
            {
                "kanji": "併",
                "level": 38,
                "meaning": "Join"
            },
            {
                "kanji": "件",
                "level": 21,
                "meaning": "Matter"
            },
            {
                "kanji": "辛",
                "level": 44,
                "meaning": "Spicy"
            },
            {
                "kanji": "半",
                "level": 3,
                "meaning": "Half"
            }
        ]
    },
    "齢": {
        "level": 38,
        "meaning": "Age",
        "similar": [
            {
                "kanji": "歯",
                "level": 12,
                "meaning": "Tooth"
            }
        ]
    },
    "併": {
        "level": 38,
        "meaning": "Join",
        "similar": [
            {
                "kanji": "伴",
                "level": 38,
                "meaning": "Accompany"
            },
            {
                "kanji": "件",
                "level": 21,
                "meaning": "Matter"
            }
        ]
    },
    "邦": {
        "level": 39,
        "meaning": "Home Country",
        "similar": [
            {
                "kanji": "邪",
                "level": 50,
                "meaning": "Wicked"
            }
        ]
    },
    "充": {
        "level": 39,
        "meaning": "Allocate",
        "similar": []
    },
    "免": {
        "level": 39,
        "meaning": "Excuse",
        "similar": [
            {
                "kanji": "勉",
                "level": 12,
                "meaning": "Exertion"
            }
        ]
    },
    "慎": {
        "level": 39,
        "meaning": "Humility",
        "similar": [
            {
                "kanji": "真",
                "level": 16,
                "meaning": "Reality"
            },
            {
                "kanji": "恒",
                "level": 52,
                "meaning": "Constant"
            },
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            }
        ]
    },
    "鈴": {
        "level": 39,
        "meaning": "Buzzer",
        "similar": [
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            },
            {
                "kanji": "銘",
                "level": 50,
                "meaning": "Inscription"
            },
            {
                "kanji": "鈍",
                "level": 46,
                "meaning": "Dull"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            }
        ]
    },
    "片": {
        "level": 39,
        "meaning": "One Sided",
        "similar": []
    },
    "銃": {
        "level": 39,
        "meaning": "Gun",
        "similar": [
            {
                "kanji": "鉱",
                "level": 41,
                "meaning": "Mineral"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "銭",
                "level": 32,
                "meaning": "Coin"
            }
        ]
    },
    "拒": {
        "level": 39,
        "meaning": "Refuse",
        "similar": []
    },
    "勧": {
        "level": 39,
        "meaning": "Recommend",
        "similar": [
            {
                "kanji": "歓",
                "level": 34,
                "meaning": "Delight"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "鋼": {
        "level": 39,
        "meaning": "Steel",
        "similar": []
    },
    "控": {
        "level": 39,
        "meaning": "Abstain",
        "similar": [
            {
                "kanji": "空",
                "level": 5,
                "meaning": "Sky"
            },
            {
                "kanji": "搾",
                "level": 56,
                "meaning": "Squeeze"
            }
        ]
    },
    "甲": {
        "level": 39,
        "meaning": "Turtle Shell",
        "similar": [
            {
                "kanji": "申",
                "level": 4,
                "meaning": "Say"
            },
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "日",
                "level": 2,
                "meaning": "Sun"
            },
            {
                "kanji": "目",
                "level": 2,
                "meaning": "Eye"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            }
        ]
    },
    "斐": {
        "level": 39,
        "meaning": "Patterned",
        "similar": []
    },
    "阜": {
        "level": 39,
        "meaning": "Mound",
        "similar": []
    },
    "隆": {
        "level": 39,
        "meaning": "Prosperity",
        "similar": [
            {
                "kanji": "降",
                "level": 34,
                "meaning": "Descend"
            }
        ]
    },
    "雇": {
        "level": 39,
        "meaning": "Employ",
        "similar": [
            {
                "kanji": "雅",
                "level": 40,
                "meaning": "Elegant"
            },
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "雄",
                "level": 29,
                "meaning": "Male"
            },
            {
                "kanji": "唯",
                "level": 49,
                "meaning": "Solely"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "圏": {
        "level": 39,
        "meaning": "Range",
        "similar": [
            {
                "kanji": "巻",
                "level": 25,
                "meaning": "Scroll"
            }
        ]
    },
    "枠": {
        "level": 39,
        "meaning": "Frame",
        "similar": [
            {
                "kanji": "析",
                "level": 42,
                "meaning": "Analysis"
            },
            {
                "kanji": "粋",
                "level": 34,
                "meaning": "Stylish"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            }
        ]
    },
    "埋": {
        "level": 39,
        "meaning": "Bury",
        "similar": [
            {
                "kanji": "理",
                "level": 7,
                "meaning": "Reason"
            },
            {
                "kanji": "重",
                "level": 9,
                "meaning": "Heavy"
            },
            {
                "kanji": "里",
                "level": 5,
                "meaning": "Home"
            },
            {
                "kanji": "垣",
                "level": 43,
                "meaning": "Hedge"
            },
            {
                "kanji": "草",
                "level": 5,
                "meaning": "Grass"
            }
        ]
    },
    "埼": {
        "level": 39,
        "meaning": "Cape",
        "similar": []
    },
    "項": {
        "level": 39,
        "meaning": "Paragraph",
        "similar": [
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            },
            {
                "kanji": "現",
                "level": 23,
                "meaning": "Present"
            },
            {
                "kanji": "墳",
                "level": 50,
                "meaning": "Tomb"
            }
        ]
    },
    "壁": {
        "level": 39,
        "meaning": "Wall",
        "similar": [
            {
                "kanji": "避",
                "level": 38,
                "meaning": "Dodge"
            }
        ]
    },
    "棋": {
        "level": 39,
        "meaning": "Chess Piece",
        "similar": [
            {
                "kanji": "模",
                "level": 25,
                "meaning": "Imitation"
            },
            {
                "kanji": "旗",
                "level": 30,
                "meaning": "Flag"
            }
        ]
    },
    "祉": {
        "level": 39,
        "meaning": "Welfare",
        "similar": [
            {
                "kanji": "社",
                "level": 5,
                "meaning": "Company"
            }
        ]
    },
    "奪": {
        "level": 39,
        "meaning": "Rob",
        "similar": []
    },
    "稲": {
        "level": 39,
        "meaning": "Rice Plant",
        "similar": []
    },
    "謙": {
        "level": 39,
        "meaning": "Modesty",
        "similar": [
            {
                "kanji": "詳",
                "level": 17,
                "meaning": "Detailed"
            }
        ]
    },
    "譲": {
        "level": 39,
        "meaning": "Defer",
        "similar": [
            {
                "kanji": "壌",
                "level": 53,
                "meaning": "Soil"
            }
        ]
    },
    "岐": {
        "level": 39,
        "meaning": "Branch Off",
        "similar": []
    },
    "渋": {
        "level": 39,
        "meaning": "Bitter",
        "similar": []
    },
    "躍": {
        "level": 39,
        "meaning": "Leap",
        "similar": []
    },
    "仙": {
        "level": 39,
        "meaning": "Hermit",
        "similar": []
    },
    "御": {
        "level": 39,
        "meaning": "Honorable",
        "similar": [
            {
                "kanji": "卸",
                "level": 54,
                "meaning": "Wholesale"
            }
        ]
    },
    "群": {
        "level": 39,
        "meaning": "Flock",
        "similar": [
            {
                "kanji": "詳",
                "level": 17,
                "meaning": "Detailed"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            }
        ]
    },
    "透": {
        "level": 40,
        "meaning": "Transparent",
        "similar": [
            {
                "kanji": "秀",
                "level": 23,
                "meaning": "Excel"
            }
        ]
    },
    "兼": {
        "level": 40,
        "meaning": "Concurrently",
        "similar": [
            {
                "kanji": "嫌",
                "level": 20,
                "meaning": "Dislike"
            },
            {
                "kanji": "廉",
                "level": 60,
                "meaning": "Bargain"
            },
            {
                "kanji": "美",
                "level": 9,
                "meaning": "Beauty"
            }
        ]
    },
    "戒": {
        "level": 40,
        "meaning": "Commandment",
        "similar": []
    },
    "剤": {
        "level": 40,
        "meaning": "Dose",
        "similar": [
            {
                "kanji": "斉",
                "level": 43,
                "meaning": "Simultaneous"
            }
        ]
    },
    "犠": {
        "level": 40,
        "meaning": "Sacrifice",
        "similar": [
            {
                "kanji": "儀",
                "level": 41,
                "meaning": "Ceremony"
            },
            {
                "kanji": "義",
                "level": 21,
                "meaning": "Righteousness"
            },
            {
                "kanji": "議",
                "level": 20,
                "meaning": "Deliberation"
            }
        ]
    },
    "鋭": {
        "level": 40,
        "meaning": "Sharp",
        "similar": [
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            }
        ]
    },
    "茂": {
        "level": 40,
        "meaning": "Luxuriant",
        "similar": [
            {
                "kanji": "城",
                "level": 23,
                "meaning": "Castle"
            },
            {
                "kanji": "共",
                "level": 11,
                "meaning": "Together"
            }
        ]
    },
    "獲": {
        "level": 40,
        "meaning": "Seize",
        "similar": [
            {
                "kanji": "穫",
                "level": 48,
                "meaning": "Harvest"
            }
        ]
    },
    "排": {
        "level": 40,
        "meaning": "Reject",
        "similar": [
            {
                "kanji": "扉",
                "level": 47,
                "meaning": "Front"
            },
            {
                "kanji": "俳",
                "level": 23,
                "meaning": "Haiku"
            },
            {
                "kanji": "非",
                "level": 17,
                "meaning": "Injustice"
            }
        ]
    },
    "吹": {
        "level": 40,
        "meaning": "Blow",
        "similar": [
            {
                "kanji": "史",
                "level": 19,
                "meaning": "History"
            },
            {
                "kanji": "吸",
                "level": 22,
                "meaning": "Suck"
            },
            {
                "kanji": "足",
                "level": 4,
                "meaning": "Foot"
            }
        ]
    },
    "携": {
        "level": 40,
        "meaning": "Portable",
        "similar": [
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "準",
                "level": 23,
                "meaning": "Standard"
            },
            {
                "kanji": "准",
                "level": 53,
                "meaning": "Semi"
            }
        ]
    },
    "唱": {
        "level": 40,
        "meaning": "Chant",
        "similar": [
            {
                "kanji": "帽",
                "level": 47,
                "meaning": "Hat"
            },
            {
                "kanji": "晶",
                "level": 50,
                "meaning": "Crystal"
            },
            {
                "kanji": "僧",
                "level": 18,
                "meaning": "Priest"
            }
        ]
    },
    "敏": {
        "level": 40,
        "meaning": "Alert",
        "similar": []
    },
    "敷": {
        "level": 40,
        "meaning": "Spread",
        "similar": []
    },
    "薄": {
        "level": 40,
        "meaning": "Dilute",
        "similar": []
    },
    "隣": {
        "level": 40,
        "meaning": "Neighbor",
        "similar": []
    },
    "雅": {
        "level": 40,
        "meaning": "Elegant",
        "similar": [
            {
                "kanji": "雇",
                "level": 39,
                "meaning": "Employ"
            },
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "雑",
                "level": 32,
                "meaning": "Random"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            },
            {
                "kanji": "雄",
                "level": 29,
                "meaning": "Male"
            }
        ]
    },
    "柱": {
        "level": 40,
        "meaning": "Pillar",
        "similar": [
            {
                "kanji": "栓",
                "level": 55,
                "meaning": "Cork"
            }
        ]
    },
    "堀": {
        "level": 40,
        "meaning": "Ditch",
        "similar": [
            {
                "kanji": "掘",
                "level": 42,
                "meaning": "Dig"
            },
            {
                "kanji": "屈",
                "level": 27,
                "meaning": "Yield"
            }
        ]
    },
    "頻": {
        "level": 40,
        "meaning": "Frequent",
        "similar": [
            {
                "kanji": "賓",
                "level": 55,
                "meaning": "VIP"
            },
            {
                "kanji": "顔",
                "level": 10,
                "meaning": "Face"
            }
        ]
    },
    "衝": {
        "level": 40,
        "meaning": "Collide",
        "similar": [
            {
                "kanji": "働",
                "level": 11,
                "meaning": "Work"
            }
        ]
    },
    "顧": {
        "level": 40,
        "meaning": "Review",
        "similar": []
    },
    "褒": {
        "level": 40,
        "meaning": "Praise",
        "similar": []
    },
    "駆": {
        "level": 40,
        "meaning": "Gallop",
        "similar": [
            {
                "kanji": "駄",
                "level": 50,
                "meaning": "Burdensome"
            },
            {
                "kanji": "駐",
                "level": 40,
                "meaning": "Resident"
            },
            {
                "kanji": "騎",
                "level": 48,
                "meaning": "Horse"
            },
            {
                "kanji": "馬",
                "level": 8,
                "meaning": "Horse"
            },
            {
                "kanji": "駅",
                "level": 13,
                "meaning": "Station"
            }
        ]
    },
    "駐": {
        "level": 40,
        "meaning": "Resident",
        "similar": [
            {
                "kanji": "駄",
                "level": 50,
                "meaning": "Burdensome"
            },
            {
                "kanji": "駆",
                "level": 40,
                "meaning": "Gallop"
            }
        ]
    },
    "誉": {
        "level": 40,
        "meaning": "Honor",
        "similar": []
    },
    "孝": {
        "level": 40,
        "meaning": "Filial Piety",
        "similar": []
    },
    "殖": {
        "level": 40,
        "meaning": "Multiply",
        "similar": [
            {
                "kanji": "植",
                "level": 12,
                "meaning": "Plant"
            },
            {
                "kanji": "値",
                "level": 22,
                "meaning": "Value"
            }
        ]
    },
    "殿": {
        "level": 40,
        "meaning": "Milord",
        "similar": []
    },
    "巡": {
        "level": 40,
        "meaning": "Patrol",
        "similar": []
    },
    "繁": {
        "level": 40,
        "meaning": "Overgrown",
        "similar": []
    },
    "俊": {
        "level": 40,
        "meaning": "Genius",
        "similar": [
            {
                "kanji": "唆",
                "level": 52,
                "meaning": "Instigate"
            }
        ]
    },
    "瀬": {
        "level": 41,
        "meaning": "Rapids",
        "similar": [
            {
                "kanji": "頼",
                "level": 36,
                "meaning": "Trust"
            },
            {
                "kanji": "頭",
                "level": 10,
                "meaning": "Head"
            },
            {
                "kanji": "類",
                "level": 18,
                "meaning": "Type"
            }
        ]
    },
    "遜": {
        "level": 41,
        "meaning": "Humble",
        "similar": []
    },
    "偽": {
        "level": 41,
        "meaning": "Fake",
        "similar": [
            {
                "kanji": "為",
                "level": 35,
                "meaning": "Sake"
            }
        ]
    },
    "炭": {
        "level": 41,
        "meaning": "Charcoal",
        "similar": [
            {
                "kanji": "峡",
                "level": 57,
                "meaning": "Ravine"
            }
        ]
    },
    "郷": {
        "level": 41,
        "meaning": "Hometown",
        "similar": [
            {
                "kanji": "郎",
                "level": 27,
                "meaning": "Guy"
            }
        ]
    },
    "儀": {
        "level": 41,
        "meaning": "Ceremony",
        "similar": [
            {
                "kanji": "犠",
                "level": 40,
                "meaning": "Sacrifice"
            },
            {
                "kanji": "義",
                "level": 21,
                "meaning": "Righteousness"
            },
            {
                "kanji": "議",
                "level": 20,
                "meaning": "Deliberation"
            }
        ]
    },
    "酎": {
        "level": 41,
        "meaning": "Sake",
        "similar": []
    },
    "至": {
        "level": 41,
        "meaning": "Attain",
        "similar": []
    },
    "艦": {
        "level": 41,
        "meaning": "Warship",
        "similar": [
            {
                "kanji": "鑑",
                "level": 31,
                "meaning": "Model"
            },
            {
                "kanji": "監",
                "level": 29,
                "meaning": "Oversee"
            }
        ]
    },
    "鉱": {
        "level": 41,
        "meaning": "Mineral",
        "similar": [
            {
                "kanji": "銃",
                "level": 39,
                "meaning": "Gun"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            },
            {
                "kanji": "鋳",
                "level": 59,
                "meaning": "Cast"
            },
            {
                "kanji": "銭",
                "level": 32,
                "meaning": "Coin"
            },
            {
                "kanji": "鉢",
                "level": 48,
                "meaning": "Bowl"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            }
        ]
    },
    "拠": {
        "level": 41,
        "meaning": "Based On",
        "similar": []
    },
    "拳": {
        "level": 41,
        "meaning": "Fist",
        "similar": []
    },
    "包": {
        "level": 41,
        "meaning": "Wrap",
        "similar": []
    },
    "措": {
        "level": 41,
        "meaning": "Set Aside",
        "similar": [
            {
                "kanji": "描",
                "level": 38,
                "meaning": "Draw"
            },
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "借",
                "level": 18,
                "meaning": "Borrow"
            },
            {
                "kanji": "惜",
                "level": 55,
                "meaning": "Frugal"
            }
        ]
    },
    "撤": {
        "level": 41,
        "meaning": "Withdrawal",
        "similar": [
            {
                "kanji": "徹",
                "level": 41,
                "meaning": "Penetrate"
            },
            {
                "kanji": "散",
                "level": 31,
                "meaning": "Scatter"
            }
        ]
    },
    "畑": {
        "level": 41,
        "meaning": "Field",
        "similar": []
    },
    "虎": {
        "level": 41,
        "meaning": "Tiger",
        "similar": []
    },
    "蛍": {
        "level": 41,
        "meaning": "Firefly",
        "similar": []
    },
    "蜂": {
        "level": 41,
        "meaning": "Bee",
        "similar": []
    },
    "蜜": {
        "level": 41,
        "meaning": "Honey",
        "similar": []
    },
    "衣": {
        "level": 41,
        "meaning": "Clothes",
        "similar": [
            {
                "kanji": "交",
                "level": 5,
                "meaning": "Mix"
            },
            {
                "kanji": "表",
                "level": 9,
                "meaning": "Express"
            },
            {
                "kanji": "依",
                "level": 36,
                "meaning": "Reliant"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            }
        ]
    },
    "墟": {
        "level": 41,
        "meaning": "Ruins",
        "similar": []
    },
    "棄": {
        "level": 41,
        "meaning": "Abandon",
        "similar": []
    },
    "樹": {
        "level": 41,
        "meaning": "Wood",
        "similar": []
    },
    "誠": {
        "level": 41,
        "meaning": "Sincerity",
        "similar": [
            {
                "kanji": "誘",
                "level": 27,
                "meaning": "Invite"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "詐",
                "level": 47,
                "meaning": "Lie"
            },
            {
                "kanji": "該",
                "level": 55,
                "meaning": "The"
            },
            {
                "kanji": "診",
                "level": 29,
                "meaning": "Diagnose"
            },
            {
                "kanji": "試",
                "level": 9,
                "meaning": "Try"
            },
            {
                "kanji": "詠",
                "level": 59,
                "meaning": "Compose"
            },
            {
                "kanji": "訟",
                "level": 25,
                "meaning": "Lawsuit"
            }
        ]
    },
    "仁": {
        "level": 41,
        "meaning": "Humanity",
        "similar": [
            {
                "kanji": "仕",
                "level": 4,
                "meaning": "Doing"
            }
        ]
    },
    "伺": {
        "level": 41,
        "meaning": "Pay Respects",
        "similar": [
            {
                "kanji": "同",
                "level": 5,
                "meaning": "Same"
            },
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "合",
                "level": 12,
                "meaning": "Suit"
            },
            {
                "kanji": "向",
                "level": 6,
                "meaning": "Yonder"
            },
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            },
            {
                "kanji": "作",
                "level": 5,
                "meaning": "Make"
            },
            {
                "kanji": "司",
                "level": 15,
                "meaning": "Director"
            }
        ]
    },
    "潜": {
        "level": 41,
        "meaning": "Conceal",
        "similar": [
            {
                "kanji": "替",
                "level": 25,
                "meaning": "Replace"
            }
        ]
    },
    "侵": {
        "level": 41,
        "meaning": "Invade",
        "similar": [
            {
                "kanji": "浸",
                "level": 49,
                "meaning": "Immersed"
            }
        ]
    },
    "徹": {
        "level": 41,
        "meaning": "Penetrate",
        "similar": [
            {
                "kanji": "撤",
                "level": 41,
                "meaning": "Withdrawal"
            }
        ]
    },
    "肝": {
        "level": 42,
        "meaning": "Liver",
        "similar": [
            {
                "kanji": "用",
                "level": 3,
                "meaning": "Task"
            }
        ]
    },
    "焦": {
        "level": 42,
        "meaning": "Char",
        "similar": [
            {
                "kanji": "進",
                "level": 10,
                "meaning": "Advance"
            },
            {
                "kanji": "馬",
                "level": 8,
                "meaning": "Horse"
            },
            {
                "kanji": "礁",
                "level": 59,
                "meaning": "Reef"
            }
        ]
    },
    "克": {
        "level": 42,
        "meaning": "Overcome",
        "similar": [
            {
                "kanji": "乱",
                "level": 19,
                "meaning": "Riot"
            },
            {
                "kanji": "古",
                "level": 3,
                "meaning": "Old"
            },
            {
                "kanji": "兄",
                "level": 5,
                "meaning": "Older"
            }
        ]
    },
    "到": {
        "level": 42,
        "meaning": "Arrival",
        "similar": [
            {
                "kanji": "倒",
                "level": 20,
                "meaning": "Overthrow"
            }
        ]
    },
    "芝": {
        "level": 42,
        "meaning": "Lawn",
        "similar": []
    },
    "括": {
        "level": 42,
        "meaning": "Fasten",
        "similar": [
            {
                "kanji": "据",
                "level": 53,
                "meaning": "Install"
            },
            {
                "kanji": "捨",
                "level": 32,
                "meaning": "Throw"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            },
            {
                "kanji": "拾",
                "level": 11,
                "meaning": "Pick"
            },
            {
                "kanji": "拘",
                "level": 49,
                "meaning": "Arrest"
            },
            {
                "kanji": "拓",
                "level": 49,
                "meaning": "Cultivation"
            },
            {
                "kanji": "活",
                "level": 6,
                "meaning": "Lively"
            }
        ]
    },
    "挑": {
        "level": 42,
        "meaning": "Challenge",
        "similar": [
            {
                "kanji": "桃",
                "level": 44,
                "meaning": "Peach"
            }
        ]
    },
    "荒": {
        "level": 42,
        "meaning": "Wild",
        "similar": []
    },
    "掘": {
        "level": 42,
        "meaning": "Dig",
        "similar": [
            {
                "kanji": "堀",
                "level": 40,
                "meaning": "Ditch"
            },
            {
                "kanji": "拙",
                "level": 59,
                "meaning": "Clumsy"
            },
            {
                "kanji": "屈",
                "level": 27,
                "meaning": "Yield"
            }
        ]
    },
    "双": {
        "level": 42,
        "meaning": "Pair",
        "similar": []
    },
    "揚": {
        "level": 42,
        "meaning": "Hoist",
        "similar": [
            {
                "kanji": "湯",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "掲",
                "level": 37,
                "meaning": "Display"
            },
            {
                "kanji": "提",
                "level": 22,
                "meaning": "Present"
            },
            {
                "kanji": "陽",
                "level": 12,
                "meaning": "Sunshine"
            },
            {
                "kanji": "腸",
                "level": 57,
                "meaning": "Intestines"
            },
            {
                "kanji": "傷",
                "level": 32,
                "meaning": "Wound"
            }
        ]
    },
    "握": {
        "level": 42,
        "meaning": "Grip",
        "similar": [
            {
                "kanji": "屋",
                "level": 9,
                "meaning": "Roof"
            }
        ]
    },
    "揺": {
        "level": 42,
        "meaning": "Shake",
        "similar": [
            {
                "kanji": "援",
                "level": 22,
                "meaning": "Aid"
            }
        ]
    },
    "哲": {
        "level": 42,
        "meaning": "Philosophy",
        "similar": [
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "拾",
                "level": 11,
                "meaning": "Pick"
            },
            {
                "kanji": "捨",
                "level": 32,
                "meaning": "Throw"
            },
            {
                "kanji": "据",
                "level": 53,
                "meaning": "Install"
            },
            {
                "kanji": "誓",
                "level": 49,
                "meaning": "Vow"
            },
            {
                "kanji": "招",
                "level": 27,
                "meaning": "Beckon"
            },
            {
                "kanji": "逝",
                "level": 60,
                "meaning": "Die"
            },
            {
                "kanji": "拓",
                "level": 49,
                "meaning": "Cultivation"
            }
        ]
    },
    "斎": {
        "level": 42,
        "meaning": "Purification",
        "similar": []
    },
    "喪": {
        "level": 42,
        "meaning": "Mourning",
        "similar": []
    },
    "暫": {
        "level": 42,
        "meaning": "Temporarily",
        "similar": []
    },
    "析": {
        "level": 42,
        "meaning": "Analysis",
        "similar": [
            {
                "kanji": "枠",
                "level": 39,
                "meaning": "Frame"
            },
            {
                "kanji": "柳",
                "level": 47,
                "meaning": "Willow"
            },
            {
                "kanji": "杉",
                "level": 35,
                "meaning": "Cedar"
            },
            {
                "kanji": "断",
                "level": 21,
                "meaning": "Cut"
            },
            {
                "kanji": "粋",
                "level": 34,
                "meaning": "Stylish"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            }
        ]
    },
    "枢": {
        "level": 42,
        "meaning": "Hinge",
        "similar": [
            {
                "kanji": "医",
                "level": 8,
                "meaning": "Medicine"
            },
            {
                "kanji": "杯",
                "level": 29,
                "meaning": "Cup"
            },
            {
                "kanji": "板",
                "level": 29,
                "meaning": "Board"
            }
        ]
    },
    "柄": {
        "level": 42,
        "meaning": "Pattern",
        "similar": [
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "核",
                "level": 36,
                "meaning": "Nucleus"
            }
        ]
    },
    "堅": {
        "level": 42,
        "meaning": "Solid",
        "similar": []
    },
    "袋": {
        "level": 42,
        "meaning": "Sack",
        "similar": [
            {
                "kanji": "依",
                "level": 36,
                "meaning": "Reliant"
            },
            {
                "kanji": "俵",
                "level": 46,
                "meaning": "Sack"
            }
        ]
    },
    "範": {
        "level": 42,
        "meaning": "Example",
        "similar": []
    },
    "泊": {
        "level": 42,
        "meaning": "Overnight",
        "similar": [
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "油",
                "level": 35,
                "meaning": "Oil"
            },
            {
                "kanji": "習",
                "level": 10,
                "meaning": "Learn"
            },
            {
                "kanji": "酒",
                "level": 10,
                "meaning": "Alcohol"
            }
        ]
    },
    "糾": {
        "level": 42,
        "meaning": "Twist",
        "similar": [
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "紀",
                "level": 15,
                "meaning": "Account"
            },
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            },
            {
                "kanji": "結",
                "level": 17,
                "meaning": "Bind"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            },
            {
                "kanji": "純",
                "level": 34,
                "meaning": "Pure"
            }
        ]
    },
    "紛": {
        "level": 42,
        "meaning": "Distract",
        "similar": [
            {
                "kanji": "約",
                "level": 14,
                "meaning": "Promise"
            },
            {
                "kanji": "終",
                "level": 10,
                "meaning": "End"
            },
            {
                "kanji": "紙",
                "level": 7,
                "meaning": "Paper"
            },
            {
                "kanji": "純",
                "level": 34,
                "meaning": "Pure"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "級",
                "level": 11,
                "meaning": "Level"
            }
        ]
    },
    "綱": {
        "level": 42,
        "meaning": "Cable",
        "similar": [
            {
                "kanji": "網",
                "level": 42,
                "meaning": "Netting"
            }
        ]
    },
    "網": {
        "level": 42,
        "meaning": "Netting",
        "similar": [
            {
                "kanji": "綱",
                "level": 42,
                "meaning": "Cable"
            }
        ]
    },
    "床": {
        "level": 42,
        "meaning": "Floor",
        "similar": [
            {
                "kanji": "交",
                "level": 5,
                "meaning": "Mix"
            },
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "衣",
                "level": 41,
                "meaning": "Clothes"
            },
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "米",
                "level": 5,
                "meaning": "Rice"
            },
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            },
            {
                "kanji": "朱",
                "level": 44,
                "meaning": "Vermillion"
            },
            {
                "kanji": "珠",
                "level": 49,
                "meaning": "Pearl"
            }
        ]
    },
    "滑": {
        "level": 42,
        "meaning": "Slippery",
        "similar": [
            {
                "kanji": "骨",
                "level": 14,
                "meaning": "Bone"
            },
            {
                "kanji": "消",
                "level": 12,
                "meaning": "Extinguish"
            }
        ]
    },
    "軸": {
        "level": 42,
        "meaning": "Axis",
        "similar": []
    },
    "弧": {
        "level": 42,
        "meaning": "Arc",
        "similar": []
    },
    "潟": {
        "level": 42,
        "meaning": "Lagoon",
        "similar": []
    },
    "炉": {
        "level": 43,
        "meaning": "Furnace",
        "similar": []
    },
    "慰": {
        "level": 43,
        "meaning": "Consolation",
        "similar": [
            {
                "kanji": "尉",
                "level": 56,
                "meaning": "Military"
            }
        ]
    },
    "懇": {
        "level": 43,
        "meaning": "Courteous",
        "similar": []
    },
    "懲": {
        "level": 43,
        "meaning": "Chastise",
        "similar": [
            {
                "kanji": "徴",
                "level": 26,
                "meaning": "Indication"
            }
        ]
    },
    "刷": {
        "level": 43,
        "meaning": "Printing",
        "similar": []
    },
    "牧": {
        "level": 43,
        "meaning": "Pasture",
        "similar": [
            {
                "kanji": "物",
                "level": 9,
                "meaning": "Thing"
            },
            {
                "kanji": "秩",
                "level": 52,
                "meaning": "Order"
            }
        ]
    },
    "即": {
        "level": 43,
        "meaning": "Instant",
        "similar": []
    },
    "珍": {
        "level": 43,
        "meaning": "Rare",
        "similar": []
    },
    "琴": {
        "level": 43,
        "meaning": "Harp",
        "similar": []
    },
    "摩": {
        "level": 43,
        "meaning": "Chafe",
        "similar": [
            {
                "kanji": "磨",
                "level": 45,
                "meaning": "Polish"
            },
            {
                "kanji": "麻",
                "level": 48,
                "meaning": "Hemp"
            }
        ]
    },
    "撲": {
        "level": 43,
        "meaning": "Slap",
        "similar": [
            {
                "kanji": "僕",
                "level": 12,
                "meaning": "I"
            },
            {
                "kanji": "業",
                "level": 10,
                "meaning": "Business"
            }
        ]
    },
    "擦": {
        "level": 43,
        "meaning": "Grate",
        "similar": [
            {
                "kanji": "察",
                "level": 17,
                "meaning": "Guess"
            }
        ]
    },
    "斉": {
        "level": 43,
        "meaning": "Simultaneous",
        "similar": [
            {
                "kanji": "済",
                "level": 21,
                "meaning": "Come"
            },
            {
                "kanji": "剤",
                "level": 40,
                "meaning": "Dose"
            }
        ]
    },
    "旨": {
        "level": 43,
        "meaning": "Point",
        "similar": [
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "旬",
                "level": 37,
                "meaning": "In"
            },
            {
                "kanji": "伯",
                "level": 50,
                "meaning": "Chief"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            }
        ]
    },
    "朗": {
        "level": 43,
        "meaning": "Bright",
        "similar": []
    },
    "露": {
        "level": 43,
        "meaning": "Expose",
        "similar": []
    },
    "垣": {
        "level": 43,
        "meaning": "Hedge",
        "similar": [
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "埋",
                "level": 39,
                "meaning": "Bury"
            }
        ]
    },
    "柔": {
        "level": 43,
        "meaning": "Gentle",
        "similar": []
    },
    "裂": {
        "level": 43,
        "meaning": "Split",
        "similar": []
    },
    "襲": {
        "level": 43,
        "meaning": "Attack",
        "similar": []
    },
    "威": {
        "level": 43,
        "meaning": "Majesty",
        "similar": []
    },
    "誰": {
        "level": 43,
        "meaning": "Who",
        "similar": []
    },
    "筒": {
        "level": 43,
        "meaning": "Cylinder",
        "similar": [
            {
                "kanji": "答",
                "level": 8,
                "meaning": "Answer"
            }
        ]
    },
    "封": {
        "level": 43,
        "meaning": "Seal",
        "similar": []
    },
    "籍": {
        "level": 43,
        "meaning": "Enroll",
        "similar": []
    },
    "沈": {
        "level": 43,
        "meaning": "Sink",
        "similar": []
    },
    "貢": {
        "level": 43,
        "meaning": "Tribute",
        "similar": [
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            },
            {
                "kanji": "貫",
                "level": 52,
                "meaning": "Pierce"
            },
            {
                "kanji": "現",
                "level": 23,
                "meaning": "Present"
            },
            {
                "kanji": "貞",
                "level": 51,
                "meaning": "Chastity"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            }
        ]
    },
    "岳": {
        "level": 43,
        "meaning": "Peak",
        "similar": [
            {
                "kanji": "缶",
                "level": 44,
                "meaning": "Can"
            }
        ]
    },
    "沼": {
        "level": 43,
        "meaning": "Bog",
        "similar": [
            {
                "kanji": "沿",
                "level": 34,
                "meaning": "Run"
            },
            {
                "kanji": "治",
                "level": 16,
                "meaning": "Cure"
            },
            {
                "kanji": "招",
                "level": 27,
                "meaning": "Beckon"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            }
        ]
    },
    "泰": {
        "level": 43,
        "meaning": "Peace",
        "similar": [
            {
                "kanji": "奏",
                "level": 38,
                "meaning": "Play"
            }
        ]
    },
    "趣": {
        "level": 43,
        "meaning": "Gist",
        "similar": []
    },
    "距": {
        "level": 43,
        "meaning": "Distance",
        "similar": []
    },
    "滅": {
        "level": 43,
        "meaning": "Destroy",
        "similar": [
            {
                "kanji": "減",
                "level": 19,
                "meaning": "Decrease"
            }
        ]
    },
    "滋": {
        "level": 43,
        "meaning": "Nourishing",
        "similar": []
    },
    "潮": {
        "level": 43,
        "meaning": "Tide",
        "similar": [
            {
                "kanji": "朝",
                "level": 8,
                "meaning": "Morning"
            },
            {
                "kanji": "漸",
                "level": 60,
                "meaning": "Gradually"
            }
        ]
    },
    "釣": {
        "level": 44,
        "meaning": "Fishing",
        "similar": [
            {
                "kanji": "鉱",
                "level": 41,
                "meaning": "Mineral"
            },
            {
                "kanji": "鈴",
                "level": 39,
                "meaning": "Buzzer"
            },
            {
                "kanji": "鈍",
                "level": 46,
                "meaning": "Dull"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            },
            {
                "kanji": "銘",
                "level": 50,
                "meaning": "Inscription"
            },
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "鉢",
                "level": 48,
                "meaning": "Bowl"
            }
        ]
    },
    "刃": {
        "level": 44,
        "meaning": "Blade",
        "similar": []
    },
    "芽": {
        "level": 44,
        "meaning": "Sprout",
        "similar": [
            {
                "kanji": "芋",
                "level": 34,
                "meaning": "Potato"
            },
            {
                "kanji": "芳",
                "level": 52,
                "meaning": "Perfume"
            }
        ]
    },
    "匹": {
        "level": 44,
        "meaning": "Small Animal",
        "similar": [
            {
                "kanji": "区",
                "level": 15,
                "meaning": "District"
            }
        ]
    },
    "叫": {
        "level": 44,
        "meaning": "Shout",
        "similar": [
            {
                "kanji": "呈",
                "level": 54,
                "meaning": "Present"
            }
        ]
    },
    "叱": {
        "level": 44,
        "meaning": "Scold",
        "similar": []
    },
    "吉": {
        "level": 44,
        "meaning": "Good Luck",
        "similar": [
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "古",
                "level": 3,
                "meaning": "Old"
            },
            {
                "kanji": "若",
                "level": 19,
                "meaning": "Young"
            },
            {
                "kanji": "苦",
                "level": 9,
                "meaning": "Suffering"
            },
            {
                "kanji": "周",
                "level": 14,
                "meaning": "Circumference"
            },
            {
                "kanji": "舎",
                "level": 35,
                "meaning": "Cottage"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            }
        ]
    },
    "斗": {
        "level": 44,
        "meaning": "Ladle",
        "similar": [
            {
                "kanji": "汁",
                "level": 35,
                "meaning": "Soup"
            }
        ]
    },
    "雷": {
        "level": 44,
        "meaning": "Thunder",
        "similar": [
            {
                "kanji": "電",
                "level": 8,
                "meaning": "Electricity"
            },
            {
                "kanji": "霜",
                "level": 48,
                "meaning": "Frost"
            }
        ]
    },
    "朱": {
        "level": 44,
        "meaning": "Vermillion",
        "similar": [
            {
                "kanji": "矢",
                "level": 3,
                "meaning": "Arrow"
            },
            {
                "kanji": "休",
                "level": 4,
                "meaning": "Rest"
            },
            {
                "kanji": "失",
                "level": 7,
                "meaning": "Fault"
            },
            {
                "kanji": "未",
                "level": 7,
                "meaning": "Not"
            },
            {
                "kanji": "末",
                "level": 7,
                "meaning": "End"
            },
            {
                "kanji": "妹",
                "level": 6,
                "meaning": "Younger"
            },
            {
                "kanji": "体",
                "level": 5,
                "meaning": "Body"
            },
            {
                "kanji": "条",
                "level": 21,
                "meaning": "Clause"
            }
        ]
    },
    "砲": {
        "level": 44,
        "meaning": "Cannon",
        "similar": [
            {
                "kanji": "砕",
                "level": 47,
                "meaning": "Smash"
            }
        ]
    },
    "桃": {
        "level": 44,
        "meaning": "Peach",
        "similar": [
            {
                "kanji": "挑",
                "level": 42,
                "meaning": "Challenge"
            }
        ]
    },
    "塔": {
        "level": 44,
        "meaning": "Tower",
        "similar": [
            {
                "kanji": "搭",
                "level": 53,
                "meaning": "Board"
            }
        ]
    },
    "梨": {
        "level": 44,
        "meaning": "Pear",
        "similar": []
    },
    "棚": {
        "level": 44,
        "meaning": "Shelf",
        "similar": []
    },
    "姫": {
        "level": 44,
        "meaning": "Princess",
        "similar": [
            {
                "kanji": "臣",
                "level": 29,
                "meaning": "Servant"
            }
        ]
    },
    "娯": {
        "level": 44,
        "meaning": "Recreation",
        "similar": [
            {
                "kanji": "呉",
                "level": 56,
                "meaning": "Give"
            }
        ]
    },
    "竜": {
        "level": 44,
        "meaning": "Dragon",
        "similar": [
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            },
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "滝",
                "level": 45,
                "meaning": "Waterfall"
            },
            {
                "kanji": "童",
                "level": 12,
                "meaning": "Juvenile"
            },
            {
                "kanji": "境",
                "level": 24,
                "meaning": "Boundary"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            },
            {
                "kanji": "宣",
                "level": 33,
                "meaning": "Proclaim"
            },
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            }
        ]
    },
    "髪": {
        "level": 44,
        "meaning": "Hair",
        "similar": []
    },
    "謎": {
        "level": 44,
        "meaning": "Riddle",
        "similar": []
    },
    "笠": {
        "level": 44,
        "meaning": "Conical Hat",
        "similar": []
    },
    "寸": {
        "level": 44,
        "meaning": "Measurement",
        "similar": []
    },
    "粒": {
        "level": 44,
        "meaning": "Grains",
        "similar": [
            {
                "kanji": "粧",
                "level": 47,
                "meaning": "Cosmetics"
            },
            {
                "kanji": "粗",
                "level": 55,
                "meaning": "Coarse"
            }
        ]
    },
    "嵐": {
        "level": 44,
        "meaning": "Storm",
        "similar": []
    },
    "涙": {
        "level": 44,
        "meaning": "Teardrop",
        "similar": [
            {
                "kanji": "泥",
                "level": 31,
                "meaning": "Mud"
            },
            {
                "kanji": "沢",
                "level": 23,
                "meaning": "Swamp"
            },
            {
                "kanji": "戻",
                "level": 37,
                "meaning": "Return"
            },
            {
                "kanji": "決",
                "level": 8,
                "meaning": "Decide"
            }
        ]
    },
    "縁": {
        "level": 44,
        "meaning": "Edge",
        "similar": [
            {
                "kanji": "緑",
                "level": 13,
                "meaning": "Green"
            }
        ]
    },
    "丘": {
        "level": 44,
        "meaning": "Hill",
        "similar": []
    },
    "缶": {
        "level": 44,
        "meaning": "Can",
        "similar": [
            {
                "kanji": "年",
                "level": 4,
                "meaning": "Year"
            },
            {
                "kanji": "岳",
                "level": 43,
                "meaning": "Peak"
            }
        ]
    },
    "侍": {
        "level": 44,
        "meaning": "Samurai",
        "similar": [
            {
                "kanji": "待",
                "level": 12,
                "meaning": "Wait"
            },
            {
                "kanji": "特",
                "level": 11,
                "meaning": "Special"
            },
            {
                "kanji": "寺",
                "level": 15,
                "meaning": "Temple"
            },
            {
                "kanji": "佳",
                "level": 55,
                "meaning": "Excellent"
            },
            {
                "kanji": "供",
                "level": 24,
                "meaning": "Servant"
            }
        ]
    },
    "辛": {
        "level": 44,
        "meaning": "Spicy",
        "similar": [
            {
                "kanji": "幸",
                "level": 16,
                "meaning": "Happiness"
            },
            {
                "kanji": "立",
                "level": 2,
                "meaning": "Stand"
            },
            {
                "kanji": "伴",
                "level": 38,
                "meaning": "Accompany"
            },
            {
                "kanji": "平",
                "level": 4,
                "meaning": "Flat"
            },
            {
                "kanji": "半",
                "level": 3,
                "meaning": "Half"
            },
            {
                "kanji": "宰",
                "level": 56,
                "meaning": "Manager"
            }
        ]
    },
    "忍": {
        "level": 44,
        "meaning": "Endure",
        "similar": []
    },
    "俺": {
        "level": 44,
        "meaning": "I",
        "similar": []
    },
    "翼": {
        "level": 44,
        "meaning": "Wing",
        "similar": []
    },
    "肌": {
        "level": 45,
        "meaning": "Skin",
        "similar": []
    },
    "脚": {
        "level": 45,
        "meaning": "Leg",
        "similar": []
    },
    "凶": {
        "level": 45,
        "meaning": "Villain",
        "similar": []
    },
    "舟": {
        "level": 45,
        "meaning": "Boat",
        "similar": []
    },
    "狂": {
        "level": 45,
        "meaning": "Lunatic",
        "similar": [
            {
                "kanji": "姓",
                "level": 36,
                "meaning": "Surname"
            },
            {
                "kanji": "全",
                "level": 6,
                "meaning": "All"
            },
            {
                "kanji": "住",
                "level": 8,
                "meaning": "Dwelling"
            },
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            },
            {
                "kanji": "生",
                "level": 3,
                "meaning": "Life"
            }
        ]
    },
    "狩": {
        "level": 45,
        "meaning": "Hunt",
        "similar": []
    },
    "卓": {
        "level": 45,
        "meaning": "Table",
        "similar": [
            {
                "kanji": "草",
                "level": 5,
                "meaning": "Grass"
            },
            {
                "kanji": "早",
                "level": 4,
                "meaning": "Early"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "悼",
                "level": 55,
                "meaning": "Grieve"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            }
        ]
    },
    "菌": {
        "level": 45,
        "meaning": "Bacteria",
        "similar": []
    },
    "鐘": {
        "level": 45,
        "meaning": "Bell",
        "similar": [
            {
                "kanji": "鏡",
                "level": 13,
                "meaning": "Mirror"
            },
            {
                "kanji": "鎖",
                "level": 52,
                "meaning": "Chain"
            },
            {
                "kanji": "錯",
                "level": 56,
                "meaning": "Confused"
            }
        ]
    },
    "呪": {
        "level": 45,
        "meaning": "Curse",
        "similar": []
    },
    "疲": {
        "level": 45,
        "meaning": "Exhausted",
        "similar": [
            {
                "kanji": "疫",
                "level": 50,
                "meaning": "Epidemic"
            },
            {
                "kanji": "波",
                "level": 11,
                "meaning": "Wave"
            },
            {
                "kanji": "披",
                "level": 53,
                "meaning": "Expose"
            },
            {
                "kanji": "疾",
                "level": 54,
                "meaning": "Rapidly"
            }
        ]
    },
    "陰": {
        "level": 45,
        "meaning": "Shade",
        "similar": [
            {
                "kanji": "除",
                "level": 31,
                "meaning": "Exclude"
            }
        ]
    },
    "暦": {
        "level": 45,
        "meaning": "Calendar",
        "similar": [
            {
                "kanji": "替",
                "level": 25,
                "meaning": "Replace"
            },
            {
                "kanji": "歴",
                "level": 19,
                "meaning": "Continuation"
            }
        ]
    },
    "曇": {
        "level": 45,
        "meaning": "Cloudy",
        "similar": [
            {
                "kanji": "雲",
                "level": 8,
                "meaning": "Cloud"
            }
        ]
    },
    "霊": {
        "level": 45,
        "meaning": "Ghost",
        "similar": [
            {
                "kanji": "雲",
                "level": 8,
                "meaning": "Cloud"
            }
        ]
    },
    "眺": {
        "level": 45,
        "meaning": "Stare",
        "similar": [
            {
                "kanji": "財",
                "level": 19,
                "meaning": "Wealth"
            },
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            },
            {
                "kanji": "賊",
                "level": 57,
                "meaning": "Robber"
            }
        ]
    },
    "矛": {
        "level": 45,
        "meaning": "Spear",
        "similar": []
    },
    "頃": {
        "level": 45,
        "meaning": "Approximate",
        "similar": []
    },
    "塊": {
        "level": 45,
        "meaning": "Lump",
        "similar": [
            {
                "kanji": "魂",
                "level": 45,
                "meaning": "Soul"
            },
            {
                "kanji": "鬼",
                "level": 23,
                "meaning": "Demon"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            }
        ]
    },
    "硬": {
        "level": 45,
        "meaning": "Stiff",
        "similar": [
            {
                "kanji": "便",
                "level": 11,
                "meaning": "Convenience"
            },
            {
                "kanji": "碑",
                "level": 56,
                "meaning": "Tombstone"
            }
        ]
    },
    "塾": {
        "level": 45,
        "meaning": "Cram School",
        "similar": [
            {
                "kanji": "熟",
                "level": 33,
                "meaning": "Ripen"
            }
        ]
    },
    "磨": {
        "level": 45,
        "meaning": "Polish",
        "similar": [
            {
                "kanji": "摩",
                "level": 43,
                "meaning": "Chafe"
            }
        ]
    },
    "裸": {
        "level": 45,
        "meaning": "Naked",
        "similar": [
            {
                "kanji": "巣",
                "level": 31,
                "meaning": "Nest"
            },
            {
                "kanji": "視",
                "level": 24,
                "meaning": "Look"
            },
            {
                "kanji": "神",
                "level": 11,
                "meaning": "God"
            }
        ]
    },
    "稼": {
        "level": 45,
        "meaning": "Earnings",
        "similar": [
            {
                "kanji": "嫁",
                "level": 45,
                "meaning": "Bride"
            },
            {
                "kanji": "豪",
                "level": 31,
                "meaning": "Luxurious"
            }
        ]
    },
    "嫁": {
        "level": 45,
        "meaning": "Bride",
        "similar": [
            {
                "kanji": "家",
                "level": 7,
                "meaning": "House"
            },
            {
                "kanji": "塚",
                "level": 51,
                "meaning": "Mound"
            },
            {
                "kanji": "稼",
                "level": 45,
                "meaning": "Earnings"
            }
        ]
    },
    "嬢": {
        "level": 45,
        "meaning": "Miss",
        "similar": [
            {
                "kanji": "壌",
                "level": 53,
                "meaning": "Soil"
            },
            {
                "kanji": "醸",
                "level": 57,
                "meaning": "Brew"
            }
        ]
    },
    "魂": {
        "level": 45,
        "meaning": "Soul",
        "similar": [
            {
                "kanji": "塊",
                "level": 45,
                "meaning": "Lump"
            },
            {
                "kanji": "鬼",
                "level": 23,
                "meaning": "Demon"
            }
        ]
    },
    "賭": {
        "level": 45,
        "meaning": "Gamble",
        "similar": []
    },
    "也": {
        "level": 45,
        "meaning": "Considerably",
        "similar": []
    },
    "湿": {
        "level": 45,
        "meaning": "Damp",
        "similar": [
            {
                "kanji": "温",
                "level": 12,
                "meaning": "Warm"
            }
        ]
    },
    "井": {
        "level": 45,
        "meaning": "Well",
        "similar": [
            {
                "kanji": "元",
                "level": 3,
                "meaning": "Origin"
            },
            {
                "kanji": "夫",
                "level": 15,
                "meaning": "Husband"
            },
            {
                "kanji": "干",
                "level": 17,
                "meaning": "Dry"
            },
            {
                "kanji": "天",
                "level": 2,
                "meaning": "Heaven"
            }
        ]
    },
    "溝": {
        "level": 45,
        "meaning": "Gutter",
        "similar": [
            {
                "kanji": "満",
                "level": 25,
                "meaning": "Full"
            },
            {
                "kanji": "構",
                "level": 25,
                "meaning": "Set"
            },
            {
                "kanji": "清",
                "level": 28,
                "meaning": "Pure"
            }
        ]
    },
    "滝": {
        "level": 45,
        "meaning": "Waterfall",
        "similar": [
            {
                "kanji": "竜",
                "level": 44,
                "meaning": "Dragon"
            },
            {
                "kanji": "境",
                "level": 24,
                "meaning": "Boundary"
            },
            {
                "kanji": "音",
                "level": 5,
                "meaning": "Sound"
            },
            {
                "kanji": "普",
                "level": 31,
                "meaning": "Normal"
            }
        ]
    },
    "澄": {
        "level": 45,
        "meaning": "Lucidity",
        "similar": [
            {
                "kanji": "登",
                "level": 12,
                "meaning": "Climb"
            }
        ]
    },
    "翔": {
        "level": 45,
        "meaning": "Fly",
        "similar": []
    },
    "鈍": {
        "level": 46,
        "meaning": "Dull",
        "similar": [
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            },
            {
                "kanji": "銘",
                "level": 50,
                "meaning": "Inscription"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "鈴",
                "level": 39,
                "meaning": "Buzzer"
            }
        ]
    },
    "錬": {
        "level": 46,
        "meaning": "Tempering",
        "similar": [
            {
                "kanji": "鎮",
                "level": 55,
                "meaning": "Tranquilize"
            },
            {
                "kanji": "銀",
                "level": 13,
                "meaning": "Silver"
            },
            {
                "kanji": "鎖",
                "level": 52,
                "meaning": "Chain"
            }
        ]
    },
    "猿": {
        "level": 46,
        "meaning": "Monkey",
        "similar": [
            {
                "kanji": "哀",
                "level": 47,
                "meaning": "Pathetic"
            }
        ]
    },
    "鍛": {
        "level": 46,
        "meaning": "Forge",
        "similar": []
    },
    "鍵": {
        "level": 46,
        "meaning": "Key",
        "similar": []
    },
    "菊": {
        "level": 46,
        "meaning": "Chrysanthemum",
        "similar": [
            {
                "kanji": "菜",
                "level": 31,
                "meaning": "Vegetable"
            },
            {
                "kanji": "茶",
                "level": 6,
                "meaning": "Tea"
            }
        ]
    },
    "吾": {
        "level": 46,
        "meaning": "I",
        "similar": []
    },
    "斬": {
        "level": 46,
        "meaning": "Slice",
        "similar": []
    },
    "阻": {
        "level": 46,
        "meaning": "Thwart",
        "similar": []
    },
    "癖": {
        "level": 46,
        "meaning": "Habit",
        "similar": []
    },
    "盆": {
        "level": 46,
        "meaning": "Lantern Festival",
        "similar": [
            {
                "kanji": "盛",
                "level": 33,
                "meaning": "Pile"
            }
        ]
    },
    "零": {
        "level": 46,
        "meaning": "Zero",
        "similar": [
            {
                "kanji": "雰",
                "level": 14,
                "meaning": "Atmosphere"
            }
        ]
    },
    "瞬": {
        "level": 46,
        "meaning": "Blink",
        "similar": []
    },
    "瞳": {
        "level": 46,
        "meaning": "Pupil",
        "similar": []
    },
    "架": {
        "level": 46,
        "meaning": "Shelf",
        "similar": [
            {
                "kanji": "保",
                "level": 9,
                "meaning": "Preserve"
            }
        ]
    },
    "碁": {
        "level": 46,
        "meaning": "Go",
        "similar": [
            {
                "kanji": "基",
                "level": 14,
                "meaning": "Foundation"
            }
        ]
    },
    "墨": {
        "level": 46,
        "meaning": "Black Ink",
        "similar": [
            {
                "kanji": "黒",
                "level": 7,
                "meaning": "Black"
            }
        ]
    },
    "棟": {
        "level": 46,
        "meaning": "Pillar",
        "similar": [
            {
                "kanji": "模",
                "level": 25,
                "meaning": "Imitation"
            },
            {
                "kanji": "練",
                "level": 13,
                "meaning": "Practice"
            }
        ]
    },
    "椅": {
        "level": 46,
        "meaning": "Chair",
        "similar": []
    },
    "租": {
        "level": 46,
        "meaning": "Tariff",
        "similar": [
            {
                "kanji": "粗",
                "level": 55,
                "meaning": "Coarse"
            },
            {
                "kanji": "査",
                "level": 21,
                "meaning": "Inspect"
            }
        ]
    },
    "穂": {
        "level": 46,
        "meaning": "Head of Plant",
        "similar": [
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            },
            {
                "kanji": "想",
                "level": 13,
                "meaning": "Concept"
            }
        ]
    },
    "穏": {
        "level": 46,
        "meaning": "Calm",
        "similar": []
    },
    "誇": {
        "level": 46,
        "meaning": "Pride",
        "similar": [
            {
                "kanji": "詳",
                "level": 17,
                "meaning": "Detailed"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            },
            {
                "kanji": "詩",
                "level": 13,
                "meaning": "Poem"
            },
            {
                "kanji": "訟",
                "level": 25,
                "meaning": "Lawsuit"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "診",
                "level": 29,
                "meaning": "Diagnose"
            },
            {
                "kanji": "証",
                "level": 16,
                "meaning": "Evidence"
            }
        ]
    },
    "魔": {
        "level": 46,
        "meaning": "Devil",
        "similar": []
    },
    "孔": {
        "level": 46,
        "meaning": "Cavity",
        "similar": []
    },
    "歳": {
        "level": 46,
        "meaning": "Years Old",
        "similar": []
    },
    "寧": {
        "level": 46,
        "meaning": "Rather",
        "similar": []
    },
    "寮": {
        "level": 46,
        "meaning": "Dormitory",
        "similar": [
            {
                "kanji": "療",
                "level": 36,
                "meaning": "Heal"
            },
            {
                "kanji": "僚",
                "level": 29,
                "meaning": "Colleague"
            },
            {
                "kanji": "賓",
                "level": 55,
                "meaning": "VIP"
            },
            {
                "kanji": "源",
                "level": 34,
                "meaning": "Origin"
            }
        ]
    },
    "泡": {
        "level": 46,
        "meaning": "Bubbles",
        "similar": [
            {
                "kanji": "抱",
                "level": 37,
                "meaning": "Hug"
            }
        ]
    },
    "鳩": {
        "level": 46,
        "meaning": "Dove",
        "similar": []
    },
    "涼": {
        "level": 46,
        "meaning": "Cool",
        "similar": [
            {
                "kanji": "減",
                "level": 19,
                "meaning": "Decrease"
            },
            {
                "kanji": "河",
                "level": 26,
                "meaning": "River"
            },
            {
                "kanji": "京",
                "level": 6,
                "meaning": "Capital"
            }
        ]
    },
    "綿": {
        "level": 46,
        "meaning": "Cotton",
        "similar": [
            {
                "kanji": "練",
                "level": 13,
                "meaning": "Practice"
            },
            {
                "kanji": "紳",
                "level": 56,
                "meaning": "Gentleman"
            },
            {
                "kanji": "線",
                "level": 10,
                "meaning": "Line"
            }
        ]
    },
    "帝": {
        "level": 46,
        "meaning": "Sovereign",
        "similar": []
    },
    "幽": {
        "level": 46,
        "meaning": "Secluded",
        "similar": []
    },
    "庄": {
        "level": 46,
        "meaning": "Manor",
        "similar": []
    },
    "黙": {
        "level": 46,
        "meaning": "Shut Up",
        "similar": [
            {
                "kanji": "黒",
                "level": 7,
                "meaning": "Black"
            }
        ]
    },
    "俵": {
        "level": 46,
        "meaning": "Sack",
        "similar": [
            {
                "kanji": "依",
                "level": 36,
                "meaning": "Reliant"
            },
            {
                "kanji": "表",
                "level": 9,
                "meaning": "Express"
            },
            {
                "kanji": "袋",
                "level": 42,
                "meaning": "Sack"
            }
        ]
    },
    "恨": {
        "level": 47,
        "meaning": "Grudge",
        "similar": [
            {
                "kanji": "浪",
                "level": 59,
                "meaning": "Wander"
            },
            {
                "kanji": "限",
                "level": 25,
                "meaning": "Limit"
            }
        ]
    },
    "炊": {
        "level": 47,
        "meaning": "Cook",
        "similar": [
            {
                "kanji": "炎",
                "level": 35,
                "meaning": "Flame"
            }
        ]
    },
    "胴": {
        "level": 47,
        "meaning": "Torso",
        "similar": [
            {
                "kanji": "胎",
                "level": 57,
                "meaning": "Womb"
            }
        ]
    },
    "憎": {
        "level": 47,
        "meaning": "Hate",
        "similar": [
            {
                "kanji": "僧",
                "level": 18,
                "meaning": "Priest"
            },
            {
                "kanji": "層",
                "level": 24,
                "meaning": "Layer"
            },
            {
                "kanji": "増",
                "level": 21,
                "meaning": "Increase"
            }
        ]
    },
    "憩": {
        "level": 47,
        "meaning": "Rest",
        "similar": []
    },
    "爽": {
        "level": 47,
        "meaning": "Refreshing",
        "similar": []
    },
    "扇": {
        "level": 47,
        "meaning": "Folding Fan",
        "similar": []
    },
    "扉": {
        "level": 47,
        "meaning": "Front Door",
        "similar": [
            {
                "kanji": "排",
                "level": 40,
                "meaning": "Reject"
            }
        ]
    },
    "芯": {
        "level": 47,
        "meaning": "Wick",
        "similar": []
    },
    "挿": {
        "level": 47,
        "meaning": "Insert",
        "similar": [
            {
                "kanji": "押",
                "level": 30,
                "meaning": "Push"
            },
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "指",
                "level": 11,
                "meaning": "Finger"
            },
            {
                "kanji": "揮",
                "level": 34,
                "meaning": "Brandish"
            },
            {
                "kanji": "担",
                "level": 24,
                "meaning": "Carry"
            },
            {
                "kanji": "捕",
                "level": 25,
                "meaning": "Catch"
            }
        ]
    },
    "掌": {
        "level": 47,
        "meaning": "Manipulate",
        "similar": [
            {
                "kanji": "堂",
                "level": 17,
                "meaning": "Hall"
            },
            {
                "kanji": "党",
                "level": 32,
                "meaning": "Group"
            }
        ]
    },
    "哀": {
        "level": 47,
        "meaning": "Pathetic",
        "similar": [
            {
                "kanji": "衰",
                "level": 49,
                "meaning": "Decline"
            },
            {
                "kanji": "猿",
                "level": 46,
                "meaning": "Monkey"
            }
        ]
    },
    "唇": {
        "level": 47,
        "meaning": "Lips",
        "similar": [
            {
                "kanji": "知",
                "level": 6,
                "meaning": "Know"
            },
            {
                "kanji": "辱",
                "level": 48,
                "meaning": "Humiliate"
            }
        ]
    },
    "畳": {
        "level": 47,
        "meaning": "Tatami Mat",
        "similar": []
    },
    "虹": {
        "level": 47,
        "meaning": "Rainbow",
        "similar": []
    },
    "霧": {
        "level": 47,
        "meaning": "Fog",
        "similar": []
    },
    "瞭": {
        "level": 47,
        "meaning": "Clear",
        "similar": []
    },
    "柳": {
        "level": 47,
        "meaning": "Willow",
        "similar": [
            {
                "kanji": "析",
                "level": 42,
                "meaning": "Analysis"
            }
        ]
    },
    "砕": {
        "level": 47,
        "meaning": "Smash",
        "similar": [
            {
                "kanji": "砲",
                "level": 44,
                "meaning": "Cannon"
            }
        ]
    },
    "塀": {
        "level": 47,
        "meaning": "Fence",
        "similar": []
    },
    "墜": {
        "level": 47,
        "meaning": "Crash",
        "similar": [
            {
                "kanji": "隊",
                "level": 28,
                "meaning": "Squad"
            }
        ]
    },
    "如": {
        "level": 47,
        "meaning": "Likeness",
        "similar": [
            {
                "kanji": "始",
                "level": 10,
                "meaning": "Begin"
            }
        ]
    },
    "婆": {
        "level": 47,
        "meaning": "Old Woman",
        "similar": [
            {
                "kanji": "波",
                "level": 11,
                "meaning": "Wave"
            }
        ]
    },
    "詐": {
        "level": 47,
        "meaning": "Lie",
        "similar": [
            {
                "kanji": "話",
                "level": 8,
                "meaning": "Talk"
            },
            {
                "kanji": "詞",
                "level": 19,
                "meaning": "Part"
            },
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            },
            {
                "kanji": "訴",
                "level": 25,
                "meaning": "Sue"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            }
        ]
    },
    "欺": {
        "level": 47,
        "meaning": "Deceit",
        "similar": [
            {
                "kanji": "期",
                "level": 12,
                "meaning": "Period"
            }
        ]
    },
    "箸": {
        "level": 47,
        "meaning": "Chopsticks",
        "similar": []
    },
    "尺": {
        "level": 47,
        "meaning": "Shaku",
        "similar": []
    },
    "粘": {
        "level": 47,
        "meaning": "Sticky",
        "similar": [
            {
                "kanji": "和",
                "level": 9,
                "meaning": "Peace"
            }
        ]
    },
    "粧": {
        "level": 47,
        "meaning": "Cosmetics",
        "similar": [
            {
                "kanji": "粒",
                "level": 44,
                "meaning": "Grains"
            }
        ]
    },
    "崖": {
        "level": 47,
        "meaning": "Cliff",
        "similar": []
    },
    "巾": {
        "level": 47,
        "meaning": "Towel",
        "similar": []
    },
    "帽": {
        "level": 47,
        "meaning": "Hat",
        "similar": [
            {
                "kanji": "冒",
                "level": 16,
                "meaning": "Dare"
            },
            {
                "kanji": "唱",
                "level": 40,
                "meaning": "Chant"
            }
        ]
    },
    "幣": {
        "level": 47,
        "meaning": "Cash",
        "similar": [
            {
                "kanji": "弊",
                "level": 56,
                "meaning": "Evil"
            }
        ]
    },
    "滴": {
        "level": 47,
        "meaning": "Drip",
        "similar": [
            {
                "kanji": "摘",
                "level": 36,
                "meaning": "Pluck"
            }
        ]
    },
    "伊": {
        "level": 47,
        "meaning": "Italy",
        "similar": []
    },
    "佐": {
        "level": 47,
        "meaning": "Help",
        "similar": [
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            },
            {
                "kanji": "佳",
                "level": 55,
                "meaning": "Excellent"
            },
            {
                "kanji": "仕",
                "level": 4,
                "meaning": "Doing"
            },
            {
                "kanji": "圧",
                "level": 20,
                "meaning": "Pressure"
            },
            {
                "kanji": "左",
                "level": 2,
                "meaning": "Left"
            }
        ]
    },
    "耐": {
        "level": 48,
        "meaning": "Resistant",
        "similar": []
    },
    "遂": {
        "level": 48,
        "meaning": "Accomplish",
        "similar": []
    },
    "灯": {
        "level": 48,
        "meaning": "Lamp",
        "similar": []
    },
    "悔": {
        "level": 48,
        "meaning": "Regret",
        "similar": [
            {
                "kanji": "海",
                "level": 6,
                "meaning": "Sea"
            },
            {
                "kanji": "侮",
                "level": 59,
                "meaning": "Despise"
            }
        ]
    },
    "脅": {
        "level": 48,
        "meaning": "Threaten",
        "similar": []
    },
    "脇": {
        "level": 48,
        "meaning": "Armpit",
        "similar": []
    },
    "憶": {
        "level": 48,
        "meaning": "Recollection",
        "similar": [
            {
                "kanji": "億",
                "level": 13,
                "meaning": "Hundred"
            },
            {
                "kanji": "意",
                "level": 11,
                "meaning": "Idea"
            }
        ]
    },
    "鉢": {
        "level": 48,
        "meaning": "Bowl",
        "similar": [
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "針",
                "level": 26,
                "meaning": "Needle"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            },
            {
                "kanji": "鉱",
                "level": 41,
                "meaning": "Mineral"
            }
        ]
    },
    "班": {
        "level": 48,
        "meaning": "Squad",
        "similar": [
            {
                "kanji": "理",
                "level": 7,
                "meaning": "Reason"
            }
        ]
    },
    "咲": {
        "level": 48,
        "meaning": "Blossom",
        "similar": []
    },
    "蓄": {
        "level": 48,
        "meaning": "Amass",
        "similar": [
            {
                "kanji": "畜",
                "level": 48,
                "meaning": "Livestock"
            }
        ]
    },
    "畜": {
        "level": 48,
        "meaning": "Livestock",
        "similar": [
            {
                "kanji": "蓄",
                "level": 48,
                "meaning": "Amass"
            }
        ]
    },
    "斜": {
        "level": 48,
        "meaning": "Diagonal",
        "similar": [
            {
                "kanji": "科",
                "level": 6,
                "meaning": "Course"
            }
        ]
    },
    "闇": {
        "level": 48,
        "meaning": "Darkness",
        "similar": []
    },
    "蚊": {
        "level": 48,
        "meaning": "Mosquito",
        "similar": [
            {
                "kanji": "蛇",
                "level": 48,
                "meaning": "Snake"
            }
        ]
    },
    "隙": {
        "level": 48,
        "meaning": "Crevice",
        "similar": []
    },
    "蛇": {
        "level": 48,
        "meaning": "Snake",
        "similar": [
            {
                "kanji": "蚊",
                "level": 48,
                "meaning": "Mosquito"
            }
        ]
    },
    "盾": {
        "level": 48,
        "meaning": "Shield",
        "similar": [
            {
                "kanji": "値",
                "level": 22,
                "meaning": "Value"
            },
            {
                "kanji": "首",
                "level": 6,
                "meaning": "Neck"
            },
            {
                "kanji": "看",
                "level": 23,
                "meaning": "Watch"
            },
            {
                "kanji": "循",
                "level": 55,
                "meaning": "Circulation"
            },
            {
                "kanji": "猫",
                "level": 15,
                "meaning": "Cat"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            }
        ]
    },
    "霜": {
        "level": 48,
        "meaning": "Frost",
        "similar": [
            {
                "kanji": "雷",
                "level": 44,
                "meaning": "Thunder"
            },
            {
                "kanji": "電",
                "level": 8,
                "meaning": "Electricity"
            }
        ]
    },
    "培": {
        "level": 48,
        "meaning": "Cultivate",
        "similar": [
            {
                "kanji": "若",
                "level": 19,
                "meaning": "Young"
            },
            {
                "kanji": "坪",
                "level": 57,
                "meaning": "Two"
            },
            {
                "kanji": "倍",
                "level": 12,
                "meaning": "Double"
            },
            {
                "kanji": "陪",
                "level": 58,
                "meaning": "Accompany"
            }
        ]
    },
    "塗": {
        "level": 48,
        "meaning": "Paint",
        "similar": []
    },
    "飢": {
        "level": 48,
        "meaning": "Starve",
        "similar": [
            {
                "kanji": "飲",
                "level": 10,
                "meaning": "Drink"
            },
            {
                "kanji": "飯",
                "level": 15,
                "meaning": "Meal"
            },
            {
                "kanji": "食",
                "level": 6,
                "meaning": "Eat"
            },
            {
                "kanji": "飽",
                "level": 56,
                "meaning": "Bored"
            },
            {
                "kanji": "飾",
                "level": 30,
                "meaning": "Decorate"
            }
        ]
    },
    "餓": {
        "level": 48,
        "meaning": "Starve",
        "similar": []
    },
    "騎": {
        "level": 48,
        "meaning": "Horse",
        "similar": [
            {
                "kanji": "験",
                "level": 9,
                "meaning": "Test"
            },
            {
                "kanji": "駆",
                "level": 40,
                "meaning": "Gallop"
            }
        ]
    },
    "穫": {
        "level": 48,
        "meaning": "Harvest",
        "similar": [
            {
                "kanji": "獲",
                "level": 40,
                "meaning": "Seize"
            },
            {
                "kanji": "護",
                "level": 23,
                "meaning": "Defend"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            }
        ]
    },
    "殴": {
        "level": 48,
        "meaning": "Assault",
        "similar": [
            {
                "kanji": "欧",
                "level": 29,
                "meaning": "Europe"
            }
        ]
    },
    "尽": {
        "level": 48,
        "meaning": "Exhaust",
        "similar": []
    },
    "貼": {
        "level": 48,
        "meaning": "Paste",
        "similar": []
    },
    "賢": {
        "level": 48,
        "meaning": "Clever",
        "similar": [
            {
                "kanji": "覧",
                "level": 30,
                "meaning": "Look"
            }
        ]
    },
    "踊": {
        "level": 48,
        "meaning": "Dance",
        "similar": []
    },
    "帳": {
        "level": 48,
        "meaning": "Notebook",
        "similar": [
            {
                "kanji": "長",
                "level": 6,
                "meaning": "Long"
            },
            {
                "kanji": "張",
                "level": 23,
                "meaning": "Stretch"
            }
        ]
    },
    "溶": {
        "level": 48,
        "meaning": "Melt",
        "similar": [
            {
                "kanji": "容",
                "level": 19,
                "meaning": "Form"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            },
            {
                "kanji": "裕",
                "level": 20,
                "meaning": "Abundant"
            }
        ]
    },
    "麻": {
        "level": 48,
        "meaning": "Hemp",
        "similar": [
            {
                "kanji": "摩",
                "level": 43,
                "meaning": "Chafe"
            }
        ]
    },
    "輝": {
        "level": 48,
        "meaning": "Radiance",
        "similar": []
    },
    "彩": {
        "level": 48,
        "meaning": "Coloring",
        "similar": []
    },
    "辱": {
        "level": 48,
        "meaning": "Humiliate",
        "similar": [
            {
                "kanji": "唇",
                "level": 47,
                "meaning": "Lips"
            },
            {
                "kanji": "寿",
                "level": 35,
                "meaning": "Lifespan"
            }
        ]
    },
    "迅": {
        "level": 48,
        "meaning": "Swift",
        "similar": [
            {
                "kanji": "近",
                "level": 5,
                "meaning": "Near"
            }
        ]
    },
    "悟": {
        "level": 49,
        "meaning": "Comprehension",
        "similar": [
            {
                "kanji": "害",
                "level": 20,
                "meaning": "Damage"
            }
        ]
    },
    "煮": {
        "level": 49,
        "meaning": "Boil",
        "similar": []
    },
    "刈": {
        "level": 49,
        "meaning": "Prune",
        "similar": []
    },
    "剛": {
        "level": 49,
        "meaning": "Sturdy",
        "similar": []
    },
    "劣": {
        "level": 49,
        "meaning": "Inferiority",
        "similar": []
    },
    "抽": {
        "level": 49,
        "meaning": "Pluck",
        "similar": [
            {
                "kanji": "拍",
                "level": 56,
                "meaning": "Beat"
            },
            {
                "kanji": "油",
                "level": 35,
                "meaning": "Oil"
            },
            {
                "kanji": "担",
                "level": 24,
                "meaning": "Carry"
            },
            {
                "kanji": "押",
                "level": 30,
                "meaning": "Push"
            },
            {
                "kanji": "苗",
                "level": 51,
                "meaning": "Seedling"
            },
            {
                "kanji": "描",
                "level": 38,
                "meaning": "Draw"
            }
        ]
    },
    "拓": {
        "level": 49,
        "meaning": "Cultivation",
        "similar": [
            {
                "kanji": "招",
                "level": 27,
                "meaning": "Beckon"
            },
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "拘",
                "level": 49,
                "meaning": "Arrest"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            }
        ]
    },
    "拘": {
        "level": 49,
        "meaning": "Arrest",
        "similar": [
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "拾",
                "level": 11,
                "meaning": "Pick"
            },
            {
                "kanji": "招",
                "level": 27,
                "meaning": "Beckon"
            },
            {
                "kanji": "拓",
                "level": 49,
                "meaning": "Cultivation"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            }
        ]
    },
    "勘": {
        "level": 49,
        "meaning": "Intuition",
        "similar": [
            {
                "kanji": "甚",
                "level": 59,
                "meaning": "Very"
            }
        ]
    },
    "珠": {
        "level": 49,
        "meaning": "Pearl",
        "similar": [
            {
                "kanji": "執",
                "level": 37,
                "meaning": "Tenacious"
            },
            {
                "kanji": "攻",
                "level": 28,
                "meaning": "Aggression"
            },
            {
                "kanji": "床",
                "level": 42,
                "meaning": "Floor"
            },
            {
                "kanji": "幸",
                "level": 16,
                "meaning": "Happiness"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "殊",
                "level": 52,
                "meaning": "Especially"
            }
        ]
    },
    "唯": {
        "level": 49,
        "meaning": "Solely",
        "similar": [
            {
                "kanji": "雇",
                "level": 39,
                "meaning": "Employ"
            },
            {
                "kanji": "確",
                "level": 20,
                "meaning": "Certain"
            },
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "准",
                "level": 53,
                "meaning": "Semi"
            },
            {
                "kanji": "稚",
                "level": 28,
                "meaning": "Immature"
            },
            {
                "kanji": "催",
                "level": 29,
                "meaning": "Sponsor"
            }
        ]
    },
    "陛": {
        "level": 49,
        "meaning": "Highness",
        "similar": [
            {
                "kanji": "陸",
                "level": 31,
                "meaning": "Land"
            }
        ]
    },
    "陶": {
        "level": 49,
        "meaning": "Pottery",
        "similar": []
    },
    "隔": {
        "level": 49,
        "meaning": "Isolate",
        "similar": []
    },
    "桑": {
        "level": 49,
        "meaning": "Mulberry",
        "similar": []
    },
    "衰": {
        "level": 49,
        "meaning": "Decline",
        "similar": [
            {
                "kanji": "哀",
                "level": 47,
                "meaning": "Pathetic"
            },
            {
                "kanji": "裏",
                "level": 33,
                "meaning": "Backside"
            }
        ]
    },
    "壇": {
        "level": 49,
        "meaning": "Podium",
        "similar": []
    },
    "礎": {
        "level": 49,
        "meaning": "Foundation",
        "similar": []
    },
    "奨": {
        "level": 49,
        "meaning": "Encourage",
        "similar": [
            {
                "kanji": "渓",
                "level": 60,
                "meaning": "Valley"
            },
            {
                "kanji": "将",
                "level": 36,
                "meaning": "Commander"
            }
        ]
    },
    "概": {
        "level": 49,
        "meaning": "Approximation",
        "similar": [
            {
                "kanji": "慨",
                "level": 58,
                "meaning": "Sigh"
            },
            {
                "kanji": "既",
                "level": 31,
                "meaning": "Previously"
            }
        ]
    },
    "妃": {
        "level": 49,
        "meaning": "Princess",
        "similar": []
    },
    "覆": {
        "level": 49,
        "meaning": "Capsize",
        "similar": []
    },
    "駒": {
        "level": 49,
        "meaning": "Chess Piece",
        "similar": []
    },
    "誓": {
        "level": 49,
        "meaning": "Vow",
        "similar": [
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            }
        ]
    },
    "謀": {
        "level": 49,
        "meaning": "Conspire",
        "similar": [
            {
                "kanji": "課",
                "level": 13,
                "meaning": "Section"
            }
        ]
    },
    "尼": {
        "level": 49,
        "meaning": "Nun",
        "similar": [
            {
                "kanji": "尾",
                "level": 20,
                "meaning": "Tail"
            }
        ]
    },
    "紫": {
        "level": 49,
        "meaning": "Purple",
        "similar": []
    },
    "浸": {
        "level": 49,
        "meaning": "Immersed",
        "similar": [
            {
                "kanji": "寝",
                "level": 22,
                "meaning": "Lie"
            },
            {
                "kanji": "侵",
                "level": 41,
                "meaning": "Invade"
            }
        ]
    },
    "鶴": {
        "level": 49,
        "meaning": "Crane",
        "similar": []
    },
    "淡": {
        "level": 49,
        "meaning": "Faint",
        "similar": []
    },
    "潤": {
        "level": 49,
        "meaning": "Watered",
        "similar": []
    },
    "征": {
        "level": 49,
        "meaning": "Subjugate",
        "similar": []
    },
    "俗": {
        "level": 49,
        "meaning": "Vulgar",
        "similar": [
            {
                "kanji": "谷",
                "level": 5,
                "meaning": "Valley"
            },
            {
                "kanji": "容",
                "level": 19,
                "meaning": "Form"
            },
            {
                "kanji": "格",
                "level": 14,
                "meaning": "Status"
            },
            {
                "kanji": "倍",
                "level": 12,
                "meaning": "Double"
            },
            {
                "kanji": "浴",
                "level": 16,
                "meaning": "Bathe"
            }
        ]
    },
    "偶": {
        "level": 50,
        "meaning": "Accidentally",
        "similar": [
            {
                "kanji": "隅",
                "level": 51,
                "meaning": "Corner"
            }
        ]
    },
    "邪": {
        "level": 50,
        "meaning": "Wicked",
        "similar": [
            {
                "kanji": "邦",
                "level": 39,
                "meaning": "Home"
            }
        ]
    },
    "把": {
        "level": 50,
        "meaning": "Bundle",
        "similar": []
    },
    "銘": {
        "level": 50,
        "meaning": "Inscription",
        "similar": [
            {
                "kanji": "鉛",
                "level": 26,
                "meaning": "Lead"
            },
            {
                "kanji": "銅",
                "level": 35,
                "meaning": "Copper"
            },
            {
                "kanji": "鈍",
                "level": 46,
                "meaning": "Dull"
            },
            {
                "kanji": "鈴",
                "level": 39,
                "meaning": "Buzzer"
            },
            {
                "kanji": "釣",
                "level": 44,
                "meaning": "Fishing"
            }
        ]
    },
    "后": {
        "level": 50,
        "meaning": "Empress",
        "similar": [
            {
                "kanji": "右",
                "level": 2,
                "meaning": "Right"
            },
            {
                "kanji": "合",
                "level": 12,
                "meaning": "Suit"
            },
            {
                "kanji": "谷",
                "level": 5,
                "meaning": "Valley"
            },
            {
                "kanji": "告",
                "level": 18,
                "meaning": "Announce"
            },
            {
                "kanji": "何",
                "level": 5,
                "meaning": "What"
            },
            {
                "kanji": "含",
                "level": 25,
                "meaning": "Include"
            },
            {
                "kanji": "伺",
                "level": 41,
                "meaning": "Pay"
            },
            {
                "kanji": "作",
                "level": 5,
                "meaning": "Make"
            }
        ]
    },
    "搬": {
        "level": 50,
        "meaning": "Transport",
        "similar": [
            {
                "kanji": "般",
                "level": 36,
                "meaning": "Generally"
            }
        ]
    },
    "唐": {
        "level": 50,
        "meaning": "China",
        "similar": []
    },
    "疫": {
        "level": 50,
        "meaning": "Epidemic",
        "similar": [
            {
                "kanji": "疲",
                "level": 45,
                "meaning": "Exhausted"
            },
            {
                "kanji": "疾",
                "level": 54,
                "meaning": "Rapidly"
            }
        ]
    },
    "晶": {
        "level": 50,
        "meaning": "Crystal",
        "similar": [
            {
                "kanji": "間",
                "level": 8,
                "meaning": "Interval"
            },
            {
                "kanji": "冒",
                "level": 16,
                "meaning": "Dare"
            },
            {
                "kanji": "唱",
                "level": 40,
                "meaning": "Chant"
            }
        ]
    },
    "蟹": {
        "level": 50,
        "meaning": "Crab",
        "similar": []
    },
    "堤": {
        "level": 50,
        "meaning": "Embankment",
        "similar": [
            {
                "kanji": "提",
                "level": 22,
                "meaning": "Present"
            },
            {
                "kanji": "是",
                "level": 17,
                "meaning": "Absolutely"
            },
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            }
        ]
    },
    "堰": {
        "level": 50,
        "meaning": "Dam",
        "similar": []
    },
    "墳": {
        "level": 50,
        "meaning": "Tomb",
        "similar": [
            {
                "kanji": "憤",
                "level": 58,
                "meaning": "Resent"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "噴",
                "level": 52,
                "meaning": "Erupt"
            },
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            }
        ]
    },
    "壮": {
        "level": 50,
        "meaning": "Robust",
        "similar": [
            {
                "kanji": "江",
                "level": 29,
                "meaning": "Inlet"
            }
        ]
    },
    "奮": {
        "level": 50,
        "meaning": "Stirred Up",
        "similar": []
    },
    "駄": {
        "level": 50,
        "meaning": "Burdensome",
        "similar": [
            {
                "kanji": "駆",
                "level": 40,
                "meaning": "Gallop"
            },
            {
                "kanji": "駅",
                "level": 13,
                "meaning": "Station"
            },
            {
                "kanji": "駐",
                "level": 40,
                "meaning": "Resident"
            },
            {
                "kanji": "馬",
                "level": 8,
                "meaning": "Horse"
            }
        ]
    },
    "訂": {
        "level": 50,
        "meaning": "Revise",
        "similar": [
            {
                "kanji": "討",
                "level": 26,
                "meaning": "Chastise"
            },
            {
                "kanji": "計",
                "level": 15,
                "meaning": "Measure"
            },
            {
                "kanji": "託",
                "level": 38,
                "meaning": "Consign"
            },
            {
                "kanji": "記",
                "level": 7,
                "meaning": "Write"
            },
            {
                "kanji": "言",
                "level": 5,
                "meaning": "Say"
            },
            {
                "kanji": "訪",
                "level": 27,
                "meaning": "Visit"
            },
            {
                "kanji": "許",
                "level": 18,
                "meaning": "Permit"
            },
            {
                "kanji": "訓",
                "level": 18,
                "meaning": "Instruction"
            }
        ]
    },
    "諮": {
        "level": 50,
        "meaning": "Consult",
        "similar": []
    },
    "鬱": {
        "level": 50,
        "meaning": "Gloom",
        "similar": []
    },
    "鰐": {
        "level": 50,
        "meaning": "Alligator",
        "similar": []
    },
    "簿": {
        "level": 50,
        "meaning": "Record Book",
        "similar": []
    },
    "峰": {
        "level": 50,
        "meaning": "Summit",
        "similar": [
            {
                "kanji": "降",
                "level": 34,
                "meaning": "Descend"
            }
        ]
    },
    "洞": {
        "level": 50,
        "meaning": "Cave",
        "similar": []
    },
    "涯": {
        "level": 50,
        "meaning": "Horizon",
        "similar": []
    },
    "淀": {
        "level": 50,
        "meaning": "Eddy",
        "similar": []
    },
    "巧": {
        "level": 50,
        "meaning": "Adept",
        "similar": []
    },
    "亭": {
        "level": 50,
        "meaning": "Restaurant",
        "similar": [
            {
                "kanji": "停",
                "level": 23,
                "meaning": "Halt"
            }
        ]
    },
    "軌": {
        "level": 50,
        "meaning": "Rut",
        "similar": [
            {
                "kanji": "乾",
                "level": 29,
                "meaning": "Dry"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "某",
                "level": 60,
                "meaning": "Certain"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "軟",
                "level": 51,
                "meaning": "Soft"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "連",
                "level": 19,
                "meaning": "Take"
            }
        ]
    },
    "仰": {
        "level": 50,
        "meaning": "Look Up To",
        "similar": []
    },
    "廷": {
        "level": 50,
        "meaning": "Courts",
        "similar": [
            {
                "kanji": "延",
                "level": 30,
                "meaning": "Prolong"
            },
            {
                "kanji": "庭",
                "level": 12,
                "meaning": "Garden"
            }
        ]
    },
    "漂": {
        "level": 50,
        "meaning": "Drift",
        "similar": [
            {
                "kanji": "票",
                "level": 25,
                "meaning": "Ballot"
            },
            {
                "kanji": "標",
                "level": 13,
                "meaning": "Signpost"
            }
        ]
    },
    "漫": {
        "level": 50,
        "meaning": "Manga",
        "similar": [
            {
                "kanji": "慢",
                "level": 52,
                "meaning": "Ridicule"
            }
        ]
    },
    "伯": {
        "level": 50,
        "meaning": "Chief",
        "similar": [
            {
                "kanji": "香",
                "level": 37,
                "meaning": "Fragrance"
            },
            {
                "kanji": "旬",
                "level": 37,
                "meaning": "In"
            },
            {
                "kanji": "旧",
                "level": 36,
                "meaning": "Former"
            },
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            },
            {
                "kanji": "白",
                "level": 2,
                "meaning": "White"
            },
            {
                "kanji": "百",
                "level": 4,
                "meaning": "Hundred"
            },
            {
                "kanji": "旨",
                "level": 43,
                "meaning": "Point"
            }
        ]
    },
    "彰": {
        "level": 50,
        "meaning": "Clear",
        "similar": [
            {
                "kanji": "章",
                "level": 12,
                "meaning": "Chapter"
            },
            {
                "kanji": "庫",
                "level": 28,
                "meaning": "Storage"
            }
        ]
    },
    "翻": {
        "level": 50,
        "meaning": "Flip",
        "similar": []
    },
    "耕": {
        "level": 51,
        "meaning": "Plow",
        "similar": [
            {
                "kanji": "奏",
                "level": 38,
                "meaning": "Play"
            },
            {
                "kanji": "奉",
                "level": 55,
                "meaning": "Dedicate"
            }
        ]
    },
    "偉": {
        "level": 51,
        "meaning": "Greatness",
        "similar": [
            {
                "kanji": "衛",
                "level": 32,
                "meaning": "Defense"
            }
        ]
    },
    "聡": {
        "level": 51,
        "meaning": "Wise",
        "similar": []
    },
    "肪": {
        "level": 51,
        "meaning": "Obese",
        "similar": [
            {
                "kanji": "肺",
                "level": 33,
                "meaning": "Lung"
            }
        ]
    },
    "肯": {
        "level": 51,
        "meaning": "Agreement",
        "similar": []
    },
    "邸": {
        "level": 51,
        "meaning": "Residence",
        "similar": []
    },
    "郊": {
        "level": 51,
        "meaning": "Suburbs",
        "similar": []
    },
    "郡": {
        "level": 51,
        "meaning": "County",
        "similar": [
            {
                "kanji": "部",
                "level": 9,
                "meaning": "Part"
            },
            {
                "kanji": "君",
                "level": 8,
                "meaning": "Buddy"
            }
        ]
    },
    "脂": {
        "level": 51,
        "meaning": "Fat",
        "similar": [
            {
                "kanji": "胆",
                "level": 59,
                "meaning": "Guts"
            },
            {
                "kanji": "腹",
                "level": 27,
                "meaning": "Belly"
            }
        ]
    },
    "慈": {
        "level": 51,
        "meaning": "Mercy",
        "similar": []
    },
    "膚": {
        "level": 51,
        "meaning": "Skin",
        "similar": [
            {
                "kanji": "虜",
                "level": 55,
                "meaning": "Captive"
            },
            {
                "kanji": "慮",
                "level": 38,
                "meaning": "Consider"
            }
        ]
    },
    "釈": {
        "level": 51,
        "meaning": "Explanation",
        "similar": []
    },
    "燥": {
        "level": 51,
        "meaning": "Dry Up",
        "similar": [
            {
                "kanji": "繰",
                "level": 38,
                "meaning": "Spin"
            },
            {
                "kanji": "操",
                "level": 33,
                "meaning": "Manipulate"
            }
        ]
    },
    "苗": {
        "level": 51,
        "meaning": "Seedling",
        "similar": [
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "抽",
                "level": 49,
                "meaning": "Pluck"
            },
            {
                "kanji": "猫",
                "level": 15,
                "meaning": "Cat"
            },
            {
                "kanji": "描",
                "level": 38,
                "meaning": "Draw"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            }
        ]
    },
    "挟": {
        "level": 51,
        "meaning": "Between",
        "similar": [
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            },
            {
                "kanji": "救",
                "level": 31,
                "meaning": "Rescue"
            },
            {
                "kanji": "接",
                "level": 26,
                "meaning": "Adjoin"
            },
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            },
            {
                "kanji": "振",
                "level": 26,
                "meaning": "Shake"
            }
        ]
    },
    "玄": {
        "level": 51,
        "meaning": "Mysterious",
        "similar": [
            {
                "kanji": "広",
                "level": 3,
                "meaning": "Wide"
            }
        ]
    },
    "召": {
        "level": 51,
        "meaning": "Call",
        "similar": [
            {
                "kanji": "加",
                "level": 19,
                "meaning": "Add"
            },
            {
                "kanji": "石",
                "level": 4,
                "meaning": "Stone"
            },
            {
                "kanji": "司",
                "level": 15,
                "meaning": "Director"
            }
        ]
    },
    "蓮": {
        "level": 51,
        "meaning": "Lotus",
        "similar": []
    },
    "瓶": {
        "level": 51,
        "meaning": "Bottle",
        "similar": []
    },
    "喚": {
        "level": 51,
        "meaning": "Scream",
        "similar": []
    },
    "隅": {
        "level": 51,
        "meaning": "Corner",
        "similar": [
            {
                "kanji": "偶",
                "level": 50,
                "meaning": "Accidentally"
            }
        ]
    },
    "隻": {
        "level": 51,
        "meaning": "Ship Counter",
        "similar": [
            {
                "kanji": "集",
                "level": 10,
                "meaning": "Collect"
            },
            {
                "kanji": "進",
                "level": 10,
                "meaning": "Advance"
            }
        ]
    },
    "枯": {
        "level": 51,
        "meaning": "Wither",
        "similar": [
            {
                "kanji": "格",
                "level": 14,
                "meaning": "Status"
            }
        ]
    },
    "頂": {
        "level": 51,
        "meaning": "Summit",
        "similar": [
            {
                "kanji": "項",
                "level": 39,
                "meaning": "Paragraph"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            },
            {
                "kanji": "預",
                "level": 30,
                "meaning": "Deposit"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "貧",
                "level": 30,
                "meaning": "Poor"
            },
            {
                "kanji": "原",
                "level": 17,
                "meaning": "Original"
            }
        ]
    },
    "塚": {
        "level": 51,
        "meaning": "Mound",
        "similar": [
            {
                "kanji": "家",
                "level": 7,
                "meaning": "House"
            },
            {
                "kanji": "嫁",
                "level": 45,
                "meaning": "Bride"
            },
            {
                "kanji": "豪",
                "level": 31,
                "meaning": "Luxurious"
            }
        ]
    },
    "襟": {
        "level": 51,
        "meaning": "Collar",
        "similar": [
            {
                "kanji": "禁",
                "level": 18,
                "meaning": "Prohibit"
            }
        ]
    },
    "媛": {
        "level": 51,
        "meaning": "Princess",
        "similar": []
    },
    "貞": {
        "level": 51,
        "meaning": "Chastity",
        "similar": [
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "貝",
                "level": 4,
                "meaning": "Shellfish"
            },
            {
                "kanji": "負",
                "level": 9,
                "meaning": "Lose"
            },
            {
                "kanji": "貫",
                "level": 52,
                "meaning": "Pierce"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            }
        ]
    },
    "沸": {
        "level": 51,
        "meaning": "Boil",
        "similar": [
            {
                "kanji": "決",
                "level": 8,
                "meaning": "Decide"
            }
        ]
    },
    "浦": {
        "level": 51,
        "meaning": "Bay",
        "similar": [
            {
                "kanji": "捕",
                "level": 25,
                "meaning": "Catch"
            }
        ]
    },
    "渦": {
        "level": 51,
        "meaning": "Whirlpool",
        "similar": [
            {
                "kanji": "禍",
                "level": 59,
                "meaning": "Evil"
            }
        ]
    },
    "亮": {
        "level": 51,
        "meaning": "Clear",
        "similar": []
    },
    "軒": {
        "level": 51,
        "meaning": "House Counter",
        "similar": [
            {
                "kanji": "転",
                "level": 10,
                "meaning": "Revolve"
            },
            {
                "kanji": "幹",
                "level": 23,
                "meaning": "Tree"
            },
            {
                "kanji": "乾",
                "level": 29,
                "meaning": "Dry"
            },
            {
                "kanji": "車",
                "level": 4,
                "meaning": "Car"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "連",
                "level": 19,
                "meaning": "Take"
            },
            {
                "kanji": "皇",
                "level": 33,
                "meaning": "Emperor"
            }
        ]
    },
    "軟": {
        "level": 51,
        "meaning": "Soft",
        "similar": [
            {
                "kanji": "較",
                "level": 26,
                "meaning": "Contrast"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "某",
                "level": 60,
                "meaning": "Certain"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "裏",
                "level": 33,
                "meaning": "Backside"
            }
        ]
    },
    "濯": {
        "level": 51,
        "meaning": "Wash",
        "similar": []
    },
    "怠": {
        "level": 52,
        "meaning": "Lazy",
        "similar": []
    },
    "倫": {
        "level": 52,
        "meaning": "Ethics",
        "similar": []
    },
    "遇": {
        "level": 52,
        "meaning": "Treatment",
        "similar": [
            {
                "kanji": "愚",
                "level": 54,
                "meaning": "Foolish"
            }
        ]
    },
    "偏": {
        "level": 52,
        "meaning": "Biased",
        "similar": []
    },
    "恒": {
        "level": 52,
        "meaning": "Constant",
        "similar": [
            {
                "kanji": "宣",
                "level": 33,
                "meaning": "Proclaim"
            },
            {
                "kanji": "悼",
                "level": 55,
                "meaning": "Grieve"
            },
            {
                "kanji": "陣",
                "level": 37,
                "meaning": "Army"
            },
            {
                "kanji": "慎",
                "level": 39,
                "meaning": "Humility"
            }
        ]
    },
    "遭": {
        "level": 52,
        "meaning": "Encounter",
        "similar": [
            {
                "kanji": "曹",
                "level": 59,
                "meaning": "Official"
            }
        ]
    },
    "惰": {
        "level": 52,
        "meaning": "Lazy",
        "similar": [
            {
                "kanji": "情",
                "level": 13,
                "meaning": "Feeling"
            },
            {
                "kanji": "清",
                "level": 28,
                "meaning": "Pure"
            }
        ]
    },
    "慢": {
        "level": 52,
        "meaning": "Ridicule",
        "similar": [
            {
                "kanji": "漫",
                "level": 50,
                "meaning": "Manga"
            }
        ]
    },
    "膨": {
        "level": 52,
        "meaning": "Swell",
        "similar": []
    },
    "牲": {
        "level": 52,
        "meaning": "Offering",
        "similar": [
            {
                "kanji": "特",
                "level": 11,
                "meaning": "Special"
            }
        ]
    },
    "芳": {
        "level": 52,
        "meaning": "Perfume",
        "similar": [
            {
                "kanji": "坊",
                "level": 22,
                "meaning": "Monk"
            },
            {
                "kanji": "芽",
                "level": 44,
                "meaning": "Sprout"
            }
        ]
    },
    "猟": {
        "level": 52,
        "meaning": "Hunting",
        "similar": []
    },
    "茨": {
        "level": 52,
        "meaning": "Briar",
        "similar": []
    },
    "鎖": {
        "level": 52,
        "meaning": "Chain",
        "similar": [
            {
                "kanji": "鏡",
                "level": 13,
                "meaning": "Mirror"
            },
            {
                "kanji": "鐘",
                "level": 45,
                "meaning": "Bell"
            },
            {
                "kanji": "錬",
                "level": 46,
                "meaning": "Tempering"
            },
            {
                "kanji": "鎮",
                "level": 55,
                "meaning": "Tranquilize"
            }
        ]
    },
    "呂": {
        "level": 52,
        "meaning": "Bath",
        "similar": []
    },
    "擁": {
        "level": 52,
        "meaning": "Embrace",
        "similar": []
    },
    "唆": {
        "level": 52,
        "meaning": "Instigate",
        "similar": [
            {
                "kanji": "俊",
                "level": 40,
                "meaning": "Genius"
            }
        ]
    },
    "陥": {
        "level": 52,
        "meaning": "Cave In",
        "similar": []
    },
    "陳": {
        "level": 52,
        "meaning": "Exhibit",
        "similar": [
            {
                "kanji": "陣",
                "level": 37,
                "meaning": "Army"
            },
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "凍",
                "level": 28,
                "meaning": "Frozen"
            },
            {
                "kanji": "便",
                "level": 11,
                "meaning": "Convenience"
            }
        ]
    },
    "噴": {
        "level": 52,
        "meaning": "Erupt",
        "similar": [
            {
                "kanji": "憤",
                "level": 58,
                "meaning": "Resent"
            },
            {
                "kanji": "墳",
                "level": 50,
                "meaning": "Tomb"
            },
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            }
        ]
    },
    "隼": {
        "level": 52,
        "meaning": "Falcon",
        "similar": []
    },
    "須": {
        "level": 52,
        "meaning": "Necessary",
        "similar": []
    },
    "颯": {
        "level": 52,
        "meaning": "Quick",
        "similar": []
    },
    "祥": {
        "level": 52,
        "meaning": "Auspicious",
        "similar": [
            {
                "kanji": "洋",
                "level": 11,
                "meaning": "Western"
            },
            {
                "kanji": "祈",
                "level": 18,
                "meaning": "Pray"
            }
        ]
    },
    "覇": {
        "level": 52,
        "meaning": "Leadership",
        "similar": []
    },
    "秩": {
        "level": 52,
        "meaning": "Order",
        "similar": [
            {
                "kanji": "枚",
                "level": 18,
                "meaning": "Flat"
            },
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "秋",
                "level": 15,
                "meaning": "Autumn"
            },
            {
                "kanji": "林",
                "level": 5,
                "meaning": "Forest"
            },
            {
                "kanji": "候",
                "level": 25,
                "meaning": "Climate"
            },
            {
                "kanji": "牧",
                "level": 43,
                "meaning": "Pasture"
            }
        ]
    },
    "孤": {
        "level": 52,
        "meaning": "Orphan",
        "similar": []
    },
    "殊": {
        "level": 52,
        "meaning": "Especially",
        "similar": [
            {
                "kanji": "残",
                "level": 14,
                "meaning": "Remainder"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "珠",
                "level": 49,
                "meaning": "Pearl"
            },
            {
                "kanji": "来",
                "level": 5,
                "meaning": "Come"
            }
        ]
    },
    "没": {
        "level": 52,
        "meaning": "Die",
        "similar": [
            {
                "kanji": "波",
                "level": 11,
                "meaning": "Wave"
            },
            {
                "kanji": "投",
                "level": 8,
                "meaning": "Throw"
            }
        ]
    },
    "貫": {
        "level": 52,
        "meaning": "Pierce",
        "similar": [
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "貴",
                "level": 34,
                "meaning": "Valuable"
            },
            {
                "kanji": "貞",
                "level": 51,
                "meaning": "Chastity"
            },
            {
                "kanji": "黄",
                "level": 7,
                "meaning": "Yellow"
            },
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "偵",
                "level": 31,
                "meaning": "Spy"
            },
            {
                "kanji": "慣",
                "level": 25,
                "meaning": "Accustomed"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            }
        ]
    },
    "賠": {
        "level": 52,
        "meaning": "Compensation",
        "similar": []
    },
    "糧": {
        "level": 52,
        "meaning": "Provisions",
        "similar": [
            {
                "kanji": "種",
                "level": 18,
                "meaning": "Kind"
            }
        ]
    },
    "綾": {
        "level": 52,
        "meaning": "Design",
        "similar": []
    },
    "乃": {
        "level": 52,
        "meaning": "From",
        "similar": []
    },
    "輔": {
        "level": 52,
        "meaning": "Help",
        "similar": []
    },
    "胞": {
        "level": 53,
        "meaning": "Cell",
        "similar": []
    },
    "胡": {
        "level": 53,
        "meaning": "Barbarian",
        "similar": []
    },
    "惨": {
        "level": 53,
        "meaning": "Disaster",
        "similar": [
            {
                "kanji": "参",
                "level": 14,
                "meaning": "Participate"
            }
        ]
    },
    "准": {
        "level": 53,
        "meaning": "Semi",
        "similar": [
            {
                "kanji": "推",
                "level": 34,
                "meaning": "Infer"
            },
            {
                "kanji": "準",
                "level": 23,
                "meaning": "Standard"
            },
            {
                "kanji": "唯",
                "level": 49,
                "meaning": "Solely"
            },
            {
                "kanji": "携",
                "level": 40,
                "meaning": "Portable"
            }
        ]
    },
    "舗": {
        "level": 53,
        "meaning": "Shop",
        "similar": []
    },
    "戴": {
        "level": 53,
        "meaning": "Receive",
        "similar": []
    },
    "艇": {
        "level": 53,
        "meaning": "Rowboat",
        "similar": [
            {
                "kanji": "般",
                "level": 36,
                "meaning": "Generally"
            }
        ]
    },
    "剰": {
        "level": 53,
        "meaning": "Surplus",
        "similar": [
            {
                "kanji": "乗",
                "level": 9,
                "meaning": "Ride"
            }
        ]
    },
    "披": {
        "level": 53,
        "meaning": "Expose",
        "similar": [
            {
                "kanji": "技",
                "level": 14,
                "meaning": "Skill"
            },
            {
                "kanji": "投",
                "level": 8,
                "meaning": "Throw"
            },
            {
                "kanji": "波",
                "level": 11,
                "meaning": "Wave"
            },
            {
                "kanji": "疲",
                "level": 45,
                "meaning": "Exhausted"
            }
        ]
    },
    "錦": {
        "level": 53,
        "meaning": "Brocade",
        "similar": []
    },
    "据": {
        "level": 53,
        "meaning": "Install",
        "similar": [
            {
                "kanji": "括",
                "level": 42,
                "meaning": "Fasten"
            },
            {
                "kanji": "居",
                "level": 25,
                "meaning": "Alive"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            }
        ]
    },
    "莉": {
        "level": 53,
        "meaning": "Jasmine",
        "similar": []
    },
    "搭": {
        "level": 53,
        "meaning": "Board",
        "similar": [
            {
                "kanji": "塔",
                "level": 44,
                "meaning": "Tower"
            },
            {
                "kanji": "拾",
                "level": 11,
                "meaning": "Pick"
            }
        ]
    },
    "葵": {
        "level": 53,
        "meaning": "Hollyhock",
        "similar": []
    },
    "蒙": {
        "level": 53,
        "meaning": "Darkness",
        "similar": []
    },
    "瓜": {
        "level": 53,
        "meaning": "Melon",
        "similar": []
    },
    "啓": {
        "level": 53,
        "meaning": "Enlighten",
        "similar": []
    },
    "虐": {
        "level": 53,
        "meaning": "Oppress",
        "similar": []
    },
    "随": {
        "level": 53,
        "meaning": "All",
        "similar": [
            {
                "kanji": "堕",
                "level": 57,
                "meaning": "Degenerate"
            }
        ]
    },
    "曙": {
        "level": 53,
        "meaning": "Dawn",
        "similar": []
    },
    "壌": {
        "level": 53,
        "meaning": "Soil",
        "similar": [
            {
                "kanji": "嬢",
                "level": 45,
                "meaning": "Miss"
            },
            {
                "kanji": "譲",
                "level": 39,
                "meaning": "Defer"
            },
            {
                "kanji": "醸",
                "level": 57,
                "meaning": "Brew"
            }
        ]
    },
    "駿": {
        "level": 53,
        "meaning": "Speed",
        "similar": []
    },
    "騰": {
        "level": 53,
        "meaning": "Inflation",
        "similar": []
    },
    "稿": {
        "level": 53,
        "meaning": "Draft",
        "similar": [
            {
                "kanji": "矯",
                "level": 60,
                "meaning": "Correct"
            }
        ]
    },
    "諒": {
        "level": 53,
        "meaning": "Comprehend",
        "similar": []
    },
    "諭": {
        "level": 53,
        "meaning": "Admonish",
        "similar": [
            {
                "kanji": "論",
                "level": 20,
                "meaning": "Theory"
            }
        ]
    },
    "鯉": {
        "level": 53,
        "meaning": "Carp",
        "similar": []
    },
    "寛": {
        "level": 53,
        "meaning": "Tolerance",
        "similar": [
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            }
        ]
    },
    "浄": {
        "level": 53,
        "meaning": "Cleanse",
        "similar": []
    },
    "緋": {
        "level": 53,
        "meaning": "Scarlet",
        "similar": []
    },
    "緯": {
        "level": 53,
        "meaning": "Latitude",
        "similar": []
    },
    "帥": {
        "level": 53,
        "meaning": "Commander",
        "similar": [
            {
                "kanji": "師",
                "level": 23,
                "meaning": "Teacher"
            }
        ]
    },
    "丹": {
        "level": 53,
        "meaning": "Rust Colored",
        "similar": []
    },
    "繊": {
        "level": 53,
        "meaning": "Fiber",
        "similar": []
    },
    "徐": {
        "level": 53,
        "meaning": "Gently",
        "similar": [
            {
                "kanji": "除",
                "level": 31,
                "meaning": "Exclude"
            },
            {
                "kanji": "余",
                "level": 20,
                "meaning": "Surplus"
            },
            {
                "kanji": "称",
                "level": 38,
                "meaning": "Title"
            },
            {
                "kanji": "待",
                "level": 12,
                "meaning": "Wait"
            }
        ]
    },
    "逸": {
        "level": 54,
        "meaning": "Deviate",
        "similar": [
            {
                "kanji": "勉",
                "level": 12,
                "meaning": "Exertion"
            }
        ]
    },
    "悠": {
        "level": 54,
        "meaning": "Leisure",
        "similar": []
    },
    "傲": {
        "level": 54,
        "meaning": "Proud",
        "similar": []
    },
    "愚": {
        "level": 54,
        "meaning": "Foolish",
        "similar": [
            {
                "kanji": "遇",
                "level": 52,
                "meaning": "Treatment"
            }
        ]
    },
    "酬": {
        "level": 54,
        "meaning": "Repay",
        "similar": [
            {
                "kanji": "酢",
                "level": 35,
                "meaning": "Vinegar"
            },
            {
                "kanji": "酌",
                "level": 58,
                "meaning": "Serve"
            },
            {
                "kanji": "酔",
                "level": 35,
                "meaning": "Drunk"
            }
        ]
    },
    "酷": {
        "level": 54,
        "meaning": "Cruel",
        "similar": [
            {
                "kanji": "酢",
                "level": 35,
                "meaning": "Vinegar"
            },
            {
                "kanji": "酪",
                "level": 59,
                "meaning": "Dairy"
            },
            {
                "kanji": "酔",
                "level": 35,
                "meaning": "Drunk"
            }
        ]
    },
    "冠": {
        "level": 54,
        "meaning": "Crown",
        "similar": []
    },
    "拐": {
        "level": 54,
        "meaning": "Kidnap",
        "similar": []
    },
    "勲": {
        "level": 54,
        "meaning": "Merit",
        "similar": [
            {
                "kanji": "動",
                "level": 12,
                "meaning": "Move"
            }
        ]
    },
    "茎": {
        "level": 54,
        "meaning": "Stem",
        "similar": []
    },
    "茜": {
        "level": 54,
        "meaning": "Red Dye",
        "similar": []
    },
    "荘": {
        "level": 54,
        "meaning": "Villa",
        "similar": []
    },
    "卸": {
        "level": 54,
        "meaning": "Wholesale",
        "similar": [
            {
                "kanji": "御",
                "level": 39,
                "meaning": "Honorable"
            }
        ]
    },
    "鎌": {
        "level": 54,
        "meaning": "Sickle",
        "similar": []
    },
    "叙": {
        "level": 54,
        "meaning": "Describe",
        "similar": []
    },
    "呆": {
        "level": 54,
        "meaning": "Shock",
        "similar": []
    },
    "呈": {
        "level": 54,
        "meaning": "Present",
        "similar": [
            {
                "kanji": "吐",
                "level": 34,
                "meaning": "Throw"
            },
            {
                "kanji": "叫",
                "level": 44,
                "meaning": "Shout"
            }
        ]
    },
    "哺": {
        "level": 54,
        "meaning": "Nurse",
        "similar": []
    },
    "疎": {
        "level": 54,
        "meaning": "Neglect",
        "similar": []
    },
    "疾": {
        "level": 54,
        "meaning": "Rapidly",
        "similar": [
            {
                "kanji": "族",
                "level": 12,
                "meaning": "Tribe"
            },
            {
                "kanji": "疫",
                "level": 50,
                "meaning": "Epidemic"
            },
            {
                "kanji": "疲",
                "level": 45,
                "meaning": "Exhausted"
            },
            {
                "kanji": "痴",
                "level": 54,
                "meaning": "Stupid"
            }
        ]
    },
    "痴": {
        "level": 54,
        "meaning": "Stupid",
        "similar": [
            {
                "kanji": "痢",
                "level": 60,
                "meaning": "Diarrhea"
            },
            {
                "kanji": "疾",
                "level": 54,
                "meaning": "Rapidly"
            }
        ]
    },
    "阿": {
        "level": 54,
        "meaning": "Flatter",
        "similar": []
    },
    "杏": {
        "level": 54,
        "meaning": "Apricot",
        "similar": []
    },
    "栞": {
        "level": 54,
        "meaning": "Bookmark",
        "similar": []
    },
    "栽": {
        "level": 54,
        "meaning": "Planting",
        "similar": [
            {
                "kanji": "裁",
                "level": 23,
                "meaning": "Judge"
            }
        ]
    },
    "顕": {
        "level": 54,
        "meaning": "Appear",
        "similar": [
            {
                "kanji": "題",
                "level": 13,
                "meaning": "Topic"
            }
        ]
    },
    "欄": {
        "level": 54,
        "meaning": "Column",
        "similar": []
    },
    "謡": {
        "level": 54,
        "meaning": "Noh Chanting",
        "similar": [
            {
                "kanji": "詳",
                "level": 17,
                "meaning": "Detailed"
            }
        ]
    },
    "鯨": {
        "level": 54,
        "meaning": "Whale",
        "similar": []
    },
    "尚": {
        "level": 54,
        "meaning": "Furthermore",
        "similar": [
            {
                "kanji": "向",
                "level": 6,
                "meaning": "Yonder"
            },
            {
                "kanji": "商",
                "level": 12,
                "meaning": "Merchandise"
            }
        ]
    },
    "粛": {
        "level": 54,
        "meaning": "Solemn",
        "similar": []
    },
    "紋": {
        "level": 54,
        "meaning": "Family Crest",
        "similar": [
            {
                "kanji": "絞",
                "level": 25,
                "meaning": "Strangle"
            },
            {
                "kanji": "紡",
                "level": 59,
                "meaning": "Spinning"
            },
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "統",
                "level": 22,
                "meaning": "Unite"
            },
            {
                "kanji": "納",
                "level": 33,
                "meaning": "Supply"
            },
            {
                "kanji": "級",
                "level": 11,
                "meaning": "Level"
            },
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            },
            {
                "kanji": "紀",
                "level": 15,
                "meaning": "Account"
            }
        ]
    },
    "践": {
        "level": 54,
        "meaning": "Practice",
        "similar": [
            {
                "kanji": "跡",
                "level": 37,
                "meaning": "Traces"
            },
            {
                "kanji": "跳",
                "level": 37,
                "meaning": "Hop"
            }
        ]
    },
    "且": {
        "level": 54,
        "meaning": "Also",
        "similar": []
    },
    "庶": {
        "level": 54,
        "meaning": "All",
        "similar": [
            {
                "kanji": "遮",
                "level": 57,
                "meaning": "Intercept"
            }
        ]
    },
    "遼": {
        "level": 55,
        "meaning": "Distant",
        "similar": []
    },
    "傍": {
        "level": 55,
        "meaning": "Nearby",
        "similar": []
    },
    "那": {
        "level": 55,
        "meaning": "What",
        "similar": []
    },
    "悼": {
        "level": 55,
        "meaning": "Grieve",
        "similar": [
            {
                "kanji": "単",
                "level": 15,
                "meaning": "Simple"
            },
            {
                "kanji": "卓",
                "level": 45,
                "meaning": "Table"
            },
            {
                "kanji": "恒",
                "level": 52,
                "meaning": "Constant"
            }
        ]
    },
    "惜": {
        "level": 55,
        "meaning": "Frugal",
        "similar": [
            {
                "kanji": "借",
                "level": 18,
                "meaning": "Borrow"
            },
            {
                "kanji": "情",
                "level": 13,
                "meaning": "Feeling"
            },
            {
                "kanji": "昔",
                "level": 11,
                "meaning": "Long"
            },
            {
                "kanji": "措",
                "level": 41,
                "meaning": "Set"
            }
        ]
    },
    "郭": {
        "level": 55,
        "meaning": "Enclosure",
        "similar": []
    },
    "愉": {
        "level": 55,
        "meaning": "Pleasant",
        "similar": [
            {
                "kanji": "前",
                "level": 6,
                "meaning": "Front"
            }
        ]
    },
    "脊": {
        "level": 55,
        "meaning": "Stature",
        "similar": []
    },
    "憂": {
        "level": 55,
        "meaning": "Grief",
        "similar": [
            {
                "kanji": "優",
                "level": 23,
                "meaning": "Superior"
            }
        ]
    },
    "憾": {
        "level": 55,
        "meaning": "Remorse",
        "similar": [
            {
                "kanji": "感",
                "level": 13,
                "meaning": "Feeling"
            },
            {
                "kanji": "認",
                "level": 21,
                "meaning": "Recognize"
            }
        ]
    },
    "凝": {
        "level": 55,
        "meaning": "Congeal",
        "similar": [
            {
                "kanji": "擬",
                "level": 59,
                "meaning": "Imitate"
            },
            {
                "kanji": "疑",
                "level": 13,
                "meaning": "Doubt"
            }
        ]
    },
    "抹": {
        "level": 55,
        "meaning": "Erase",
        "similar": [
            {
                "kanji": "扶",
                "level": 58,
                "meaning": "Aid"
            },
            {
                "kanji": "振",
                "level": 26,
                "meaning": "Shake"
            }
        ]
    },
    "鎮": {
        "level": 55,
        "meaning": "Tranquilize",
        "similar": [
            {
                "kanji": "錬",
                "level": 46,
                "meaning": "Tempering"
            },
            {
                "kanji": "鎖",
                "level": 52,
                "meaning": "Chain"
            }
        ]
    },
    "瑛": {
        "level": 55,
        "meaning": "Crystal",
        "similar": []
    },
    "旦": {
        "level": 55,
        "meaning": "Dawn",
        "similar": []
    },
    "昌": {
        "level": 55,
        "meaning": "Prosperous",
        "similar": []
    },
    "癒": {
        "level": 55,
        "meaning": "Healing",
        "similar": []
    },
    "虜": {
        "level": 55,
        "meaning": "Captive",
        "similar": [
            {
                "kanji": "膚",
                "level": 51,
                "meaning": "Skin"
            },
            {
                "kanji": "慮",
                "level": 38,
                "meaning": "Consider"
            }
        ]
    },
    "朴": {
        "level": 55,
        "meaning": "Simple",
        "similar": [
            {
                "kanji": "杯",
                "level": 29,
                "meaning": "Cup"
            },
            {
                "kanji": "村",
                "level": 4,
                "meaning": "Village"
            },
            {
                "kanji": "私",
                "level": 6,
                "meaning": "I"
            },
            {
                "kanji": "利",
                "level": 11,
                "meaning": "Profit"
            }
        ]
    },
    "栃": {
        "level": 55,
        "meaning": "Horse Chestnut",
        "similar": []
    },
    "栓": {
        "level": 55,
        "meaning": "Cork",
        "similar": [
            {
                "kanji": "柱",
                "level": 40,
                "meaning": "Pillar"
            }
        ]
    },
    "奉": {
        "level": 55,
        "meaning": "Dedicate",
        "similar": [
            {
                "kanji": "俸",
                "level": 57,
                "meaning": "Salary"
            },
            {
                "kanji": "奏",
                "level": 38,
                "meaning": "Play"
            },
            {
                "kanji": "耕",
                "level": 51,
                "meaning": "Plow"
            }
        ]
    },
    "該": {
        "level": 55,
        "meaning": "The Above",
        "similar": [
            {
                "kanji": "訪",
                "level": 27,
                "meaning": "Visit"
            },
            {
                "kanji": "読",
                "level": 10,
                "meaning": "Read"
            },
            {
                "kanji": "誘",
                "level": 27,
                "meaning": "Invite"
            },
            {
                "kanji": "誠",
                "level": 41,
                "meaning": "Sincerity"
            },
            {
                "kanji": "診",
                "level": 29,
                "meaning": "Diagnose"
            },
            {
                "kanji": "評",
                "level": 21,
                "meaning": "Evaluate"
            }
        ]
    },
    "髄": {
        "level": 55,
        "meaning": "Marrow",
        "similar": []
    },
    "尿": {
        "level": 55,
        "meaning": "Urine",
        "similar": []
    },
    "粗": {
        "level": 55,
        "meaning": "Coarse",
        "similar": [
            {
                "kanji": "租",
                "level": 46,
                "meaning": "Tariff"
            },
            {
                "kanji": "粒",
                "level": 44,
                "meaning": "Grains"
            },
            {
                "kanji": "査",
                "level": 21,
                "meaning": "Inspect"
            }
        ]
    },
    "賓": {
        "level": 55,
        "meaning": "VIP",
        "similar": [
            {
                "kanji": "寮",
                "level": 46,
                "meaning": "Dormitory"
            },
            {
                "kanji": "頻",
                "level": 40,
                "meaning": "Frequent"
            }
        ]
    },
    "累": {
        "level": 55,
        "meaning": "Accumulate",
        "similar": []
    },
    "赴": {
        "level": 55,
        "meaning": "Proceed",
        "similar": [
            {
                "kanji": "走",
                "level": 5,
                "meaning": "Run"
            }
        ]
    },
    "之": {
        "level": 55,
        "meaning": "This",
        "similar": []
    },
    "伏": {
        "level": 55,
        "meaning": "Bow",
        "similar": [
            {
                "kanji": "体",
                "level": 5,
                "meaning": "Body"
            }
        ]
    },
    "弥": {
        "level": 55,
        "meaning": "Increasing",
        "similar": []
    },
    "佳": {
        "level": 55,
        "meaning": "Excellent",
        "similar": [
            {
                "kanji": "侍",
                "level": 44,
                "meaning": "Samurai"
            },
            {
                "kanji": "佐",
                "level": 47,
                "meaning": "Help"
            },
            {
                "kanji": "垂",
                "level": 33,
                "meaning": "Dangle"
            }
        ]
    },
    "龍": {
        "level": 55,
        "meaning": "Imperial",
        "similar": []
    },
    "循": {
        "level": 55,
        "meaning": "Circulation",
        "similar": [
            {
                "kanji": "盾",
                "level": 48,
                "meaning": "Shield"
            },
            {
                "kanji": "質",
                "level": 24,
                "meaning": "Quality"
            }
        ]
    },
    "遥": {
        "level": 56,
        "meaning": "Far Off",
        "similar": []
    },
    "恭": {
        "level": 56,
        "meaning": "Respect",
        "similar": [
            {
                "kanji": "慕",
                "level": 60,
                "meaning": "Yearn"
            }
        ]
    },
    "悦": {
        "level": 56,
        "meaning": "Delight",
        "similar": [
            {
                "kanji": "祝",
                "level": 24,
                "meaning": "Celebrate"
            },
            {
                "kanji": "党",
                "level": 32,
                "meaning": "Group"
            },
            {
                "kanji": "況",
                "level": 25,
                "meaning": "Condition"
            }
        ]
    },
    "凛": {
        "level": 56,
        "meaning": "Cold",
        "similar": []
    },
    "凡": {
        "level": 56,
        "meaning": "Mediocre",
        "similar": []
    },
    "舶": {
        "level": 56,
        "meaning": "Ship",
        "similar": []
    },
    "拍": {
        "level": 56,
        "meaning": "Beat",
        "similar": [
            {
                "kanji": "指",
                "level": 11,
                "meaning": "Finger"
            },
            {
                "kanji": "挿",
                "level": 47,
                "meaning": "Insert"
            },
            {
                "kanji": "担",
                "level": 24,
                "meaning": "Carry"
            },
            {
                "kanji": "泊",
                "level": 42,
                "meaning": "Overnight"
            },
            {
                "kanji": "者",
                "level": 8,
                "meaning": "Someone"
            },
            {
                "kanji": "押",
                "level": 30,
                "meaning": "Push"
            },
            {
                "kanji": "抽",
                "level": 49,
                "meaning": "Pluck"
            },
            {
                "kanji": "百",
                "level": 4,
                "meaning": "Hundred"
            }
        ]
    },
    "匠": {
        "level": 56,
        "meaning": "Artisan",
        "similar": []
    },
    "錯": {
        "level": 56,
        "meaning": "Confused",
        "similar": [
            {
                "kanji": "鏡",
                "level": 13,
                "meaning": "Mirror"
            },
            {
                "kanji": "鐘",
                "level": 45,
                "meaning": "Bell"
            }
        ]
    },
    "猶": {
        "level": 56,
        "meaning": "Still",
        "similar": []
    },
    "搾": {
        "level": 56,
        "meaning": "Squeeze",
        "similar": [
            {
                "kanji": "控",
                "level": 39,
                "meaning": "Abstain"
            }
        ]
    },
    "摂": {
        "level": 56,
        "meaning": "In Addition",
        "similar": []
    },
    "呉": {
        "level": 56,
        "meaning": "Give",
        "similar": [
            {
                "kanji": "娯",
                "level": 44,
                "meaning": "Recreation"
            }
        ]
    },
    "嘉": {
        "level": 56,
        "meaning": "Esteem",
        "similar": []
    },
    "陵": {
        "level": 56,
        "meaning": "Mausoleum",
        "similar": [
            {
                "kanji": "陸",
                "level": 31,
                "meaning": "Land"
            }
        ]
    },
    "智": {
        "level": 56,
        "meaning": "Wisdom",
        "similar": []
    },
    "靖": {
        "level": 56,
        "meaning": "Peaceful",
        "similar": []
    },
    "蝶": {
        "level": 56,
        "meaning": "Butterfly",
        "similar": []
    },
    "柴": {
        "level": 56,
        "meaning": "Brushwood",
        "similar": []
    },
    "碑": {
        "level": 56,
        "meaning": "Tombstone",
        "similar": [
            {
                "kanji": "硬",
                "level": 45,
                "meaning": "Stiff"
            }
        ]
    },
    "飽": {
        "level": 56,
        "meaning": "Bored",
        "similar": [
            {
                "kanji": "飲",
                "level": 10,
                "meaning": "Drink"
            },
            {
                "kanji": "飾",
                "level": 30,
                "meaning": "Decorate"
            },
            {
                "kanji": "飢",
                "level": 48,
                "meaning": "Starve"
            }
        ]
    },
    "穀": {
        "level": 56,
        "meaning": "Grain",
        "similar": [
            {
                "kanji": "殻",
                "level": 58,
                "meaning": "Husk"
            }
        ]
    },
    "窒": {
        "level": 56,
        "meaning": "Suffocate",
        "similar": [
            {
                "kanji": "室",
                "level": 6,
                "meaning": "Room"
            },
            {
                "kanji": "空",
                "level": 5,
                "meaning": "Sky"
            }
        ]
    },
    "窮": {
        "level": 56,
        "meaning": "Destitute",
        "similar": []
    },
    "宰": {
        "level": 56,
        "meaning": "Manager",
        "similar": [
            {
                "kanji": "幸",
                "level": 16,
                "meaning": "Happiness"
            },
            {
                "kanji": "辛",
                "level": 44,
                "meaning": "Spicy"
            }
        ]
    },
    "寂": {
        "level": 56,
        "meaning": "Lonely",
        "similar": [
            {
                "kanji": "叔",
                "level": 59,
                "meaning": "Uncle"
            },
            {
                "kanji": "淑",
                "level": 58,
                "meaning": "Graceful"
            }
        ]
    },
    "尉": {
        "level": 56,
        "meaning": "Military Officer",
        "similar": [
            {
                "kanji": "慰",
                "level": 43,
                "meaning": "Consolation"
            }
        ]
    },
    "洪": {
        "level": 56,
        "meaning": "Flood",
        "similar": [
            {
                "kanji": "法",
                "level": 15,
                "meaning": "Method"
            },
            {
                "kanji": "浜",
                "level": 28,
                "meaning": "Beach"
            }
        ]
    },
    "紳": {
        "level": 56,
        "meaning": "Gentleman",
        "similar": [
            {
                "kanji": "細",
                "level": 17,
                "meaning": "Thin"
            },
            {
                "kanji": "綿",
                "level": 46,
                "meaning": "Cotton"
            },
            {
                "kanji": "練",
                "level": 13,
                "meaning": "Practice"
            },
            {
                "kanji": "縄",
                "level": 36,
                "meaning": "Rope"
            },
            {
                "kanji": "紺",
                "level": 57,
                "meaning": "Navy"
            },
            {
                "kanji": "組",
                "level": 7,
                "meaning": "Group"
            }
        ]
    },
    "縛": {
        "level": 56,
        "meaning": "Bind",
        "similar": []
    },
    "縫": {
        "level": 56,
        "meaning": "Sew",
        "similar": []
    },
    "庸": {
        "level": 56,
        "meaning": "Common",
        "similar": []
    },
    "弊": {
        "level": 56,
        "meaning": "Evil",
        "similar": [
            {
                "kanji": "幣",
                "level": 47,
                "meaning": "Cash"
            }
        ]
    },
    "弦": {
        "level": 56,
        "meaning": "Chord",
        "similar": []
    },
    "轄": {
        "level": 56,
        "meaning": "Control",
        "similar": []
    },
    "遍": {
        "level": 57,
        "meaning": "Universal",
        "similar": []
    },
    "遮": {
        "level": 57,
        "meaning": "Intercept",
        "similar": [
            {
                "kanji": "庶",
                "level": 54,
                "meaning": "All"
            }
        ]
    },
    "胎": {
        "level": 57,
        "meaning": "Womb",
        "similar": [
            {
                "kanji": "胴",
                "level": 47,
                "meaning": "Torso"
            }
        ]
    },
    "烏": {
        "level": 57,
        "meaning": "Crow",
        "similar": []
    },
    "酵": {
        "level": 57,
        "meaning": "Fermentation",
        "similar": []
    },
    "腸": {
        "level": 57,
        "meaning": "Intestines",
        "similar": [
            {
                "kanji": "傷",
                "level": 32,
                "meaning": "Wound"
            },
            {
                "kanji": "湯",
                "level": 12,
                "meaning": "Hot"
            },
            {
                "kanji": "胆",
                "level": 59,
                "meaning": "Guts"
            },
            {
                "kanji": "場",
                "level": 8,
                "meaning": "Location"
            },
            {
                "kanji": "陽",
                "level": 12,
                "meaning": "Sunshine"
            },
            {
                "kanji": "揚",
                "level": 42,
                "meaning": "Hoist"
            }
        ]
    },
    "膜": {
        "level": 57,
        "meaning": "Membrane",
        "similar": [
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            },
            {
                "kanji": "模",
                "level": 25,
                "meaning": "Imitation"
            }
        ]
    },
    "醸": {
        "level": 57,
        "meaning": "Brew",
        "similar": [
            {
                "kanji": "嬢",
                "level": 45,
                "meaning": "Miss"
            },
            {
                "kanji": "壌",
                "level": 53,
                "meaning": "Soil"
            }
        ]
    },
    "凸": {
        "level": 57,
        "meaning": "Convex",
        "similar": []
    },
    "凹": {
        "level": 57,
        "meaning": "Concave",
        "similar": []
    },
    "萌": {
        "level": 57,
        "meaning": "Sprout",
        "similar": []
    },
    "瑠": {
        "level": 57,
        "meaning": "Lapis Lazuli",
        "similar": []
    },
    "蒼": {
        "level": 57,
        "meaning": "Pale",
        "similar": []
    },
    "哉": {
        "level": 57,
        "meaning": "Question Mark",
        "similar": []
    },
    "敢": {
        "level": 57,
        "meaning": "Daring",
        "similar": [
            {
                "kanji": "厳",
                "level": 32,
                "meaning": "Strict"
            }
        ]
    },
    "喝": {
        "level": 57,
        "meaning": "Scold",
        "similar": [
            {
                "kanji": "員",
                "level": 12,
                "meaning": "Member"
            },
            {
                "kanji": "渇",
                "level": 30,
                "meaning": "Thirst"
            },
            {
                "kanji": "掲",
                "level": 37,
                "meaning": "Display"
            }
        ]
    },
    "閲": {
        "level": 57,
        "meaning": "Inspection",
        "similar": [
            {
                "kanji": "閥",
                "level": 19,
                "meaning": "Clique"
            },
            {
                "kanji": "関",
                "level": 16,
                "meaning": "Related"
            },
            {
                "kanji": "問",
                "level": 13,
                "meaning": "Problem"
            }
        ]
    },
    "旋": {
        "level": 57,
        "meaning": "Rotation",
        "similar": [
            {
                "kanji": "族",
                "level": 12,
                "meaning": "Tribe"
            },
            {
                "kanji": "旅",
                "level": 12,
                "meaning": "Trip"
            },
            {
                "kanji": "放",
                "level": 11,
                "meaning": "Release"
            }
        ]
    },
    "盲": {
        "level": 57,
        "meaning": "Blind",
        "similar": []
    },
    "坪": {
        "level": 57,
        "meaning": "Two Mat Area",
        "similar": [
            {
                "kanji": "幸",
                "level": 16,
                "meaning": "Happiness"
            },
            {
                "kanji": "培",
                "level": 48,
                "meaning": "Cultivate"
            }
        ]
    },
    "堕": {
        "level": 57,
        "meaning": "Degenerate",
        "similar": [
            {
                "kanji": "随",
                "level": 53,
                "meaning": "All"
            }
        ]
    },
    "衡": {
        "level": 57,
        "meaning": "Equilibrium",
        "similar": []
    },
    "楓": {
        "level": 57,
        "meaning": "Maple",
        "similar": []
    },
    "槽": {
        "level": 57,
        "meaning": "Tank",
        "similar": [
            {
                "kanji": "曹",
                "level": 59,
                "meaning": "Official"
            }
        ]
    },
    "款": {
        "level": 57,
        "meaning": "Article",
        "similar": []
    },
    "賊": {
        "level": 57,
        "meaning": "Robber",
        "similar": [
            {
                "kanji": "財",
                "level": 19,
                "meaning": "Wealth"
            },
            {
                "kanji": "眺",
                "level": 45,
                "meaning": "Stare"
            },
            {
                "kanji": "敗",
                "level": 17,
                "meaning": "Failure"
            }
        ]
    },
    "峡": {
        "level": 57,
        "meaning": "Ravine",
        "similar": [
            {
                "kanji": "炭",
                "level": 41,
                "meaning": "Charcoal"
            }
        ]
    },
    "紺": {
        "level": 57,
        "meaning": "Navy",
        "similar": [
            {
                "kanji": "細",
                "level": 17,
                "meaning": "Thin"
            },
            {
                "kanji": "紳",
                "level": 56,
                "meaning": "Gentleman"
            },
            {
                "kanji": "練",
                "level": 13,
                "meaning": "Practice"
            },
            {
                "kanji": "緒",
                "level": 38,
                "meaning": "Together"
            }
        ]
    },
    "乙": {
        "level": 57,
        "meaning": "Latter",
        "similar": []
    },
    "伐": {
        "level": 57,
        "meaning": "Fell",
        "similar": [
            {
                "kanji": "代",
                "level": 4,
                "meaning": "Substitute"
            }
        ]
    },
    "鼓": {
        "level": 57,
        "meaning": "Drum",
        "similar": [
            {
                "kanji": "喜",
                "level": 17,
                "meaning": "Rejoice"
            }
        ]
    },
    "弔": {
        "level": 57,
        "meaning": "Condolence",
        "similar": [
            {
                "kanji": "引",
                "level": 3,
                "meaning": "Pull"
            },
            {
                "kanji": "弓",
                "level": 18,
                "meaning": "Bow"
            }
        ]
    },
    "漬": {
        "level": 57,
        "meaning": "Pickle",
        "similar": [
            {
                "kanji": "責",
                "level": 21,
                "meaning": "Blame"
            },
            {
                "kanji": "債",
                "level": 36,
                "meaning": "Debt"
            },
            {
                "kanji": "憤",
                "level": 58,
                "meaning": "Resent"
            },
            {
                "kanji": "賃",
                "level": 33,
                "meaning": "Rent"
            },
            {
                "kanji": "演",
                "level": 23,
                "meaning": "Perform"
            },
            {
                "kanji": "貢",
                "level": 43,
                "meaning": "Tribute"
            },
            {
                "kanji": "慣",
                "level": 25,
                "meaning": "Accustomed"
            },
            {
                "kanji": "漠",
                "level": 33,
                "meaning": "Desert"
            }
        ]
    },
    "羅": {
        "level": 57,
        "meaning": "Spread Out",
        "similar": [
            {
                "kanji": "維",
                "level": 36,
                "meaning": "Maintain"
            }
        ]
    },
    "俸": {
        "level": 57,
        "meaning": "Salary",
        "similar": [
            {
                "kanji": "奉",
                "level": 55,
                "meaning": "Dedicate"
            },
            {
                "kanji": "棒",
                "level": 31,
                "meaning": "Pole"
            }
        ]
    },
    "傑": {
        "level": 58,
        "meaning": "Greatness",
        "similar": []
    },
    "肖": {
        "level": 58,
        "meaning": "Resemblance",
        "similar": [
            {
                "kanji": "削",
                "level": 37,
                "meaning": "Whittle"
            },
            {
                "kanji": "消",
                "level": 12,
                "meaning": "Extinguish"
            }
        ]
    },
    "酌": {
        "level": 58,
        "meaning": "Serve",
        "similar": [
            {
                "kanji": "酔",
                "level": 35,
                "meaning": "Drunk"
            },
            {
                "kanji": "的",
                "level": 14,
                "meaning": "Target"
            },
            {
                "kanji": "配",
                "level": 10,
                "meaning": "Distribute"
            },
            {
                "kanji": "酬",
                "level": 54,
                "meaning": "Repay"
            }
        ]
    },
    "慨": {
        "level": 58,
        "meaning": "Sigh",
        "similar": [
            {
                "kanji": "既",
                "level": 31,
                "meaning": "Previously"
            },
            {
                "kanji": "概",
                "level": 49,
                "meaning": "Approximation"
            }
        ]
    },
    "憤": {
        "level": 58,
        "meaning": "Resent",
        "similar": [
            {
                "kanji": "噴",
                "level": 52,
                "meaning": "Erupt"
            },
            {
                "kanji": "漬",
                "level": 57,
                "meaning": "Pickle"
            },
            {
                "kanji": "墳",
                "level": 50,
                "meaning": "Tomb"
            }
        ]
    },
    "凌": {
        "level": 58,
        "meaning": "Endure",
        "similar": []
    },
    "戯": {
        "level": 58,
        "meaning": "Play",
        "similar": [
            {
                "kanji": "虚",
                "level": 17,
                "meaning": "Void"
            }
        ]
    },
    "剖": {
        "level": 58,
        "meaning": "Divide",
        "similar": [
            {
                "kanji": "部",
                "level": 9,
                "meaning": "Part"
            }
        ]
    },
    "扶": {
        "level": 58,
        "meaning": "Aid",
        "similar": [
            {
                "kanji": "抹",
                "level": 55,
                "meaning": "Erase"
            },
            {
                "kanji": "挟",
                "level": 51,
                "meaning": "Between"
            },
            {
                "kanji": "択",
                "level": 38,
                "meaning": "Select"
            },
            {
                "kanji": "技",
                "level": 14,
                "meaning": "Skill"
            },
            {
                "kanji": "抜",
                "level": 25,
                "meaning": "Extract"
            },
            {
                "kanji": "抗",
                "level": 37,
                "meaning": "Confront"
            },
            {
                "kanji": "振",
                "level": 26,
                "meaning": "Shake"
            }
        ]
    },
    "錠": {
        "level": 58,
        "meaning": "Lock",
        "similar": []
    },
    "菅": {
        "level": 58,
        "meaning": "Sedge",
        "similar": []
    },
    "瑞": {
        "level": 58,
        "meaning": "Congratulations",
        "similar": []
    },
    "璃": {
        "level": 58,
        "meaning": "Glassy",
        "similar": []
    },
    "藩": {
        "level": 58,
        "meaning": "Fiefdom",
        "similar": [
            {
                "kanji": "審",
                "level": 21,
                "meaning": "Judge"
            }
        ]
    },
    "嘱": {
        "level": 58,
        "meaning": "Request",
        "similar": [
            {
                "kanji": "属",
                "level": 25,
                "meaning": "Belong"
            }
        ]
    },
    "陪": {
        "level": 58,
        "meaning": "Accompany",
        "similar": [
            {
                "kanji": "倍",
                "level": 12,
                "meaning": "Double"
            },
            {
                "kanji": "培",
                "level": 48,
                "meaning": "Cultivate"
            }
        ]
    },
    "暁": {
        "level": 58,
        "meaning": "Dawn",
        "similar": []
    },
    "朽": {
        "level": 58,
        "meaning": "Rot",
        "similar": [
            {
                "kanji": "村",
                "level": 4,
                "meaning": "Village"
            },
            {
                "kanji": "材",
                "level": 14,
                "meaning": "Lumber"
            }
        ]
    },
    "硫": {
        "level": 58,
        "meaning": "Sulfur",
        "similar": []
    },
    "椎": {
        "level": 58,
        "meaning": "Oak",
        "similar": []
    },
    "奔": {
        "level": 58,
        "meaning": "Run",
        "similar": []
    },
    "窃": {
        "level": 58,
        "meaning": "Steal",
        "similar": []
    },
    "媒": {
        "level": 58,
        "meaning": "Mediator",
        "similar": [
            {
                "kanji": "某",
                "level": 60,
                "meaning": "Certain"
            }
        ]
    },
    "譜": {
        "level": 58,
        "meaning": "Genealogy",
        "similar": [
            {
                "kanji": "諸",
                "level": 33,
                "meaning": "Various"
            }
        ]
    },
    "殻": {
        "level": 58,
        "meaning": "Husk",
        "similar": [
            {
                "kanji": "穀",
                "level": 56,
                "meaning": "Grain"
            }
        ]
    },
    "赦": {
        "level": 58,
        "meaning": "Pardon",
        "similar": [
            {
                "kanji": "変",
                "level": 15,
                "meaning": "Change"
            },
            {
                "kanji": "教",
                "level": 7,
                "meaning": "Teach"
            }
        ]
    },
    "絹": {
        "level": 58,
        "meaning": "Silk",
        "similar": [
            {
                "kanji": "細",
                "level": 17,
                "meaning": "Thin"
            }
        ]
    },
    "鶏": {
        "level": 58,
        "meaning": "Chicken",
        "similar": []
    },
    "淑": {
        "level": 58,
        "meaning": "Graceful",
        "similar": [
            {
                "kanji": "渉",
                "level": 17,
                "meaning": "Ford"
            },
            {
                "kanji": "寂",
                "level": 56,
                "meaning": "Lonely"
            }
        ]
    },
    "帆": {
        "level": 58,
        "meaning": "Sail",
        "similar": []
    },
    "享": {
        "level": 58,
        "meaning": "Receive",
        "similar": []
    },
    "漣": {
        "level": 58,
        "meaning": "Ripples",
        "similar": []
    },
    "濁": {
        "level": 58,
        "meaning": "Muddy",
        "similar": []
    },
    "迭": {
        "level": 58,
        "meaning": "Alternate",
        "similar": [
            {
                "kanji": "送",
                "level": 9,
                "meaning": "Send"
            },
            {
                "kanji": "迷",
                "level": 27,
                "meaning": "Astray"
            },
            {
                "kanji": "途",
                "level": 27,
                "meaning": "Route"
            }
        ]
    },
    "遷": {
        "level": 59,
        "meaning": "Transition",
        "similar": []
    },
    "胆": {
        "level": 59,
        "meaning": "Guts",
        "similar": [
            {
                "kanji": "脂",
                "level": 51,
                "meaning": "Fat"
            },
            {
                "kanji": "腸",
                "level": 57,
                "meaning": "Intestines"
            }
        ]
    },
    "酪": {
        "level": 59,
        "meaning": "Dairy",
        "similar": [
            {
                "kanji": "酷",
                "level": 54,
                "meaning": "Cruel"
            },
            {
                "kanji": "略",
                "level": 29,
                "meaning": "Abbreviation"
            },
            {
                "kanji": "酢",
                "level": 35,
                "meaning": "Vinegar"
            },
            {
                "kanji": "酔",
                "level": 35,
                "meaning": "Drunk"
            },
            {
                "kanji": "格",
                "level": 14,
                "meaning": "Status"
            }
        ]
    },
    "慶": {
        "level": 59,
        "meaning": "Congratulate",
        "similar": []
    },
    "憧": {
        "level": 59,
        "meaning": "Long For",
        "similar": []
    },
    "拙": {
        "level": 59,
        "meaning": "Clumsy",
        "similar": [
            {
                "kanji": "掘",
                "level": 42,
                "meaning": "Dig"
            }
        ]
    },
    "鋳": {
        "level": 59,
        "meaning": "Cast",
        "similar": [
            {
                "kanji": "銭",
                "level": 32,
                "meaning": "Coin"
            },
            {
                "kanji": "鉄",
                "level": 10,
                "meaning": "Iron"
            },
            {
                "kanji": "鉱",
                "level": 41,
                "meaning": "Mineral"
            }
        ]
    },
    "卑": {
        "level": 59,
        "meaning": "Lowly",
        "similar": [
            {
                "kanji": "畔",
                "level": 60,
                "meaning": "Shore"
            },
            {
                "kanji": "鬼",
                "level": 23,
                "meaning": "Demon"
            }
        ]
    },
    "叔": {
        "level": 59,
        "meaning": "Uncle",
        "similar": [
            {
                "kanji": "寂",
                "level": 56,
                "meaning": "Lonely"
            }
        ]
    },
    "吟": {
        "level": 59,
        "meaning": "Recital",
        "similar": [
            {
                "kanji": "史",
                "level": 19,
                "meaning": "History"
            }
        ]
    },
    "擬": {
        "level": 59,
        "meaning": "Imitate",
        "similar": [
            {
                "kanji": "凝",
                "level": 55,
                "meaning": "Congeal"
            },
            {
                "kanji": "疑",
                "level": 13,
                "meaning": "Doubt"
            }
        ]
    },
    "蔑": {
        "level": 59,
        "meaning": "Scorn",
        "similar": []
    },
    "甚": {
        "level": 59,
        "meaning": "Very",
        "similar": [
            {
                "kanji": "勘",
                "level": 49,
                "meaning": "Intuition"
            },
            {
                "kanji": "堪",
                "level": 59,
                "meaning": "Endure"
            }
        ]
    },
    "閑": {
        "level": 59,
        "meaning": "Leisure",
        "similar": [
            {
                "kanji": "閉",
                "level": 33,
                "meaning": "Closed"
            },
            {
                "kanji": "関",
                "level": 16,
                "meaning": "Related"
            },
            {
                "kanji": "開",
                "level": 10,
                "meaning": "Open"
            },
            {
                "kanji": "問",
                "level": 13,
                "meaning": "Problem"
            },
            {
                "kanji": "閥",
                "level": 19,
                "meaning": "Clique"
            }
        ]
    },
    "雌": {
        "level": 59,
        "meaning": "Female",
        "similar": []
    },
    "曹": {
        "level": 59,
        "meaning": "Official",
        "similar": [
            {
                "kanji": "遭",
                "level": 52,
                "meaning": "Encounter"
            },
            {
                "kanji": "槽",
                "level": 57,
                "meaning": "Tank"
            }
        ]
    },
    "睦": {
        "level": 59,
        "meaning": "Friendly",
        "similar": []
    },
    "堪": {
        "level": 59,
        "meaning": "Endure",
        "similar": [
            {
                "kanji": "甚",
                "level": 59,
                "meaning": "Very"
            }
        ]
    },
    "梓": {
        "level": 59,
        "meaning": "Wood Block",
        "similar": []
    },
    "礁": {
        "level": 59,
        "meaning": "Reef",
        "similar": [
            {
                "kanji": "焦",
                "level": 42,
                "meaning": "Char"
            }
        ]
    },
    "禍": {
        "level": 59,
        "meaning": "Evil",
        "similar": [
            {
                "kanji": "渦",
                "level": 51,
                "meaning": "Whirlpool"
            }
        ]
    },
    "姻": {
        "level": 59,
        "meaning": "Marry",
        "similar": []
    },
    "詠": {
        "level": 59,
        "meaning": "Compose",
        "similar": [
            {
                "kanji": "訳",
                "level": 32,
                "meaning": "Translation"
            },
            {
                "kanji": "設",
                "level": 21,
                "meaning": "Establish"
            },
            {
                "kanji": "誠",
                "level": 41,
                "meaning": "Sincerity"
            }
        ]
    },
    "篤": {
        "level": 59,
        "meaning": "Deliberate",
        "similar": []
    },
    "屯": {
        "level": 59,
        "meaning": "Barracks",
        "similar": []
    },
    "汰": {
        "level": 59,
        "meaning": "Select",
        "similar": []
    },
    "沙": {
        "level": 59,
        "meaning": "Sand",
        "similar": []
    },
    "岬": {
        "level": 59,
        "meaning": "Cape",
        "similar": [
            {
                "kanji": "伸",
                "level": 36,
                "meaning": "Stretch"
            }
        ]
    },
    "峠": {
        "level": 59,
        "meaning": "Ridge",
        "similar": [
            {
                "kanji": "崇",
                "level": 59,
                "meaning": "Worship"
            }
        ]
    },
    "崇": {
        "level": 59,
        "meaning": "Worship",
        "similar": [
            {
                "kanji": "宗",
                "level": 29,
                "meaning": "Religion"
            },
            {
                "kanji": "峠",
                "level": 59,
                "meaning": "Ridge"
            }
        ]
    },
    "紡": {
        "level": 59,
        "meaning": "Spinning",
        "similar": [
            {
                "kanji": "糾",
                "level": 42,
                "meaning": "Twist"
            },
            {
                "kanji": "紋",
                "level": 54,
                "meaning": "Family"
            },
            {
                "kanji": "統",
                "level": 22,
                "meaning": "Unite"
            },
            {
                "kanji": "絞",
                "level": 25,
                "meaning": "Strangle"
            },
            {
                "kanji": "紅",
                "level": 34,
                "meaning": "Deep"
            },
            {
                "kanji": "紀",
                "level": 15,
                "meaning": "Account"
            },
            {
                "kanji": "紛",
                "level": 42,
                "meaning": "Distract"
            },
            {
                "kanji": "納",
                "level": 33,
                "meaning": "Supply"
            }
        ]
    },
    "浪": {
        "level": 59,
        "meaning": "Wander",
        "similar": [
            {
                "kanji": "恨",
                "level": 47,
                "meaning": "Grudge"
            },
            {
                "kanji": "娘",
                "level": 29,
                "meaning": "Daughter"
            },
            {
                "kanji": "食",
                "level": 6,
                "meaning": "Eat"
            },
            {
                "kanji": "良",
                "level": 11,
                "meaning": "Good"
            }
        ]
    },
    "亜": {
        "level": 59,
        "meaning": "Asia",
        "similar": [
            {
                "kanji": "豆",
                "level": 34,
                "meaning": "Beans"
            },
            {
                "kanji": "吐",
                "level": 34,
                "meaning": "Throw"
            }
        ]
    },
    "漆": {
        "level": 59,
        "meaning": "Lacquer",
        "similar": []
    },
    "侮": {
        "level": 59,
        "meaning": "Despise",
        "similar": [
            {
                "kanji": "悔",
                "level": 48,
                "meaning": "Regret"
            },
            {
                "kanji": "毎",
                "level": 5,
                "meaning": "Every"
            },
            {
                "kanji": "任",
                "level": 21,
                "meaning": "Duty"
            }
        ]
    },
    "忌": {
        "level": 59,
        "meaning": "Mourning",
        "similar": [
            {
                "kanji": "応",
                "level": 22,
                "meaning": "Respond"
            },
            {
                "kanji": "忘",
                "level": 18,
                "meaning": "Forget"
            }
        ]
    },
    "逝": {
        "level": 60,
        "meaning": "Die",
        "similar": [
            {
                "kanji": "近",
                "level": 5,
                "meaning": "Near"
            },
            {
                "kanji": "哲",
                "level": 42,
                "meaning": "Philosophy"
            },
            {
                "kanji": "折",
                "level": 14,
                "meaning": "Fold"
            }
        ]
    },
    "倹": {
        "level": 60,
        "meaning": "Thrifty",
        "similar": [
            {
                "kanji": "険",
                "level": 16,
                "meaning": "Risky"
            },
            {
                "kanji": "使",
                "level": 9,
                "meaning": "Use"
            },
            {
                "kanji": "検",
                "level": 21,
                "meaning": "Examine"
            }
        ]
    },
    "慕": {
        "level": 60,
        "meaning": "Yearn For",
        "similar": [
            {
                "kanji": "暮",
                "level": 33,
                "meaning": "Livelihood"
            },
            {
                "kanji": "墓",
                "level": 31,
                "meaning": "Grave"
            },
            {
                "kanji": "恭",
                "level": 56,
                "meaning": "Respect"
            },
            {
                "kanji": "幕",
                "level": 34,
                "meaning": "Curtain"
            },
            {
                "kanji": "募",
                "level": 37,
                "meaning": "Recruit"
            }
        ]
    },
    "煩": {
        "level": 60,
        "meaning": "Annoy",
        "similar": [
            {
                "kanji": "頑",
                "level": 14,
                "meaning": "Stubborn"
            },
            {
                "kanji": "順",
                "level": 19,
                "meaning": "Order"
            },
            {
                "kanji": "傾",
                "level": 38,
                "meaning": "Lean"
            },
            {
                "kanji": "賛",
                "level": 32,
                "meaning": "Agree"
            },
            {
                "kanji": "類",
                "level": 18,
                "meaning": "Type"
            },
            {
                "kanji": "資",
                "level": 21,
                "meaning": "Resources"
            },
            {
                "kanji": "頂",
                "level": 51,
                "meaning": "Summit"
            }
        ]
    },
    "醜": {
        "level": 60,
        "meaning": "Ugly",
        "similar": []
    },
    "劾": {
        "level": 60,
        "meaning": "Censure",
        "similar": [
            {
                "kanji": "刻",
                "level": 34,
                "meaning": "Carve"
            },
            {
                "kanji": "効",
                "level": 25,
                "meaning": "Effective"
            }
        ]
    },
    "狐": {
        "level": 60,
        "meaning": "Fox",
        "similar": []
    },
    "拷": {
        "level": 60,
        "meaning": "Torture",
        "similar": []
    },
    "匿": {
        "level": 60,
        "meaning": "Hide",
        "similar": [
            {
                "kanji": "若",
                "level": 19,
                "meaning": "Young"
            },
            {
                "kanji": "荷",
                "level": 16,
                "meaning": "Luggage"
            }
        ]
    },
    "升": {
        "level": 60,
        "meaning": "Grid",
        "similar": [
            {
                "kanji": "午",
                "level": 3,
                "meaning": "Noon"
            },
            {
                "kanji": "千",
                "level": 2,
                "meaning": "Thousand"
            },
            {
                "kanji": "牛",
                "level": 3,
                "meaning": "Cow"
            }
        ]
    },
    "唄": {
        "level": 60,
        "meaning": "Shamisen Song",
        "similar": []
    },
    "畔": {
        "level": 60,
        "meaning": "Shore",
        "similar": [
            {
                "kanji": "界",
                "level": 9,
                "meaning": "World"
            },
            {
                "kanji": "昇",
                "level": 27,
                "meaning": "Ascend"
            },
            {
                "kanji": "卑",
                "level": 59,
                "meaning": "Lowly"
            }
        ]
    },
    "藍": {
        "level": 60,
        "meaning": "Indigo",
        "similar": []
    },
    "痢": {
        "level": 60,
        "meaning": "Diarrhea",
        "similar": [
            {
                "kanji": "痴",
                "level": 54,
                "meaning": "Stupid"
            }
        ]
    },
    "藻": {
        "level": 60,
        "meaning": "Seaweed",
        "similar": [
            {
                "kanji": "操",
                "level": 33,
                "meaning": "Manipulate"
            }
        ]
    },
    "囚": {
        "level": 60,
        "meaning": "Criminal",
        "similar": [
            {
                "kanji": "四",
                "level": 2,
                "meaning": "Four"
            },
            {
                "kanji": "困",
                "level": 20,
                "meaning": "Distressed"
            }
        ]
    },
    "蛮": {
        "level": 60,
        "meaning": "Barbarian",
        "similar": []
    },
    "坑": {
        "level": 60,
        "meaning": "Pit",
        "similar": [
            {
                "kanji": "抗",
                "level": 37,
                "meaning": "Confront"
            },
            {
                "kanji": "攻",
                "level": 28,
                "meaning": "Aggression"
            },
            {
                "kanji": "坊",
                "level": 22,
                "meaning": "Monk"
            },
            {
                "kanji": "共",
                "level": 11,
                "meaning": "Together"
            }
        ]
    },
    "某": {
        "level": 60,
        "meaning": "Certain",
        "similar": [
            {
                "kanji": "東",
                "level": 6,
                "meaning": "East"
            },
            {
                "kanji": "軌",
                "level": 50,
                "meaning": "Rut"
            },
            {
                "kanji": "果",
                "level": 17,
                "meaning": "Fruit"
            },
            {
                "kanji": "媒",
                "level": 58,
                "meaning": "Mediator"
            },
            {
                "kanji": "菓",
                "level": 26,
                "meaning": "Cake"
            },
            {
                "kanji": "軟",
                "level": 51,
                "meaning": "Soft"
            }
        ]
    },
    "矯": {
        "level": 60,
        "meaning": "Correct",
        "similar": [
            {
                "kanji": "橋",
                "level": 13,
                "meaning": "Bridge"
            },
            {
                "kanji": "稿",
                "level": 53,
                "meaning": "Draft"
            }
        ]
    },
    "桟": {
        "level": 60,
        "meaning": "Jetty",
        "similar": [
            {
                "kanji": "械",
                "level": 20,
                "meaning": "Contraption"
            },
            {
                "kanji": "残",
                "level": 14,
                "meaning": "Remainder"
            },
            {
                "kanji": "株",
                "level": 24,
                "meaning": "Stocks"
            },
            {
                "kanji": "禁",
                "level": 18,
                "meaning": "Prohibit"
            }
        ]
    },
    "妄": {
        "level": 60,
        "meaning": "Reckless",
        "similar": []
    },
    "婿": {
        "level": 60,
        "meaning": "Groom",
        "similar": []
    },
    "謹": {
        "level": 60,
        "meaning": "Humble",
        "similar": [
            {
                "kanji": "詰",
                "level": 29,
                "meaning": "Stuffed"
            },
            {
                "kanji": "証",
                "level": 16,
                "meaning": "Evidence"
            }
        ]
    },
    "殉": {
        "level": 60,
        "meaning": "Martyr",
        "similar": []
    },
    "寡": {
        "level": 60,
        "meaning": "Widow",
        "similar": []
    },
    "泌": {
        "level": 60,
        "meaning": "Secrete",
        "similar": []
    },
    "渓": {
        "level": 60,
        "meaning": "Valley",
        "similar": [
            {
                "kanji": "奨",
                "level": 49,
                "meaning": "Encourage"
            },
            {
                "kanji": "援",
                "level": 22,
                "meaning": "Aid"
            },
            {
                "kanji": "採",
                "level": 32,
                "meaning": "Gather"
            }
        ]
    },
    "湧": {
        "level": 60,
        "meaning": "Well",
        "similar": []
    },
    "廉": {
        "level": 60,
        "meaning": "Bargain",
        "similar": [
            {
                "kanji": "兼",
                "level": 40,
                "meaning": "Concurrently"
            },
            {
                "kanji": "嫌",
                "level": 20,
                "meaning": "Dislike"
            }
        ]
    },
    "漸": {
        "level": 60,
        "meaning": "Gradually",
        "similar": [
            {
                "kanji": "潮",
                "level": 43,
                "meaning": "Tide"
            }
        ]
    },
    "罷": {
        "level": 60,
        "meaning": "Quit",
        "similar": []
    }
}

    // Fetch user's max level from WaniKani API
    async function fetchUserMaxLevel() {
        try {
            const response = await fetch(userApiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            console.log("User Data:", data); // Log user data
            return data.data.level;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    // Fetch kanji data from WaniKani API
    async function fetchKanji(levels) {
        try {
            const response = await fetch(subjectsApiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            console.log("Fetched Kanji Data:", data); // Log fetched data
            const kanjiData = data.data.filter(item => item.object === 'kanji' && levels.includes(item.data.level));
            console.log("Filtered Kanji Data:", kanjiData); // Log filtered kanji data
            return kanjiData;
        } catch (error) {
            console.error("Error fetching kanji data:", error);
        }
    }

    // Create level selection window
    async function createLevelSelection(maxLevel) {
        console.log("Max Level:", maxLevel); // Log max level

        const levelSelectionContainer = document.createElement('div');
        levelSelectionContainer.id = 'wanikani-level-selection';
        levelSelectionContainer.style.position = 'fixed';
        levelSelectionContainer.style.top = '50%';
        levelSelectionContainer.style.left = '50%';
        levelSelectionContainer.style.transform = 'translate(-50%, -50%)';
        levelSelectionContainer.style.padding = '20px';
        levelSelectionContainer.style.backgroundColor = 'white';
        levelSelectionContainer.style.border = '1px solid black';
        levelSelectionContainer.style.zIndex = 1000;
        levelSelectionContainer.style.maxHeight = '80vh';
        levelSelectionContainer.style.overflowY = 'auto';
        levelSelectionContainer.style.width = '60vw';

        const buttonContainerTop = document.createElement('div');
        buttonContainerTop.style.display = 'flex';
        buttonContainerTop.style.justifyContent = 'space-between';
        buttonContainerTop.style.alignItems = 'center';
        buttonContainerTop.style.marginBottom = '10px';

        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = 'Select All Unlocked Levels';
        selectAllButton.style.display = 'inline-block';
        let allSelected = false;

        selectAllButton.onclick = () => {
            allSelected = !allSelected;
            for (let level = 1; level <= maxLevel; level++) {
                document.getElementById(`level-${level}`).checked = allSelected;
            }
            selectAllButton.style.backgroundColor = allSelected ? 'lightgreen' : '';
        };
        buttonContainerTop.appendChild(selectAllButton);

        const questionTypeContainer = document.createElement('div');
        questionTypeContainer.style.display = 'inline-block';
        questionTypeContainer.style.marginLeft = '10px';

        const questionTypeLabel = document.createElement('label');
        questionTypeLabel.textContent = 'Question Type: ';
        questionTypeContainer.appendChild(questionTypeLabel);

        const questionTypeSelect = document.createElement('select');
        questionTypeSelect.innerHTML = `
        <option value="both">Both</option>
        <option value="meaning">Meaning Only</option>
        <option value="kanji">Kanji Only</option>
    `;
        questionTypeSelect.value = questionType;
        questionTypeSelect.onchange = () => {
            questionType = questionTypeSelect.value;
        };
        questionTypeContainer.appendChild(questionTypeSelect);

        buttonContainerTop.appendChild(questionTypeContainer);
        levelSelectionContainer.appendChild(buttonContainerTop);

        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
        gridContainer.style.gap = '10px';
        gridContainer.style.paddingBottom = '50px'; // Add padding to avoid overlap with buttons

        for (let level = 1; level <= maxLevel; level++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `level-${level}`;
            checkbox.value = level;
            if (previouslySelectedLevels.includes(level)) {
                checkbox.checked = true;
            }
            const label = document.createElement('label');
            label.htmlFor = `level-${level}`;
            label.textContent = `Level ${level}`;
            const levelContainer = document.createElement('div');
            levelContainer.appendChild(checkbox);
            levelContainer.appendChild(label);
            gridContainer.appendChild(levelContainer);
        }

        levelSelectionContainer.appendChild(gridContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.bottom = '10px';
        buttonContainer.style.left = '10px';
        buttonContainer.style.right = '10px';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = () => {
            levelSelectionContainer.remove();
        };
        buttonContainer.appendChild(closeButton);

        const startQuizButton = document.createElement('button');
        startQuizButton.textContent = 'Start Quiz';
        startQuizButton.onclick = async () => {
            previouslySelectedLevels = [];
            for (let level = 1; level <= maxLevel; level++) {
                if (document.getElementById(`level-${level}`).checked) {
                    previouslySelectedLevels.push(level);
                }
            }
            if (previouslySelectedLevels.length > 0) {
                const selectedKanji = await fetchKanji(previouslySelectedLevels);
                levelSelectionContainer.remove();
                incorrectKanjiQueue = []; // Reset the incorrect queue
                createQuiz(selectedKanji, selectedKanji.slice());
            } else {
                alert('Please select at least one level.');
            }
        };
        buttonContainer.appendChild(startQuizButton);

        levelSelectionContainer.appendChild(buttonContainer);

        document.body.appendChild(levelSelectionContainer);
    }

    // Helper function to find similar kanji
    function findSimilarKanji(targetKanji, allKanjiData) {
        const targetChar = targetKanji.data.characters;

        if (similarKanjiDict[targetChar]) {
            const similarKanjiEntries = similarKanjiDict[targetChar].similar;
            return similarKanjiEntries.map(entry => ({
                characters: entry.kanji,
                meanings: [{ meaning: entry.meaning }]
            }));
        } else {
            return [];
        }
    }

    // Create multiple-choice questions
    function createQuiz(kanjiData, allKanjiData) {
        if (kanjiData.length === 0 && incorrectKanjiQueue.length === 0) {
            alert('Quiz complete!');
            return;
        }

        const quizContainer = document.createElement('div');
        quizContainer.id = 'wanikani-quiz';
        quizContainer.style.position = 'fixed';
        quizContainer.style.top = '50%';
        quizContainer.style.left = '50%';
        quizContainer.style.transform = 'translate(-50%, -50%)';
        quizContainer.style.padding = '20px';
        quizContainer.style.backgroundColor = 'white';
        quizContainer.style.border = '1px solid black';
        quizContainer.style.zIndex = 1000;
        quizContainer.style.width = '50vw'; // Increase quiz window size
        quizContainer.style.height = '50vh'; // Increase quiz window size

        const currentKanji = kanjiData.length > 0 ? kanjiData.shift() : incorrectKanjiQueue.shift();
        const question = document.createElement('p');
        question.style.fontSize = '3em'; // Increase question font size
        question.style.textAlign = 'center';
        question.style.marginBottom = '20px'; // Add margin to move question up

        const correctAnswer = questionType === 'both'
        ? (Math.random() > 0.5 ? currentKanji.data.meanings[0].meaning : currentKanji.data.characters)
        : (questionType === 'meaning' ? currentKanji.data.meanings[0].meaning : currentKanji.data.characters);
        const isMeaningQuestion = correctAnswer === currentKanji.data.meanings[0].meaning;

        question.textContent = isMeaningQuestion ? `${currentKanji.data.characters}` : `${currentKanji.data.meanings[0].meaning}`;
        quizContainer.appendChild(question);

        const choices = [correctAnswer];

        let similarKanji = findSimilarKanji(currentKanji, allKanjiData);
        while (choices.length < 4 && similarKanji.length > 0) {
            const randomChoice = isMeaningQuestion ? similarKanji.shift().meanings[0].meaning : similarKanji.shift().characters;
            if (!choices.includes(randomChoice)) {
                choices.push(randomChoice);
            }
        }

        while (choices.length < 4) {
            const randomChoice = isMeaningQuestion
            ? allKanjiData[Math.floor(Math.random() * allKanjiData.length)].data.meanings[0].meaning
            : allKanjiData[Math.floor(Math.random() * allKanjiData.length)].data.characters;
            if (!choices.includes(randomChoice)) {
                choices.push(randomChoice);
            }
        }

        choices.sort(() => Math.random() - 0.5);

        const choicesContainer = document.createElement('div');
        choicesContainer.style.display = 'grid';
        choicesContainer.style.gridTemplateColumns = '1fr 1fr';
        choicesContainer.style.gridTemplateRows = '1fr 1fr';
        choicesContainer.style.gap = '10px';
        choicesContainer.style.height = 'calc(100% - 120px)'; // Adjust height to fit buttons and added margin

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.style.width = '100%';
            button.style.height = '100%';
            button.style.fontSize = '3em'; // Increase button font size
            button.onclick = () => {
                if (choice === correctAnswer) {
                    quizContainer.remove();
                    createQuiz(kanjiData, allKanjiData);
                } else {
                    button.style.backgroundColor = 'red';
                    if (!incorrectKanjiQueue.includes(currentKanji)) {
                        incorrectKanjiQueue.push(currentKanji);
                    }
                }
            };
            choicesContainer.appendChild(button);
        });

        quizContainer.appendChild(choicesContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.bottom = '10px';
        buttonContainer.style.left = '10px';
        buttonContainer.style.right = '10px';

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Level Selection';
        backButton.onclick = async () => {
            quizContainer.remove();
            const maxLevel = await fetchUserMaxLevel();
            createLevelSelection(maxLevel);
        };
        buttonContainer.appendChild(backButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = () => {
            quizContainer.remove();
        };
        buttonContainer.appendChild(closeButton);

        quizContainer.appendChild(buttonContainer);

        document.body.appendChild(quizContainer);
    }

    // Add button to WaniKani account section
    async function addQuizButtonToAccountSection() {
        const accountSection = document.querySelector('ul.sitemap__pages.sitemap__pages--kanji');

        if (accountSection) {
            const quizMenuItem = document.createElement('li');
            quizMenuItem.className = 'sitemap__pages-item';
            const quizLink = document.createElement('a');
            quizLink.href = '#';
            quizLink.textContent = 'Start Kanji Quiz';
            quizLink.style.color = 'white'; // Set the text color to white
            quizLink.onclick = async (e) => {
                e.preventDefault();
                const maxLevel = await fetchUserMaxLevel();
                createLevelSelection(maxLevel);
            };
            quizMenuItem.appendChild(quizLink);
            accountSection.appendChild(quizMenuItem);
        }
    }

    // Initialize the script
    (function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addQuizButtonToAccountSection);
        } else {
            addQuizButtonToAccountSection();
        }
    })();
 })();