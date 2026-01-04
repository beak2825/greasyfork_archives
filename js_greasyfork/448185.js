// ==UserScript==
// @name         dirsearch.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dirsearch js版
// @author       wuuconix
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuuconix.link
// @grant        none
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/448185/dirsearchjs.user.js
// @updateURL https://update.greasyfork.org/scripts/448185/dirsearchjs.meta.js
// ==/UserScript==

const dict = `/swagger-resources
/v2/api-docs
/api/v1
/%3f/
/readme.txt
/readme.md
/robots.txt
/swagger.yaml
/swagger.json
/uploadify/index.php
/sonar
/monitoring
/gateway
/test
/.vscode/sftp.json
/.idea/workspace.xml
/.idea/compiler.xml
/.idea/vcs.xml
/.idea/modules.xml
/.idea/inspectionProfiles/Project_Default.xml
/error.log
/config.json
/wp-json
/wp-json/wp/v2/users
/api-docs
/arthubdam.zip
/setup.php
/content
/v3/api-docs
/v2/api-docs
/v1/api-docs
/.svn/wc.db
/actuator
/api/index.html`.split("\n")

window.search = () => {
    dict.forEach(pathname => {
        const url = `${location.origin}${pathname}`
        fetch(url).then(res => {
            res.ok && console.log(url)
        }).catch(() => {})
    })
}
