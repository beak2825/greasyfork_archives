/*
 *  @name         Get User Hash
 *  @namespace    pxgamer
 *  @version      0.2.1
 *  @description  Get any user's hash, for various activities
 *  @author       pxgamer
 */

function guh(username) {
        let re = /<a href="\/bookmarks\/[a-z]+\/[a-z]+\/([a-z0-9]+)\/" class="[a-z]+Link kaButton smallButton normalText"><i class="ka ka-bookmark"><\/i>/ig, matches, ret = [];
        $.ajax({
            type: "GET",
            url: "/user/"+encodeURIComponent(username)+"/",
            async: false,
            success: function (data) {
                while (matches = re.exec(data.html)) {
                    ret.push(matches[1]);
                }
            },
            returnData: "json"
        });
        console.log(ret[0]);
        return ret[0];
    }