{
  "version":"0.1.3",
  "compilerOptions": "中文",
  "script":[
    {
      "code":"bd",
      "name":"baidu",
      "description":"baidu error",
      "match":[
        "\\bhttps://www.baidu.com/search/error.html"
      ],
      "require":[
        {
          "url":"https://greasyfork.org/scripts/374681-matchtest/code/matchTest.js",
          "file":"bde.sc"
        }
      ]
    } ,  {
      "code":"033newaudit",
      "name":"BG_NewAudit",
      "description":"bg new audit",
      "match":[
        "\\bhttp.*//global-oss.*\\.bigo(|app)\\.tv(|:[0-9]*)/bigoAudit/live-(first|final)/index"
      ],
      "require":[
        {
          "url":"https://greasyfork.org/scripts/374762-033-newaudit/code/033-NewAudit.js",
          "file":"033newaudit.sc"
        }
      ]
    }
  ]
}