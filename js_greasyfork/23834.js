// ==UserScript==
// @name         Gab.ai User Stats
// @namespace    http://gab.ai/Jeremy20_9
// @version      0.1
// @description  Profile a user's timeline by clicking a button that appears on user pages
// @author       Jeremiah 20:9
// @match        https://gab.ai/*
// @exclude      https://gab.ai/self-censor
// @exclude      https://gab.ai/notifications
// @exclude      https://gab.ai/home
// @exclude      https://gab.ai/popular
// @exclude      https://gab.ai/pulse
// @exclude      https://gab.ai/following
// @exclude      https://gab.ai/followers
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23834/Gabai%20User%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/23834/Gabai%20User%20Stats.meta.js
// ==/UserScript==

$(document).ready(function(){
    var btndiv = document.createElement("div");
    $(btndiv).click(function(){
        var numfollowers = user.follower_count;
        var numfollowing = user.following_count;
        var numposts = user.post_count;

        var introduction = "";
        var rextags = /#[A-Za-z0-9_]+/gmi;
        var rexats = /@[A-Za-z0-9_]+/gmi;

        var plist = (postlist.posts.length > 0) ? postlist.posts : userpostlist.posts;
        var mentions = 0;
        var replies = 0;
        var reposts = 0;
        var replyreposts = 0;
        var regularposts = 0;
        var totalposts = plist.length;
        var tags = {};
        var ats = {};
        var votetotal = 0;
        var gifposts = 0;
        var linkposts = 0;
        var textposts = 0;
        var days = new Array(7);

        days[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        days[1] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        days[2] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        days[3] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        days[4] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        days[5] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        days[6] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        for(var p in plist)
        {
            var body = plist[p].post.body;


            var rexgif = /giphy\.com\/media\/\w+\/[\w-_]+\.gif/gmi;

            if(plist[p].post.embed.html)
            {
                if(rexgif.test(plist[p].post.embed.html))
                    gifposts++;
                else
                    linkposts++;
            }
            else
            {
                textposts++;
            }

            // gather tags
            var m = rextags.exec(body);
            var posttextval = body;
            while(m && m.length > 0)
            {
                var ttext = m[0].toLowerCase();
                if(tags[ttext] === undefined)
                    tags[ttext] = 1;
                else
                    tags[ttext]++;

                posttextval = posttextval.substr(m.index + m[0].length);
                m = rextags.exec(posttextval);
            }

            var cdate = Date.parse(plist[p].post.created_at);
            cdate = new Date(cdate);
            var day = cdate.getDay();
            var hour = cdate.getHours();
            days[day][hour]++;

            var type = null;
            if(plist[p].type == "repost" && !plist[p].post.is_reply)
            {
                type = "repost";
                reposts++;
            }
            else if(plist[p].type == "repost" && plist[p].post.is_reply)
            {
                type = "replyrepost";
                replyreposts++;
            }
            else if(plist[p].post.is_reply)
            {
                type = "reply";
                replies++;
            }
            else if(body.indexOf("@") === 0)
            {
                type = "mention";
                mentions++;
            }
            else
            {
                regularposts++;
                type = "post";
            }

            if(type == "post" && /#introduceyourself/gmi.test(body))
            {
                introduction = body;
            }
            if(type == "post" || type == "mention" || type == "reply")
            {
                m = rexats.exec(body);
                posttextval = body;
                while(m && m.length > 0)
                {
                    var atext = m[0].toLowerCase();
                    if(ats[atext] === undefined)
                        ats[atext] = 1;
                    else
                        ats[atext]++;

                    posttextval = posttextval.substr(m.index + m[0].length);
                    m = rexats.exec(posttextval);
                }
            }
            if(type == "post")
                votetotal += plist[p].post.score;
        }

        var message = "";

        if(introduction !== "")
            message += "Introduction:\n" + introduction + "\n\n";

        var percregposts = Math.round(100 * (regularposts / totalposts));
        var percreposts = Math.round(100 * (reposts / totalposts));
        var percreplies = Math.round(100 * (replies / totalposts));
        var percreplyreposts = Math.round(100 * (replyreposts / totalposts));
        var percmentions = Math.round(100 * (mentions / totalposts));

        message += "Post Distribution:\n";
        message += Math.round(100 * (regularposts / totalposts)) + "% posts\n";
        message += Math.round(100 * (reposts / totalposts)) + "% reposts\n";
        message += Math.round(100 * (replies / totalposts)) + "% replies\n";
        message += Math.round(100 * (replyreposts / totalposts)) + "% reply reposts\n";
        message += Math.round(100 * (mentions / totalposts)) + "% mentions\n";
        message += "\n\n";

        message += "Content Distribution:\n";
        message += Math.round(100 * (textposts / totalposts)) + "% text posts\n";
        message += Math.round(100 * (linkposts / totalposts)) + "% link posts\n";
        message += Math.round(100 * (gifposts / totalposts)) + "% gif posts\n";
        message += "\n\n";

        message += "Schedule:\n";
        var daynames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for(var d = 0; d < days.length; d++)
        {
            var daystr = daynames[d][0] + "";
            var daytotal = 0;
            for(var h = 0; h < days[d].length; h++)
            {
                if(days[d][h] === 0)
                    daystr += "▁";
                else if(days[d][h] > 0 && days[d][h] <= 2)
                    daystr += "▃";
                else if(days[d][h] > 2 && days[d][h] <= 6)
                    daystr += "▅";
                else if(days[d][h] > 6)
                    daystr += "█";
                daytotal += days[d][h];
            }
            daystr += "\n";
            message += daystr;
        }
        message += "\n\n";

        message += "Avg Score: " + Math.round(votetotal/regularposts) + " per " + regularposts + " posts\n\n";

        var sorttags = [];
        for(var t in tags)
        {
            sorttags.push({tag:t, count:tags[t]});
        }
        if(sorttags.length > 0)
        {
            message += "Top Tags:\n";
            sorttags.sort(sortobjs);
            for(var tt = 0; tt < Math.min(sorttags.length,5); tt++)
            {
                message += sorttags[tt].tag + ": " + sorttags[tt].count + "\n";
            }
        }

        message += "\n";

        var sortmentions = [];
        for(var a in ats)
        {
            sortmentions.push({at:a, count:ats[a]});
        }
        if(sortmentions.length > 0)
        {
            message += "Top Mentions:\n";
            sortmentions.sort(sortobjs);
            for(var aa = 0; aa < Math.min(sortmentions.length,10); aa++)
            {
                message += sortmentions[aa].at + ": " + sortmentions[aa].count + "\n";
            }
        }

        alert(message);
    });
    var styling = "float: right; display: inline-block; background: #e14283; color: white; padding: 5px 20px; text-transform: uppercase; letter-spacing: 3px; margin-top: 5px; margin-right: 10px; border-radius: 3px; text-decoration: none; -webkit-transition: background .2s, opacity .2s; transition: background .2s, opacity .2s;";
    $(btndiv).html('<a style="position:fixed; bottom:10px; right:10px; ' +styling + '" href="#" class="composer__content__button"><span>Profile User</span></a>');
    $(document.body).append(btndiv);
});

function sortobjs(a,b) {
    if (a.count > b.count)
        return -1;
    if (a.count < b.count)
        return 1;
    return 0;
}
