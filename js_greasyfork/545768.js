// ==UserScript==
// @name         Magnifying glass favicon for Google Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change Google Search favicon to magnifying glass icon
// @author       emvaized
// @license      MIT
// @match        https://www.google.com/search*
// @match        https://www.google.*.*/search*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545768/Magnifying%20glass%20favicon%20for%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/545768/Magnifying%20glass%20favicon%20for%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /// Source of favicon: https://www.freepik.com/icon/search_3128287
    const newFaviconURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAPJSURBVFhH7ZZdSBRRFMfvvbMfuetHplBRCVtpJSSBtvYSW1IQlWCRvviY0LNBEWiIfRBGiA8+Bj5ERBlpFpEU2iaFVvYSWbRGUA9q9rGrrubOzr2d655dd9yd/SCkHvrBsPd/Zuae/9xz5s6S//xtKP4mRLwqtQV+/qokhO0BVaRNKHZvR8asEMQDM7hNQWvPard7Bi9Pi4QG+IPN1oA54xSl4iQlNBfDRB1n2lSHTUEJnogPZmpT/aKlYHBwDqMpYWhgrrfEQZnoZpSUYChCjIFFRoKUV214PORBnRSGvzpkcoXxgTjJfwgieuGRb8BTP4TjO8bDFCuCDXzdV16IOikxKyCXPWjOeAFnIskFIZ8JJ2csnyy36YlhFcOk3+UybVECVTC8TClxhKKAIO+4LVC27v7wLEYMiTHw69H2Rnjy8yhl8mcWK6mku9/8xFAMH/eV5mRwSzeYgCZFqLiw9vHgWVSG6AyM9ZbY8xT+BcLhhvtstpIdiZKH+XbAma2q7DXcu0lqKNW0xczX5z98MbVwgQG6HljFtMNRyYmAZU8luUQm4oKcQglPRrMCKjuC0hB9EzL5nkf4IWuO45R4lrehB0o2gRKg0fPFRW+AiyIcSV5GN1wq1HR2arD2QygB3Xxx0RnwBFfYPwStWuhYMYnhtDjnbJ1sdrZq8jjnbLNh2BCdgTqvY7bOu1GRx3GvIx/DaTG6clv+6MpiJXRsTfoa6ktARWQHg9djp6vfZUKZEk1NgkEPlKOUJN0RdQYopU9wKMkLTKxJ2sXRPM+cOgRzrEEJLSDcODJEZ8BCyT1oIh9KuF+0lN6qzkGZEFe7yBRcXEEp7/WrVtKF0hCdAXdN5wxsIG0oZR0cJo3eTWZCJjf7p+7ADdFd3+6uz/Xi2BB9DwDwBWyBn7chJctCXCaNvN5189iR6lvVui+grPn+S75Ks983DHJ/KApPD1uYwslVlAmJ+zkuv360kCqmpzBcrOcCAjYZOsTmCyZtY435glInTLAWT+qAEry3MtPeB6czxzEUl7gGJCETyl24ZBuGIoABzTZ+Nub/gHxy2IIjq5qKiZgShBmqveNRfXNlMMsF+Os1jeG4wHm/bFjIXgRiBMPyrdo6z4P9By/PLFnJRQxXIBrntdpsZlarCOd7YdkLmVpgt481yU3GAwndqpV3hRuu4uL0aqZofZC9WGpJopVIyUC6pGNiWQxIUjVh2AN/Sl9D1gTXlIqlPREQWj3KBZbNgCTGhCA31dnshoUxsmwliEaWgyq8PjiX3ehupkEM/+dfgJDfi9mDBGa2CkwAAAAASUVORK5CYII=";

    function setFavicon(url) {
        /// Remove original favicon
        document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());

        /// Create new favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = url;
        document.head.appendChild(link);
    }

    // Apply on load of the page
    setFavicon(newFaviconURL);

    /// For dynamic changes of the DOM (Google sometimes redraws the HEAD)
    /// [disabled for better performance]
    /*
    const observer = new MutationObserver(() => {
        if (!document.querySelector(`link[href="${newFaviconURL}"]`)) {
            setFavicon(newFaviconURL);
        }
    });

    observer.observe(document.head, { childList: true });
    */
})();