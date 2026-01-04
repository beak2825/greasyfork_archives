// ==UserScript==
// @name        DuoCheat Bot auto command executer(xp farm)
// @namespace   Private Scripts
// @match       https://discord.com/channels/@me/1250105099573923992*
// @grant       none
// @version     1.0
// @author      -
// @description 6/21/2024, 12:35:36 PM
// @downloadURL https://update.greasyfork.org/scripts/498506/DuoCheat%20Bot%20auto%20command%20executer%28xp%20farm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498506/DuoCheat%20Bot%20auto%20command%20executer%28xp%20farm%29.meta.js
// ==/UserScript==
fetch("https://discord.com/api/v9/interactions", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "MTEyMjE0NzU4MTE4Nzg2NjY2MA.G6Dfnw.5H67ce6HUvqV_uHMExJM0sbYru7DmGL34xnD04",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryRyWkREPYByc7dAKo",
    "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-debug-options": "bugReporterEnabled",
    "x-discord-locale": "en-US",
    "x-discord-timezone": "Asia/Calcutta",
    "x-super-properties": "eyJvcyI6IkFuZHJvaWQiLCJicm93c2VyIjoiQW5kcm9pZCBDaHJvbWUiLCJkZXZpY2UiOiJBbmRyb2lkIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI0LjAuMC4wIFNhZmFyaS81MzcuMzYiLCJicm93c2VyX3ZlcnNpb24iOiIxMjQuMC4wLjAiLCJvc192ZXJzaW9uIjoiIiwicmVmZXJyZXIiOiJodHRwczovL3d3dy5kdW9saW5nby5jb20vIiwicmVmZXJyaW5nX2RvbWFpbiI6Ind3dy5kdW9saW5nby5jb20iLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzAzNTU3LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsLCJkZXNpZ25faWQiOjB9",
    "cookie": "__Secure-recent_mfa=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3MTg5NDM2NjUsIm5iZiI6MTcxODk0MzY2NSwiZXhwIjoxNzE4OTQzOTY1LCJpc3MiOiJ1cm46ZGlzY29yZC1hcGkiLCJhdWQiOiJ1cm46ZGlzY29yZC1tZmEtcmVwcm9tcHQiLCJ1c2VyIjoxMTIyMTQ3NTgxMTg3ODY2NjYwfQ.ybz2-YMEDvYjPaSIKM7kLLn6JltXh3uQV0v2ascS0Gunoy0m_Gkh2XOOau3Om6uC8evWoVUUB8rePP-yahgqfA; __dcfduid=e438d2501fdc11efbe54af6de74c9eb6; __sdcfduid=e438d2511fdc11efbe54af6de74c9eb626b938a15f8adcbca45dc24db4e33be76827e10a762e9c4120837a3718efa627; OptanonConsent=isIABGlobal=false&datestamp=Tue+Jun+18+2024+21%3A56%3A15+GMT%2B0530+(India+Standard+Time)&version=6.33.0&hosts=&landingPath=https%3A%2F%2Fdiscord.com%2Fblog%2Fwelcome-to-the-new-era-of-discord-apps%3Fref%3Dbadge&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1; __stripe_mid=926adb79-3f8a-4a43-b44d-a371ec253ecb4a7c64; cf_clearance=ck6hcD47n5bJStVphRERWS7wCOsH_KZr6p1n1ZTY1I8-1718943726-1.0.1.1-r4D8LqGCHbFA16vhfT58An4OWEjHFaZkAbY1pKV08rjO9BTLxKGtwHL1o88sC7hZntKHFZWEKiXXm3GxtOYXtg; __cfruid=46539b40eacd6b43d9686650be2f5631016d7814-1718944042; _cfuvid=wRhrjJHGvwd_8vXNJJ43VUI04_ztgGSKkh7cHLMpm74-1718944042300-0.0.1.1-604800000",
    "Referer": "https://discord.com/channels/@me/1250105099573923992",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "------WebKitFormBoundaryRyWkREPYByc7dAKo\r\nContent-Disposition: form-data; name=\"payload_json\"\r\n\r\n{\"type\":2,\"application_id\":\"1130169827831586936\",\"channel_id\":\"1250105099573923992\",\"session_id\":\"152d0088f25aaf1de937bd158ba59b50\",\"data\":{\"version\":\"1247675083460186237\",\"id\":\"1246267751618580650\",\"name\":\"duolingoxpfarm\",\"type\":1,\"options\":[],\"application_command\":{\"id\":\"1246267751618580650\",\"type\":1,\"application_id\":\"1130169827831586936\",\"version\":\"1247675083460186237\",\"name\":\"duolingoxpfarm\",\"description\":\"gives you tons of XP and will get you #1 on the leaderboard in seconds\",\"dm_permission\":true,\"integration_types\":[0],\"global_popularity_rank\":1,\"options\":[],\"description_localized\":\"gives you tons of XP and will get you #1 on the leaderboard in seconds\",\"name_localized\":\"duolingoxpfarm\"},\"attachments\":[]},\"nonce\":\"1253566921853370368\",\"analytics_location\":\"slash_ui\"}\r\n------WebKitFormBoundaryRyWkREPYByc7dAKo--\r\n",
  "method": "POST"
});