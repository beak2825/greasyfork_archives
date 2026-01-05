
// ==UserScript==
// @name        CPasBien Remove torrent9.tv Ads
// @description Remouve Ads for torrent9.tv from right side
// @namespace   https://greasyfork.org/fr/users/11667-aymeric-maitre
// @include     http*://*cpasbien.*/*
// @version     1.0
// @grant       none
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAROSURBVEhLdVVNaBxlGH5mZ/9/sj9pkzYR09iWioJCBSEF0fQiPXmo+HProai3gCDqLQjiwYIFPVkUBRGLIurBgx5EChURDyIBJeBPU6NJJ242O7szOzs74/N8zqxrjR987Mz3vfO8z/u8P2stLy/H+J+li6EFBJaFkDviO1+R4c5HMfJxDJvPMX8t3qdrGASw9gNOAbt2Bid7Pk7v9XBnf4ByJGjgej6HbyolfFavYC9rY2rEc4JnMhkEgwEG/uC/wALdI+AdBFq9vo0jwRCDhHGckLIJIrZ6fb9Zx8XD0yjyOfJ9BASVg38xFuiubeOxnTae2dwxDoZJiALRlk2qnd6rZLudz+Lx+QPoDUMUE3vJNV4K/eGdXTz9mwOHzwPdkFlpNEI5HCHQO7WdCkNkKcuId52MhToBL1/bQpN3YYI2ZqwkzQQh3lnfMExjes7RUPzePtjE580aXIYoJouDAOe22ri318cez7Rmyfy1RgWX6lWUpbchxe1mbKxsOuiTwYhOMrzs8vmREwt4d6ZJZ7YxVqTrhTxWjs7jlQN1NAjYIIHXmchXG1WU+J2WAVauDw2HuIsMPH6o8rEZ6pPHboFPRhV+eJiJ6eZyDNVCQdq6PbxVyuOlVg3vVYu40KwaKdKiM8BK0N2uJzmpGyUYxfioNQUnlzXZ75Dt5atXzW6RwBadDlgtLdp/XCvjAm1bE6BjxiMC3+b5LCuyt2Jk4whfNGooGY0ZFlnfKBZx3HXxyZUreGFtDZ6dRcDzAh1Xk9KbLISxxiVl2SQ9NlK40jTRy5xNfHXWcbD29Ve4vd83HbnfMsC68tSyiRTSscykqDKkj01mcja5nj12HGuVCqPbfyIYYJt8rhUKZCiwCD7xljpdJs6CRVCPSS2zdrXemJvDiaVT+HR6mlJFnCN/k7oZ3gBnSfV7JoGwhrVHwDM3dk01dPsebPb/B7OzuP/kPXh54QjqdKK5oXI8xVnyUKfHBDOqiZASxsBGMY/1Elmre2ghJ6s//gKfXSeji7cuoEfdBarybBNIoM9vt/HUTofgLrvwH3B7cXFxVRrbBPupVMSDThsDMgmJ1iDomW4fmzkbDqeYWj6isZri3J8dnOfuEkxN9YDbN/c/FAvIKm/p2FRyeqzbR393cPYPx4SmNtMkqzBsta7LMyWrFUbGga/kcutMds/NHcQGMXIq0VQWDeoqB82b7PcP2Z5mxlKWIQ12kxCrBCzyzCXDfjL487STdCvzM/iZc1qg4wYxT2LAJqn4AS5NN/DioRZBWfyUQ5NMZTcyyeWA4S7wrEYi37Ktn1iYxTaZpnPCwBkpBNr3EbJdxVxbYYY8v48aL/U8HOVEk7aagpucGd8xH1+ykn4lyyqd6C9qclnLp5djjx+OmG21rpbKJh3q+r9Trartx/95NMgl/yIC3K/3Mh6zGamkki5LQRN1zCyoUVexbXE3uetkqJlrsn8T0/T1L0FzJBUnKOxtAAAAAElFTkSuQmCC
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/20254/CPasBien%20Remove%20torrent9tv%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/20254/CPasBien%20Remove%20torrent9tv%20Ads.meta.js
// ==/UserScript==

this.jQuery = jQuery.noConflict(true);

jQuery(document).ready(function() {

  jQuery('a.cover').each(function () {
    try {
      var keyword = jQuery(this).attr("href").search("torrent9");
      if (keyword != -1)
        jQuery(this).hide();
    } catch(e) {
      console.error(e);
    }
  });
});