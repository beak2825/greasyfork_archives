// ==UserScript==
// @name         FA Quick Safemode
// @namespace    FurAffinity
// @version      1.0
// @description  Hides thumbnails of non-general rated artwork, can be used when in public without needing to edit account settings.
// @author       JaysonHusky
// @grant        none
// @run-at       document-end
// @match        *://www.furaffinity.net/*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/26765/FA%20Quick%20Safemode.user.js
// @updateURL https://update.greasyfork.org/scripts/26765/FA%20Quick%20Safemode.meta.js
// ==/UserScript==
(function() {
    'use strict';
        $('figure.r-mature b u a img').each(function(){
            $(this).attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPTSURBVHhe7ZpRcusgDEW7rizI68lqspkupg8BEgKDw20hL9Pe81MZSyCdJo0n048vMg1lAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAayW9Xm/fSjHIy8uRPbfse8US2U9DmcoakPn+q8unrJQVqVKkMlv9898NcVfkXVyVRFfZxHVF73cdTmuyhblKmALgbS32eyUR0oJ+HuaYKmsYXtOpIVRX66oFnPiqSrmVrJO5RJpEy5cxUtktQpsbC2oFFimx1dZ5qlc0vr1S3jJ27DyqJN5L5UCt4lcGmdZp3JB+ki4jdaw8w+8rbTD1GMHhgrM8amqW+45t/NjFsqKPZfx/JVr3MLutBLoDk3RjKxB+SpWyhLiWBnfqoyR0GG602qejZ643R85wzL75b4BPWgdq2X9aigLgLIAKAuAsgAoC2BOlv9AL6RP6WZxA+F0/xggx148FoTb47v+IQNnXtbt1pwjXbVrFT/rzKhdxU2PY7zxnKxv9TYvS74PaX7B8SuS3bLCLq2rx9XO7yFLWixtiKuq6bBgyJpdxxqfabFseBzyDk+3rEQzhcdxchWCVkkpDa+6yxMlqHubBpElP3T3cFxayA3J8SmK4bhdH0vQyZDIpkgHZcKFa6BMWk6PW45PPwcIkCz5mTrMI/SP1Dn83W4sgU5cbVVM5IMSZTld6K12fXz6OUDAZEkgnegI/kiJjXG7Ph6WB9L0epDQZgi2zTvKSq089AVWnW39Xrbr41GC0bqqE2QlHqQHRt5IlvQSyL3Zuqz6BGvXhigZspzCqmN3oWH4abfdCYWwGA9oNk+HXp4ogfU2Cywr9qDHlPXYT6R896SLTcbtfu+8iwXZOqfI/uG2zaNaGkyI7h43z5mXJ+ab/vinzMkiEcoCoCwAygKgLADKAtgmyz63A9Dn8xuzR1Z5HgxEbaiv8kCE8L2qaXbIqlQJMkPvkfKCvyLr5KpC5kmovjjhk3/UKiu681TVYvbIGnbrRFoY9eWKatGMlwuJUurzqvW8VlY1jOYVAS7BZ36vagOvfRtWHnUyP2F3bIk9JuuyagMv+QNvK9Uw/jWii92xuwqeVm1gh6zYc3kJ+Svn0cLh2NUOOaNKuK5azxZZgrhQdChB5knoVN2xNU9v2HZQ1WK2yfqNUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUNY0X1//AK+CMC+ywA8CAAAAAElFTkSuQmCC");
        });
        $('figure.r-adult b u a img').each(function(){
            $(this).attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPTSURBVHhe7ZpRcusgDEW7rizI68lqspkupg8BEgKDw20hL9Pe81MZSyCdJo0n048vMg1lAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAayW9Xm/fSjHIy8uRPbfse8US2U9DmcoakPn+q8unrJQVqVKkMlv9898NcVfkXVyVRFfZxHVF73cdTmuyhblKmALgbS32eyUR0oJ+HuaYKmsYXtOpIVRX66oFnPiqSrmVrJO5RJpEy5cxUtktQpsbC2oFFimx1dZ5qlc0vr1S3jJ27DyqJN5L5UCt4lcGmdZp3JB+ki4jdaw8w+8rbTD1GMHhgrM8amqW+45t/NjFsqKPZfx/JVr3MLutBLoDk3RjKxB+SpWyhLiWBnfqoyR0GG602qejZ643R85wzL75b4BPWgdq2X9aigLgLIAKAuAsgAoC2BOlv9AL6RP6WZxA+F0/xggx148FoTb47v+IQNnXtbt1pwjXbVrFT/rzKhdxU2PY7zxnKxv9TYvS74PaX7B8SuS3bLCLq2rx9XO7yFLWixtiKuq6bBgyJpdxxqfabFseBzyDk+3rEQzhcdxchWCVkkpDa+6yxMlqHubBpElP3T3cFxayA3J8SmK4bhdH0vQyZDIpkgHZcKFa6BMWk6PW45PPwcIkCz5mTrMI/SP1Dn83W4sgU5cbVVM5IMSZTld6K12fXz6OUDAZEkgnegI/kiJjXG7Ph6WB9L0epDQZgi2zTvKSq089AVWnW39Xrbr41GC0bqqE2QlHqQHRt5IlvQSyL3Zuqz6BGvXhigZspzCqmN3oWH4abfdCYWwGA9oNk+HXp4ogfU2Cywr9qDHlPXYT6R896SLTcbtfu+8iwXZOqfI/uG2zaNaGkyI7h43z5mXJ+ab/vinzMkiEcoCoCwAygKgLADKAtgmyz63A9Dn8xuzR1Z5HgxEbaiv8kCE8L2qaXbIqlQJMkPvkfKCvyLr5KpC5kmovjjhk3/UKiu681TVYvbIGnbrRFoY9eWKatGMlwuJUurzqvW8VlY1jOYVAS7BZ36vagOvfRtWHnUyP2F3bIk9JuuyagMv+QNvK9Uw/jWii92xuwqeVm1gh6zYc3kJ+Svn0cLh2NUOOaNKuK5azxZZgrhQdChB5knoVN2xNU9v2HZQ1WK2yfqNUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUBYAZQFQFgBlAVAWAGUBUNY0X1//AK+CMC+ywA8CAAAAAElFTkSuQmCC");
        });
})();