// ==UserScript==
// @name         Google Map to WME
// @description  Shows a Waze icon in Google Maps page. When clicked, opens WME on the same Google Map location, zoom and language.
// @namespace    https://greasyfork.org/users/gad_m/google_map_to_wme
// @version      1.1.1
// @author       gad_m
// @license      MIT
// @include      /^https:\/\/www\.google\.[a-z.]+\/maps.*/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAQAAAAABUjGyuAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAAGGUlEQVR4Ae1bXUwcVRQ+A5g0Kj+J0UjYxEGlKZhofxKWRDHbxGpSXkxb609ICvpQLRZqFOpfQhtKAPvQArEVE5fVEG0sJfWFRNsE0r7solX6YDGtxjUshtik0gVNjCzj/e4wy+xm784OzMzuyt5kmTt37px7vu/+nHPPXIhyKcdAjoEcAzkG1i8D0v8BuizLJZRX0E6K9CyREiSloDEY/CmYCrasJ0CWN8kkRcYYcFkHeI6RsT0YvDGpK0uYzUtYmiWFevAul4sGPjpFLS0HoX0JScqYLFdszhIo5tUEeLm84le5/GHliVqPMj0dUrR04mSvgnL2+9OIhHzzTaf/DX3PF5e6aOTMELlcZVHFamrcPB8ITGwgiV4oKbnn67m5W7PRCrpM1hGgB59/n4s2tA9RcWkZbSvUoWJZkBAOh2ly8ipIKGUEnImtod5l1RoQD77oyBDl3VtGH/9OtPlxD9U+6aFQKBTFuWf3Li3/gJaJv2YNASLwGqCFiMTAz9CLL9VzEkDE/lcPqI8lSWgNssIMGoEHyqWbMxQ+Uk+RP0LR9QCEEEnML8hnJjGxX5DxBKQCXu3mWBLUsuTgUSejp4AZ8CpghZgpVLMGPb9cia2PGZrMgl+6GaLb7fV8KhgNez3klAiQNzF389+IR/+ipflI/rh+jjoFHhgKkgFRFVkcpH8WPcnqrfmZtDjHhu4bkDM6OkpNrx9qh28PO6+ZOlEbq+15TZ6QgJVeILnwriLaUlVNd7NrfJplq+/3PwbYyuuiGnd1/OOU7iurKktYxUGYrq7uD1hWISfAQzkhAZQXYdtLRa6QK6mfORwgIVEaHR/hBLgZ+OPHexJVSakM4FUbPuMYeCgmtgIKeVDh3aYeIXg8tyKlCzx0FxOwvL/eyEaAnSmd4A0IsBO2Kjvd4NNKQCaAXzMBs8z5uDxxwfRQyRTwUFxsBZLAgtnznu2nH9h1NckfmOA7N7x7Z8N7fEsrkqO38zC177zderSuri4oqm+2PGUCFv4KE0zepW8vRoEXFRVRVVUl+f3miAgEVuovfHiYOzsFCRbbePBffB4b+TELNlH9JFZArQ7gn7De3tO0nXp9nRw8gCP4ePnSGO1eCTokkp+w7Nq1KV7+9I6nSGHysY1dDKpl2gtOgEdbhgQ807CNvF/20TxTFGGmgYHTdHXyCh1qaSYQYTYhTKURAFkgspAF5op1skTgvYM+Kn9wY7tRoNOMTilNAQBvaT7ICTAjPFFdDbwWuASR+F3/m2j/daLbsyu7Osx5/bBX32Xx/3wJ4W5hlCdRu6IyQwLQ26vpaVGD/uX5X1W54mBhVNxi08J9ZYrOfubjW9p48CJ5ay03JMBK8FB2akqd6+H5MHV0dBIIQegKJGjJKfBoz5AATSmrrn7/BBc1PDwSIxKgsZt0s+mGxdFq4mMa0904ToDW0wDpdru5GYUpdQqwDjvPOk6ApgAsQCYkQzOYCUraqUOOADvZzQbZwqgwPi9nLIA8qTH4yw2fFfqt+ykgJHH5gIF25kB4PTt8jh9GeK2xTZn5Ton5nTg6yJ89+thWdoBhWigj1QdvvtWmHnx4qKJBqLjJB7aOgL11DfT8zn3cy0PEV/MBTOpoa3VbCYDmL+9tJoTW4e5GP1fbCsmccNsJwMeUrrbT/KMKAie9vf3mNLS5tu0EQP9Sdoqju/UUh3Kyt4++uXDRZlipi3eEAKiz5REWU2DxP6TW1sP8FAe/SfMfxwgATiyKOz27MmpRdJQAkIBRUMq++mJR7DjWiaK0JscJwKKIj624IibgHfx0fREAtFgU3z/QzYF3dBwzHVa3kjHHR4CmfG31DnrlOX6ul/sH+FqUjmRIgJ3eG5ykrcw6oA04SUZtzbM4opqW5qwiKxkB42hEC2Nb1WC8nC7mH2BRRDu9fWInCSMkqkvkDktC4tBFTIBCX6ECemb4XGwAE+VWJf2i6PX6Ei6K8CChBz/4KNF5/YGqteohjAdAMPsC42Pn7vettRHr3jc++Gi2raSnxdkJ6/PsqPlv7DShzATfb1a4hfXZf4BQD9Ei+1eYn2ctlJsTlWMgx0COgRwD65qB/wAwiHnjlApmaQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/538597/Google%20Map%20to%20WME.user.js
// @updateURL https://update.greasyfork.org/scripts/538597/Google%20Map%20to%20WME.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback(currentUrl);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function getMapParams() {
        let lat, lon, meters, zoomLevel;
        let locationHref = location.href;
        console.debug('google-map-to-wme: getMapParam() href: ' + locationHref);
        let match = locationHref.match(/@([\-0-9.]+),([\-0-9.]+),([0-9.]+)[mz]/);
        if (match) {
            // url like: https://www.google.co.il/maps/@31.7963186,35.175359,28066m/data=!3m1!1e3?hl=iw&entry=ttu&g_ep=EgoyMDI1MDYyMi4wIKXMDSoASAFQAw%3D%3D
            [, lat, lon, meters] = match;
            meters = parseFloat(meters);
            // Estimate zoom level from meters
            const metersPerPixelAtZoom0 = 156543.03392;
            const screenPixels = 256;
            const resolution = meters / screenPixels;
            zoomLevel = Math.log2((metersPerPixelAtZoom0 * Math.cos(lat * Math.PI / 180)) / resolution);
            zoomLevel = Math.round(zoomLevel)
        } else {
            match = locationHref.match(/[?&]ll=([\-0-9.]+)%2C([\-0-9.]+).*?[?&][mz]=([0-9]+)/);
            if (match) {
                // url like: https://www.google.com/maps/d/edit?hl=en&mid=1-d2ZCBifkZJaKIZ7DJi-VBoiFx45rWk&ll=33.23893084322684%2C35.812770856734524&z=17
                [, lat, lon, zoomLevel] = match;
            } else {
                return null
            }
        }

        lat = parseFloat(lat).toFixed(5);
        lon = parseFloat(lon).toFixed(5);

        const langMatch = location.href.match(/[?&]hl=([a-zA-Z-]+)/);
        const lang = langMatch ? langMatch[1] : 'en';

        return {
            lat,
            lon,
            zoomLevel: zoomLevel,
            lang,
            env: 'il' // force Israeli WME
        };
    }

    function createWazeButton() {
        const btn = document.createElement('img');
        btn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAQAAAAABUjGyuAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAAGGUlEQVR4Ae1bXUwcVRQ+A5g0Kj+J0UjYxEGlKZhofxKWRDHbxGpSXkxb609ICvpQLRZqFOpfQhtKAPvQArEVE5fVEG0sJfWFRNsE0r7solX6YDGtxjUshtik0gVNjCzj/e4wy+xm784OzMzuyt5kmTt37px7vu/+nHPPXIhyKcdAjoEcAzkG1i8D0v8BuizLJZRX0E6K9CyREiSloDEY/CmYCrasJ0CWN8kkRcYYcFkHeI6RsT0YvDGpK0uYzUtYmiWFevAul4sGPjpFLS0HoX0JScqYLFdszhIo5tUEeLm84le5/GHliVqPMj0dUrR04mSvgnL2+9OIhHzzTaf/DX3PF5e6aOTMELlcZVHFamrcPB8ITGwgiV4oKbnn67m5W7PRCrpM1hGgB59/n4s2tA9RcWkZbSvUoWJZkBAOh2ly8ipIKGUEnImtod5l1RoQD77oyBDl3VtGH/9OtPlxD9U+6aFQKBTFuWf3Li3/gJaJv2YNASLwGqCFiMTAz9CLL9VzEkDE/lcPqI8lSWgNssIMGoEHyqWbMxQ+Uk+RP0LR9QCEEEnML8hnJjGxX5DxBKQCXu3mWBLUsuTgUSejp4AZ8CpghZgpVLMGPb9cia2PGZrMgl+6GaLb7fV8KhgNez3klAiQNzF389+IR/+ipflI/rh+jjoFHhgKkgFRFVkcpH8WPcnqrfmZtDjHhu4bkDM6OkpNrx9qh28PO6+ZOlEbq+15TZ6QgJVeILnwriLaUlVNd7NrfJplq+/3PwbYyuuiGnd1/OOU7iurKktYxUGYrq7uD1hWISfAQzkhAZQXYdtLRa6QK6mfORwgIVEaHR/hBLgZ+OPHexJVSakM4FUbPuMYeCgmtgIKeVDh3aYeIXg8tyKlCzx0FxOwvL/eyEaAnSmd4A0IsBO2Kjvd4NNKQCaAXzMBs8z5uDxxwfRQyRTwUFxsBZLAgtnznu2nH9h1NckfmOA7N7x7Z8N7fEsrkqO38zC177zderSuri4oqm+2PGUCFv4KE0zepW8vRoEXFRVRVVUl+f3miAgEVuovfHiYOzsFCRbbePBffB4b+TELNlH9JFZArQ7gn7De3tO0nXp9nRw8gCP4ePnSGO1eCTokkp+w7Nq1KV7+9I6nSGHysY1dDKpl2gtOgEdbhgQ807CNvF/20TxTFGGmgYHTdHXyCh1qaSYQYTYhTKURAFkgspAF5op1skTgvYM+Kn9wY7tRoNOMTilNAQBvaT7ICTAjPFFdDbwWuASR+F3/m2j/daLbsyu7Osx5/bBX32Xx/3wJ4W5hlCdRu6IyQwLQ26vpaVGD/uX5X1W54mBhVNxi08J9ZYrOfubjW9p48CJ5ay03JMBK8FB2akqd6+H5MHV0dBIIQegKJGjJKfBoz5AATSmrrn7/BBc1PDwSIxKgsZt0s+mGxdFq4mMa0904ToDW0wDpdru5GYUpdQqwDjvPOk6ApgAsQCYkQzOYCUraqUOOADvZzQbZwqgwPi9nLIA8qTH4yw2fFfqt+ykgJHH5gIF25kB4PTt8jh9GeK2xTZn5Ton5nTg6yJ89+thWdoBhWigj1QdvvtWmHnx4qKJBqLjJB7aOgL11DfT8zn3cy0PEV/MBTOpoa3VbCYDmL+9tJoTW4e5GP1fbCsmccNsJwMeUrrbT/KMKAie9vf3mNLS5tu0EQP9Sdoqju/UUh3Kyt4++uXDRZlipi3eEAKiz5REWU2DxP6TW1sP8FAe/SfMfxwgATiyKOz27MmpRdJQAkIBRUMq++mJR7DjWiaK0JscJwKKIj624IibgHfx0fREAtFgU3z/QzYF3dBwzHVa3kjHHR4CmfG31DnrlOX6ul/sH+FqUjmRIgJ3eG5ykrcw6oA04SUZtzbM4opqW5qwiKxkB42hEC2Nb1WC8nC7mH2BRRDu9fWInCSMkqkvkDktC4tBFTIBCX6ECemb4XGwAE+VWJf2i6PX6Ei6K8CChBz/4KNF5/YGqteohjAdAMPsC42Pn7vettRHr3jc++Gi2raSnxdkJ6/PsqPlv7DShzATfb1a4hfXZf4BQD9Ei+1eYn2ctlJsTlWMgx0COgRwD65qB/wAwiHnjlApmaQAAAABJRU5ErkJggg=="
        Object.assign(btn.style, {
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            padding: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            cursor: 'pointer',
        });
        btn.title = 'Open in WME';

        btn.addEventListener('click', () => {
            const params = getMapParams();
            console.log('google-map-to-wme: params:', params);
            if (params) {
                const { lat, lon , zoomLevel, lang} = params;
                const wmeUrl = `https://www.waze.com/${lang}/editor?env=il&lon=${lon}&lat=${lat}&zoomLevel=${zoomLevel}`;
                window.open(wmeUrl, '_blank');
            } else {
                alert('Could not extract location from URL.');
            }
        });

        document.body.appendChild(btn);
    }

    function init() {
        console.log('google-map-to-wme: init');
        createWazeButton();
        waitForUrlChange(() => {
            // Optional: update button state or behavior if needed
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
