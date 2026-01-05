// ==UserScript==
// @name         RED External Links
// @version      1.5.1
// @namespace    https://greasyfork.org/en/users/93312-dreamagine
// @homepage     https://greasyfork.org/en/scripts/26382-passtheheadphones-me-artist-album-search-linker
// @description  Inserts links on Redacted artist and album pages to search artist/album information on external music sites
// @author       DreaMagine
// @include      https://redacted.ch/torrents.php?*
// @include      https://redacted.ch/artist.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26382/RED%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/26382/RED%20External%20Links.meta.js
// ==/UserScript==

// Contributors: janbatist, newstarshipsmell, blackblize, meddler, amohongos, demais, f3d3r3x

// Configuration is made by editing the array below. Follow the same pattern to add any new website.
//
// name: the name you want to display when using textual links (see display)
//
// display: 0 = don't add the site to the external links
//          1 = display a textual link
//          2 = display a clickable icon link
//
// VAexclude: set to 1 if you don't want to display this site for Various Artists releases
//
// tagFilter: only display links when conditions are met. See examples.
//            tagFilter = "rock, pop, pop.rock"       The website will be displayed if there's any of the tags ("rock" or "pop" or "pop.rock") on the release page
//            tagFilter = "rock pop, pop.rock"        The website will be displayed if both "pop" and "rock" are on the release page (note that there's no comma between rock and pop), or if there's "pop.rock"
//            tagFilter = "rock !pop, pop.rock"       The website will be displayed if there's "rock" but not "pop" on the release (note the ! before pop), or if there's "pop.rock"
//
// position: set your own order for the links. The sorting is ascending. Sites with the same position will be displayed in the same order than in the array below.
//           Last.fm       "position": 2,
//           Discogs       "position": 0,
//           Musicbrainz   "position": -2,
//           RateYourMusic "position": -1,
//           AllMusic      "position": 0,
//           Bandcamp      "position:" 1,
//           With the above settings, the display order would be: Musicbrainz / RateYourMusic / Discogs / AllMusic / Bandcamp / Last.fm
//
// queryAlbum and queryArtist: use "%ARTIST%" and "%ALBUM%" as placeholders within the query strings. These placeholders will be replaced with the actual artist and album names being searched
//
// imageData: Base64 icon. The recommended size is 17x17. Online converters: https://www.base64-image.de/ and http://www.greywyvern.com/code/php/binary2base64.
//            See this google service to save favicon as PNG: https://www.google.com/s2/favicons?domain=www.spotify.fr

var sites = [
    // Databases
    {
        "name": "Last.fm",
        "display": 2,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://www.last.fm/music/%ARTIST%/%ALBUM%",
        "queryArtist": "http://www.last.fm/music/%ARTIST%",
        "imageData": "data:image/png;base64,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%3D"
    },
    {
        "name": "Discogs",
        "display": 2,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://www.discogs.com/search/?type=all&title=%ALBUM%&artist=%ARTIST%&advanced=1",
        "queryArtist": "https://www.discogs.com/search/?type=artist&q=%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sECA0hAXdZfkUAAAJoSURBVDhPdZLdS1NxGMcf5qZ75+x9O2dnwzO3uU0Ut7mm00mI2FiMQEywBLvyIqQ7FQS78WZX0W0YeGGBFQhdVFA0usi8sIuCZJEQTiKIXuwfON9+Z3M15/rCw3PzfJ6X3+9L1EJer7fo8wklSZLQ2SnB5+NLNput2Kq2WSGTyQSdTgePxwO/3y8Hg0FZaTIyksbCwiJUKgq1JIeHh/dZAgvZbrfD7XZDydFoFL29PdjcfISjo+9yKtXPaiz7zXyoDitZrVaD53m2uojBwTTm5q6jUjnA5OQVFAp5ORCQcMLU1NHR8Rf+Fxw07SLsjig2Nrawvn4P+fwlJBIJZDIZ2el0ogqbzebiabAWF87rcP8u4VbRgImxBMbGChgYqMLo6uqqnsjqimSxWErN8Pw1Gz7uESr7hMMPhG+fCDfm9eC4AETRC5fLVT2R1ZbIYDA0rd+OJw8IvyuEn58Jx4eEHyy/2yHo9GEIAg+9Xg/2WzXmpEFDmPD+DQHHhFfPurG91Q38Yg12CUaTeOZUYgZBW1ubrGRlNY5z487tduy+qDVR4is7Ze+lAmga4frWtCQIAqxWK0ZHRxEOd0Pq5PH0oQZvXxN2nlN1o1iYOzudscTsmlTcl81m5Ugkwv76IlZXF3F5eg3phBapfjsrFJrB+vSksgEZjcby0FAGU1MFjI9PQFEul2NWluBwOGGzWVtNL1Oj2HdiZuYqyuUv8vLyGvP+IOLxOHOjr/5ljZNxChZFUaXkvr5z5e3tx1hZuYnZ2Wk5nU5XGzDTyMxwzZNV9B8lY7GeJY+HRygUglarBTux9mD1mxv0ByVEOcCBfMQYAAAAAElFTkSuQmCC"
    },
    {
        "name": "Musicbrainz",
        "display": 2,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://musicbrainz.org/taglookup?tag-lookup.artist=%ARTIST%&tag-lookup.release=%ALBUM%",
        "queryArtist": "https://musicbrainz.org/taglookup?tag-lookup.artist=%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADrSURBVDhPY8AF9jhNEN/t3ufyosRc72maMRdUmDD4z1DPtNtjQtYut/53O937G14XWze8KrZ6+KrIMvI/AwMjVBl2sMu9332XW99FIP0fhGEGvC6x/g/GxVaHXxfbGEOVI8Bulw7+ne5982AacRoAxEDX/AUaNPdFnrk4VDsDw063/ufomnEZADeoxPojVDvY6RiaQRifASAM1T5qAAhg0wzCRBsATAO/SDUAJRq3OU3UAibdvcQYgDUhwcAOt75oYFJ+jNMAXEkZGex07ebe5dHXBjToB8wAojMTMtjlMkF1l0uvF/7szMAAABf4tDG2wJZuAAAAAElFTkSuQmCC"
    },
    {
        "name": "RateYourMusic",
        "display": 2,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://rateyourmusic.com/search?searchtype=l&searchterm=%ARTIST%+%ALBUM%",
        "queryArtist": "http://rateyourmusic.com/search?searchtype=a&searchterm=%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAACjFpQ0NQSUNDIFByb2ZpbGUAAEiJnZZ3VFPZFofPvTe9UJIQipTQa2hSAkgNvUiRLioxCRBKwJAAIjZEVHBEUZGmCDIo4ICjQ5GxIoqFAVGx6wQZRNRxcBQblklkrRnfvHnvzZvfH/d+a5+9z91n733WugCQ/IMFwkxYCYAMoVgU4efFiI2LZ2AHAQzwAANsAOBws7NCFvhGApkCfNiMbJkT+Be9ug4g+fsq0z+MwQD/n5S5WSIxAFCYjOfy+NlcGRfJOD1XnCW3T8mYtjRNzjBKziJZgjJWk3PyLFt89pllDznzMoQ8GctzzuJl8OTcJ+ONORK+jJFgGRfnCPi5Mr4mY4N0SYZAxm/ksRl8TjYAKJLcLuZzU2RsLWOSKDKCLeN5AOBIyV/w0i9YzM8Tyw/FzsxaLhIkp4gZJlxTho2TE4vhz89N54vFzDAON40j4jHYmRlZHOFyAGbP/FkUeW0ZsiI72Dg5ODBtLW2+KNR/Xfybkvd2ll6Ef+4ZRB/4w/ZXfpkNALCmZbXZ+odtaRUAXesBULv9h81gLwCKsr51Dn1xHrp8XlLE4ixnK6vc3FxLAZ9rKS/o7/qfDn9DX3zPUr7d7+VhePOTOJJ0MUNeN25meqZExMjO4nD5DOafh/gfB/51HhYR/CS+iC+URUTLpkwgTJa1W8gTiAWZQoZA+J+a+A/D/qTZuZaJ2vgR0JZYAqUhGkB+HgAoKhEgCXtkK9DvfQvGRwP5zYvRmZid+8+C/n1XuEz+yBYkf45jR0QyuBJRzuya/FoCNCAARUAD6kAb6AMTwAS2wBG4AA/gAwJBKIgEcWAx4IIUkAFEIBcUgLWgGJSCrWAnqAZ1oBE0gzZwGHSBY+A0OAcugctgBNwBUjAOnoAp8ArMQBCEhcgQFVKHdCBDyByyhViQG+QDBUMRUByUCCVDQkgCFUDroFKoHKqG6qFm6FvoKHQaugANQ7egUWgS+hV6ByMwCabBWrARbAWzYE84CI6EF8HJ8DI4Hy6Ct8CVcAN8EO6ET8OX4BFYCj+BpxGAEBE6ooswERbCRkKReCQJESGrkBKkAmlA2pAepB+5ikiRp8hbFAZFRTFQTJQLyh8VheKilqFWoTajqlEHUJ2oPtRV1ChqCvURTUZros3RzugAdCw6GZ2LLkZXoJvQHeiz6BH0OPoVBoOhY4wxjhh/TBwmFbMCsxmzG9OOOYUZxoxhprFYrDrWHOuKDcVysGJsMbYKexB7EnsFO459gyPidHC2OF9cPE6IK8RV4FpwJ3BXcBO4GbwS3hDvjA/F8/DL8WX4RnwPfgg/jp8hKBOMCa6ESEIqYS2hktBGOEu4S3hBJBL1iE7EcKKAuIZYSTxEPE8cJb4lUUhmJDYpgSQhbSHtJ50i3SK9IJPJRmQPcjxZTN5CbiafId8nv1GgKlgqBCjwFFYr1Ch0KlxReKaIVzRU9FRcrJivWKF4RHFI8akSXslIia3EUVqlVKN0VOmG0rQyVdlGOVQ5Q3mzcovyBeVHFCzFiOJD4VGKKPsoZyhjVISqT2VTudR11EbqWeo4DUMzpgXQUmmltG9og7QpFYqKnUq0Sp5KjcpxFSkdoRvRA+jp9DL6Yfp1+jtVLVVPVb7qJtU21Suqr9XmqHmo8dVK1NrVRtTeqTPUfdTT1Lepd6nf00BpmGmEa+Rq7NE4q/F0Dm2OyxzunJI5h+fc1oQ1zTQjNFdo7tMc0JzW0tby08rSqtI6o/VUm67toZ2qvUP7hPakDlXHTUegs0PnpM5jhgrDk5HOqGT0MaZ0NXX9dSW69bqDujN6xnpReoV67Xr39An6LP0k/R36vfpTBjoGIQYFBq0Gtw3xhizDFMNdhv2Gr42MjWKMNhh1GT0yVjMOMM43bjW+a0I2cTdZZtJgcs0UY8oyTTPdbXrZDDazN0sxqzEbMofNHcwF5rvNhy3QFk4WQosGixtMEtOTmcNsZY5a0i2DLQstuyyfWRlYxVtts+q3+mhtb51u3Wh9x4ZiE2hTaNNj86utmS3Xtsb22lzyXN+5q+d2z31uZ27Ht9tjd9Oeah9iv8G+1/6Dg6ODyKHNYdLRwDHRsdbxBovGCmNtZp13Qjt5Oa12Oub01tnBWex82PkXF6ZLmkuLy6N5xvP48xrnjbnquXJc612lbgy3RLe9blJ3XXeOe4P7Aw99D55Hk8eEp6lnqudBz2de1l4irw6v12xn9kr2KW/E28+7xHvQh+IT5VPtc99XzzfZt9V3ys/eb4XfKX+0f5D/Nv8bAVoB3IDmgKlAx8CVgX1BpKAFQdVBD4LNgkXBPSFwSGDI9pC78w3nC+d3hYLQgNDtoffCjMOWhX0fjgkPC68JfxhhE1EQ0b+AumDJgpYFryK9Issi70SZREmieqMVoxOim6Nfx3jHlMdIY61iV8ZeitOIE8R1x2Pjo+Ob4qcX+izcuXA8wT6hOOH6IuNFeYsuLNZYnL74+BLFJZwlRxLRiTGJLYnvOaGcBs700oCltUunuGzuLu4TngdvB2+S78ov508kuSaVJz1Kdk3enjyZ4p5SkfJUwBZUC56n+qfWpb5OC03bn/YpPSa9PQOXkZhxVEgRpgn7MrUz8zKHs8yzirOky5yX7Vw2JQoSNWVD2Yuyu8U02c/UgMREsl4ymuOWU5PzJjc690iecp4wb2C52fJNyyfyffO/XoFawV3RW6BbsLZgdKXnyvpV0Kqlq3pX668uWj2+xm/NgbWEtWlrfyi0LiwvfLkuZl1PkVbRmqKx9X7rW4sVikXFNza4bKjbiNoo2Di4ae6mqk0fS3glF0utSytK32/mbr74lc1XlV992pK0ZbDMoWzPVsxW4dbr29y3HShXLs8vH9sesr1zB2NHyY6XO5fsvFBhV1G3i7BLsktaGVzZXWVQtbXqfXVK9UiNV017rWbtptrXu3m7r+zx2NNWp1VXWvdur2DvzXq/+s4Go4aKfZh9OfseNkY39n/N+rq5SaOptOnDfuF+6YGIA33Njs3NLZotZa1wq6R18mDCwcvfeH/T3cZsq2+nt5ceAockhx5/m/jt9cNBh3uPsI60fWf4XW0HtaOkE+pc3jnVldIl7Y7rHj4aeLS3x6Wn43vL7/cf0z1Wc1zleNkJwomiE59O5p+cPpV16unp5NNjvUt675yJPXOtL7xv8GzQ2fPnfM+d6ffsP3ne9fyxC84Xjl5kXey65HCpc8B+oOMH+x86Bh0GO4cch7ovO13uGZ43fOKK+5XTV72vnrsWcO3SyPyR4etR12/eSLghvcm7+ehW+q3nt3Nuz9xZcxd9t+Se0r2K+5r3G340/bFd6iA9Puo9OvBgwYM7Y9yxJz9l//R+vOgh+WHFhM5E8yPbR8cmfScvP174ePxJ1pOZp8U/K/9c+8zk2Xe/ePwyMBU7Nf5c9PzTr5tfqL/Y/9LuZe902PT9VxmvZl6XvFF/c+At623/u5h3EzO577HvKz+Yfuj5GPTx7qeMT59+A/eE8/vsbQFrAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAALHSURBVDjLdZPNbxtVFMV/983YnTiOIZTGGU+bpCoUqSC6iSikK6JKrJD4C1iTsEKtuipStyAiFoik2bJCLAEJIVBYQRNq0UAlJAJNkybzYZMW4Xgce+z3HgvHWbT0Snd1zz3n6Opc4bBqUUS5UqEWxyeNMZettbPA6cPxPRFZUUotlH1/d4AFEIBaHFP2feIw/BTsfJJqJkZcOtryaInIoh8E7w52JApDKkFAPQpXV5POhWtr/5Jpy0vHcyxcHCWn+D+SNT8IXo3CsO8gCcOl9b3uOx/ebuG5AlhAKOWED14rPonkhh8Ec1JPksl21tt6/1aGkseBngNvv5DjbEkwR9SgLSjHnXKN1ldu7gljpWOPLSunL/3FfYMAo3lwFfQMvPgUzIzpK64jdrbezfNM4VBeQGvDn79sUbv/AKxl8lzAc+cn6HU1WHBdSIzgSHtW9qLdg+V7nueIRTmK2z/8zp2fNnAchYiACMZCcbTAmZcnKBQ90rTD5kaNb65Pt92Bato44LvPV2m3MtxhD0RAKaxA8+E23eZx1n/dwVjAVRzo/i1cRDabu/VzX3/5G+IqbNHDimCVYERx8E9MK22wv9+gdH4GLWCdHOVuDYPaVNrKSr7VoD0yRKs4TKo0jbRGo1kj9Ry6J3yMKkLhWbLiEOZYjs4fN3n9JHS6ekXqUTSZZnpr5qN17N07mP2HoJz+Qa3FnXwetxygxNJNQnrbf9GzUP1snmEvP6XGKpXtobyzvHBplGYjw+afxroj/c6V6EY1WtVbNKtVsqhOagp8cvUthrzc8lilsn0U5b+TeO376s4r8x//iOMIj2bKAlpbFt+7yKXpUz+fGPcvxIMoDx4jicLFdqbnlr7a4NtqzN2oCcCZSpE3pn3m3jyLl3eWxivB/NEzDRQGTpIoOiVw2curWUfJFIA2dqudmRUrsjDu+zsDLMB/Ni1FzkUYaRAAAAAASUVORK5CYII%3D"
    },
    {
        "name": "AllMusic",
        "display": 2,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://www.allmusic.com/search/albums/%ARTIST%+%ALBUM%",
        "queryArtist": "http://www.allmusic.com/search/artists/%ARTIST%",
        "imageData": "data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgHyMBIB8jriAfI8kgHyM2AAAAAAAAAAAgHyMWIB8jyCAfI8QgHyMPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAfI3kgHyP/IB8juiAfI3YgHyN2IB8jpSAfI/8gHyOoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgHyMTIB8j9SAfI/8gHyP/IB8j/yAfI/8gHyP/IB8jNwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAfI5YgHyP/IB8jXyAfIzogHyP+IB8jxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMyZACkgHyMoIB8j/SAfI6IgHyN2IB8j/yAfI1TMmQAmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMyZAE/MmQDszJkAFiAfI7QgHyPzIB8j1yAfI950WxIHzJkA38yZAGoAAAAAAAAAAAAAAAAAAAAAAAAAAMyZAB/MmQDtzJkAPQAAAAAgHyNDIB8j/yAfI/8gHyNxAAAAAMyZACbMmQDqzJkANgAAAAAAAAAAAAAAAAAAAADMmQCTzJkAkAAAAADMmQAux5UBHCAfI9AgHyPxXksWF8yZAD4AAAAAzJkAbcyZALMAAAAAAAAAAAAAAADMmQAAzJkA38yZADEAAAAAzJkAx8yZAC8gHyNgIB8jjsyZABjMmQDZzJkABMyZABLMmQD2zJkABwAAAAAAAAAAzJkAB8yZAPzMmQANzJkAB8yZANcAAAAAIB8jQSAfI24AAAAAzJkAucyZACYAAAAAzJkA68yZACUAAAAAAAAAAMyZAALMmQDwzJkAHMyZAAHMmQDdzJkADSAfIwkgHyMRzJkAA8yZANfMmQARzJkABMyZAPbMmQAUAAAAAAAAAAAAAAAAzJkAt8yZAGEAAAAAzJkAcMyZALXMmQApzJkAIcyZAJ/MmQCQAAAAAMyZAELMmQDXy5kAAAAAAAAAAAAAAAAAAMyZAE3MmQDczJkADMyZAADMmQBbzJkAu8yZAMDMmQBtzJkAAsyZAATMmQDEzJkAbQAAAAAAAAAAAAAAAAAAAADMmQAAzJkAo8yZAL3MmQATAAAAAAAAAAAAAAAAAAAAAMyZAArMmQCmzJkAv8yZAAQAAAAAAAAAAAAAAAAAAAAAAAAAAMyZAAXMmQCUzJkA6syZAIrMmQBSzJkAT8yZAIDMmQDizJkAq8yZAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMyZAC7MmQCKzJkAvMyZAMDMmQCSzJkAO8yZAAAAAAAAAAAAAAAAAAAAAAAA4YcAAPAPAADwDwAA+B8AAPAPAADgBwAAxCMAAMgTAADIAQAAgkkAAIABAADIEwAAxAMAAOPDAADgBwAA+B8AAA%3D%3D"
    },

    // Streaming
    {
        "name": "Bandcamp",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://bandcamp.com/search?q=%ARTIST%+%ALBUM%",
        "queryArtist": "http://bandcamp.com/search?q=%ARTIST%",
        "imageData": "data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAComWG0qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/KiZYTAAAAAAAAAAAAAAAAAAAAAAqJlhJ6iZYfyomWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWG6AAAAAAAAAAAAAAAAAAAAAAAAAAComWGWqJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYUsAAAAAAAAAAAAAAAAAAAAAqJlhEqiZYfComWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWHYqJlhAwAAAAAAAAAAAAAAAAAAAAComWF4qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYWkAAAAAAAAAAAAAAAAAAAAAqJlhBqiZYduomWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWHtqJlhDAAAAAAAAAAAAAAAAAAAAAComWFaqJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYYcAAAAAAAAAAAAAAAAAAAAAAAAAAKiZYcOomWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH5qJlhIQAAAAAAAAAAAAAAAAAAAAComWE8qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYf+omWH/qJlh/6iZYaUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD//wAAAB8AAIAPAACADwAAwAcAAOAHAADgAwAA8AEAAPABAAD4AAAA//8AAP//AAD//////////w=="
    },
    {
        "name": "Deezer",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://www.deezer.com/search/%ARTIST% %ALBUM%/album",
        "queryArtist": "http://www.deezer.com/search/%ARTIST%/artist",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAQ5JREFUOI2dkrFKxEAQhr9Z7nJRSSuIWAbrW9J4iC+gL2Bva+OTHNjYWPsm6bLWQRsrwdIr5KK7Y5HIXbwLmvzNwOx+3+7AyHR6UhhjrKrSJyJCCMGZITCAqmKMsWYI3JIMppv0EjiX41z+f8E64FxOoUqh2pKMWsDTKwA2PcC5HHULAMQmAFTV5iOjdVgfbmvg8rpuVkv48Ly83zH2nnIJ8aRDUJNNXTTtaAze8FkBHqI9iH4NvRIcH8L5BQD69XN6D0D5fENSwVl5BTFkQNj6g40kgLIz2Sc2b7AbQdcINgQkO213s3ldj1IgJWtmDHa2mtra2fBVpOcibRWIyN+3OiIimBDC4xCJiOC9d98P72I3wl+CXAAAAABJRU5ErkJggg=="
    },
    {
        "name": "Spotify",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://open.spotify.com/search/results/%ARTIST% %ALBUM%",
        "queryArtist": "https://open.spotify.com/search/results/%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAABnRSTlMAEgASABKYncUlAAACcUlEQVQokZWTz0tUURTHv+fcO2/mzfhj3tPAHzNlStbkWAujnS0CESkiaFerWrQpgugPaCXRunYtgtoULkoQijYi4S5MMm0h+CNTMZ1xCB3mzXvvnhYzNKPQwsPd3MP93nsP38+XXNfF0Usf2nPW0cMpdc7llhgAkyuFc/ng4y/zfbf+GNVei7J1vy9yvYuYDt0lRvzxlfLzBZTCSkfZtl3RxJ5cjAyliAgACKjTEpHKOJxxgqlNBFKTWQ+zkeE04hoWQxGYoBgWI6pgMQCIcGeCklY4vVWdjTPJyI2TyHtmclN+FGSziGIAJjRFKJWgjEPnXepqgEBfO+FP/DQLBWXbtnWnVw0cM2PL4eMZ+eNTVCGuwYS8J19zMr5qxpZlvkAdcWqPwyCc3tIAOOuiGPCVNF1qo5YYRCAAEzQBkPV9+bQRvloMC2X9cpD7neonqSUKETRa5s2STG7IbhllAyZqilBXA13u4Nun+FaP5D0IyInW+0bwDYoBD6WoL4nGCDwj6/sykwufLYRPv6lH/XyzB3t+zQA9kmYnCs080IoGLdslrO9jz6f2OF89ru6cpoSGF1K/g1DMRjF4t6IBmLm86m6Cxeb1oplYQypBjREExvwuIVdCd5O6l6GzSewFACq4kOu6nEnaLwaJCZ6BJiQ0KqYHRjaK8nZJNKsHffBCAMW7n838rrJtW3ZK1BJTZ5LQDEXwTXUZoWaLBtv4QivKBoA/vhK8X61REs7scMbhzjjkII5GKnoA4Zft0ujsAbgQSDC1iWaLe5urWNajLOKPr3qjs/9QpkN546yjR9Iq61SDk/fCuXzwYe3/wTlK/QWs4QPQ1IhMGAAAAABJRU5ErkJggg=="
    },

    // Trackers
    {
        "name": "APL",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://apollo.rip/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%&order_by=time&order_way=desc&group_results=1&searchsubmit=1",
        "queryArtist": "https://apollo.rip/torrents.php?searchstr=%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA8FBMVEUmHC0pHzAjGSpgWWVdVmIqIDGwrLKrp64kGitORlPi4eTf3uFKQlAlGiyPi5Pu7e/t7e+KhY4lGyw6MUDR0NOyr7W2s7jNzM83Lj5xa3bq6utlXmpqY2/q6uxsZnElGy0tIzS5trvNy881LDw4Lz7Rz9O0sbYrIjJWTlzn5uiLho+RjJTl5eZSSlgjGSualp7n5+hhWWY4Lz9kXWnp6eqVkZlAOEfW1djx8fLa2NvX1tna2dzx8vLT0dU9NEMkGiwkGSt+eILu7u+ppayRjJWTjpaqp615c30nHS5iW2h7dYA0KjojGCoiGCp8d4H///8Ibzp4AAAAAWJLR0RPbmZBSQAAAAd0SU1FB+ICFQU7Nn+cXK4AAACNSURBVBjTY2DAARgZUflMzCxMKAKsbOwoSjg4ubh5OJAEePn4BQSRBISERUTFxCWEEEZKSknLyMrBjZVXUFRSVlFVU4cr0NDUYmLS1tHVg4noGxgaqRibmEIN4TAzt7C0srK2sbWzBws4ODo5u7i6urg5uUOM9fD08vZxcPBV9mOGuZMJrFmICdmtcAAA6UUOXZQL+0gAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDItMjFUMDU6NTk6NTQtMDU6MDAAn3OrAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAyLTIxVDA1OjU5OjU0LTA1OjAwccLLFwAAAABJRU5ErkJggg=="
    },
    {
        "name": "WFL",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://waffles.ch/browse.php?q=artist%3A%22%ARTIST%%22%20album%3A%22%ALBUM%%22&c0=1&s=added&d=desc",
        "queryArtist": "https://waffles.ch/browse.php?type=&userid=&q=artist%3A%22%ARTIST%%22&c=0",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAFhJREFUOI1jYBjygBGZs2/v3v/oCpycnRnRxbCCfXv3/scGsBmKDFjQBWqrq+Hs5tZW4lyGy3Z8AGYoiguQbccHYC7DMABZglgw6gKklEgowaADolMozQEA9ixtXqNESVYAAAAASUVORK5CYII="
    },
    {
        "name": "NWCD",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://notwhat.cd/torrents.php?artistname=%ARTIST%&groupname=%ALBUM%&order_by=time&order_way=desc&group_results=1&searchsubmit=1",
        "queryArtist": "https://notwhat.cd/torrents.php?searchstr=%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAATRJREFUOI2NkjFLw1AUhb82UWNqh+ogWepU+ge6OFUXQf+AWxFcglP0Tzi6iZClQ1dX925WuhUHnToIsYViofbVKuU6xEJI8xIPXLj3cs659z5eDj2OgQNgDFyn8BLxBkgsnv8rPk8QL+MoTs4nGGymmG9lGdxlbBcAJ2mEe2CE/gQFPGQMoe+6rgwHA/E8TwAJgkBarZYA/SxxG5CnTkfUdCrNZlN835eZUtLtdpdbtLXqvR3EXtOuL4V1pLyNRDVmJL/6nIFTCovFHJRjkJc89vsPuY2w/zEB4BK4iRtYIwUjFRa7NYeiWSBYDBiXLL4eJ9HBlu4KOaxWpQLSOGsINcTeL4pZNuPnaNE7rdelYhjadwB6aQYA8xTxd5Z4iZcE8SuQixNXGhE4wMVffkv4jVfwC0XYij2Lp5FuAAAAAElFTkSuQmCC"
    },
    {
        "name": "RU",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://rutracker.org/forum/tracker.php?nm=%ARTIST%+%ALBUM%",
        "queryArtist": "http://rutracker.org/forum/tracker.php?nm=%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAgVBMVEVHcEzcIz8AzGM1TesAzWI0TOoAymo2TekCyGjmHUI2SuzXI0wA2Vsfv1s1TOjjH0U0UObkHUM0Teg5SesAzmMA0V/lHUEAzGPkH0E1TebjHkM3TOotS/AH0lI1T+SEOKPwGzT2DzsA2mXwFTwgtF3iHT8AzWN3PK4iUfgAzmPjH0QmQos5AAAAKXRSTlMAErxW+6QY/ljZ8ZfURNdzZuy9+mekTutClMA8ESKBXujAtqqELM5+9IYrBBEAAACgSURBVBiVVY9XEoMwDAUFGFypQw81kGLd/4CxDUmG97c7etII4Jfag0tqfFy4zTGF74zHOUdEfnI0Qmow55jL1gpGGPSIMlgReytire8Sl9d7XlJXYUZsuIU0mY8dvtb7KuOCUpEkBUS+JtrflZqoTQCVdiG6Cg1P9mrZGCRKMUHpDc4z/ph1hWu4PJsITEEIGh6iZGBEMAxZ938uO+rwAZxrDK1Zdw6OAAAAAElFTkSuQmCC"
    },

    // Shops
    {
        "name": "Deejay",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "https://www.deejay.de/%ARTIST%+%ALBUM%",
        "queryArtist": "https://www.deejay.de/%ARTIST%",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAbhJREFUOI2Vk79rE2Ecxp/ncnkTlybhhrujGRQ6XEyWmxQRQYqIdGhWyT9gcCsFFSkWBIMKLhU3yRToViddDNUOCe2QLIdLtiwxw5HQ+INe7u51qlwuqcRne5/v8/nC84WXiElKmSoWiy8nk8m67/urJH8nk8leLpc7tG37S71e/xrNM/ooFApvR6PRw/jSv2Hyp67rr7vdbo2kN7Mgn8/3fN9fuwiOStO0N47jPCLpKwBgWda7ZWEAcF13y7btpwBAKeUl0zR/LQufi+RpuVy+p1iWtbcooCaA3TLxeIMgIeNzKeVKq9W6y0XdUyrQe6XMAJe3QxmGs0dPp9OflSAIzPj2nU3GLTy4zTnT87yrCoCzC2rO6Gy60BaKEOJb3H12MFcZ74/mvUQi8V3NZrOHw+HwZnQQhMCV7RD3rxN+AOwfz8MAkMlkPrFSqaw3m82PAMQyVaIaDAYppdFoNA3DePG/sK7rz0l6BAAppSiVSjXXdbeWgYUQJ/1+/xoAKABA0nMc54lhGLskf/wLNk1z5xwGYr8RAKrV6o12u31nPB7fmk6na1JKVVXVgaZpHzqdTo1kEM3/AX2hmUb2ZB8FAAAAAElFTkSuQmCC"
    },
    {
        "name": "Juno",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://www.juno.co.uk/search/?q[all][]=%ARTIST%+%ALBUM%&=q[all][]&hide_forthcoming=0",
        "queryArtist": "http://www.juno.co.uk/search/?q[all][]=%ARTIST%&=q[all][]&hide_forthcoming=0",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAb1JREFUOI2lkzFoE1EYx3/v3V1DmpzQpTQhFxzVLrEVhA4dRBREumW6uAhmEjoEROgmOIlDR4NuZsrm6NAhQ4aCGBAUqqAkBykiBNtouNy7ey5tvORSqPjf3ve+7/f938f3BDNqdobu0zffN68WFquf+r8AuJzL8N77Xd/ZWm6VS9lGPF/ED9uNfrft4Zg6QKkA4+Q21GCaFkpYbBTo7bq5YgJw49nX7nFgOIYOZk1NKRQWS6mo97Z2sQggTzufpxjA0AEDXzrbjX4XQDY7Q7ftca7iOKTt4TQ7Q9f4nL//MGWIdXSUSBwpjYrAkiIJEbD38ecPuebYVRUkuw/8iMq6zb1rNgM/CVdBwJpjV82DwyGGTHZ+cP0CtTvLAGgNr98dkzb/OjEkHBwOkZGe/059RjyuSIN5KZflgzftIm0KXu4fccp4tX/EUmraZhjBlUIWUXry5UV6YaGqw+QcRkpPgLMShsVYjetyZ2ulpYQ112LaFHOLAZSweHx3pSXLpWxjo0AvPAMyT+HJSpdL2cYEf+v5t+7Al/+8yv/9maZGu+vmirWbixV/rOqr+cwkvprPMBqr+qPbdiVeDPAHZ0u882KEkqIAAAAASUVORK5CYII="
    },
    {
        "name": "Decks",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "",
        "position": 0,
        "queryAlbum": "http://www.decks.de/decks-sess/workfloor/search_db.php?wosuch=all&wassuch=atl&such=%ARTIST%+%ALBUM%&where=cld",
        "queryArtist": "http://www.decks.de/decks-sess/workfloor/search_db.php?wosuch=all&wassuch=atl&such=%ARTIST%&where=cld",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAnpJREFUOI2Vk09IVFEUh7/37nsZ6RtGRwWnKDONIFNyoTm7sKllQVshajWDpGC40Y2tJMggd0FQkatoE4IzpS1CG8Qywc2YqLlQw3BG9D1nHOc5p4WgTRDYhbO4nPP7zr97Nf46MzMzMjr6kfn5BZKJJAAlvmKqq2toablKfX299mf8wcVxHOnre8TU1BTVNVVITjAMBYDr7uG6Lo7j0NjYxL17d7EsSzsAOI4jbW33efXqBadOneb69WtYlkU2mz3MpGloukZmJ4PPV0pPTzeWZWkKQCnVOzDwFICtrU0WFhbx+yvweDzkcrkDiIhgGAaOY7Oysko0GnmoxeOz0tBwmXQ6nTeLwiIPN2/dpqioEF3bQ9cOW1dKJ5HYoLu7G1VeXt47MjICQGNTMxdra1le+Uk65XChQtHccJ4NR9h199D1Q4hhKGzbwYhEIoBOf/8TOjs7APg0/oX5d23cubKOcTLJwmYlzz4k2EplULqGiGCaJt/n5tBKy8rkbGUVk5MT+ftcfg0TXVDghzM3iHxVvJ1Ictzcr8I0DdbW1tFzrktxsffv5wCGF0Qgm4TEOL7CPXRd5YWIgF51roaxsXEmv0wdOOztDIuf34B1DDwmqV/L9L+IktpOUVBQgK7r5HJCWZkP1d7e0RuNDjM0NERm1yUen6Wzs4vHz4fZ2T1BfCnLg5dp3k/8YGlxHsM08Xq9bG+nqLtUB9PT02IYhgBHNsvySEmJT759mxYAQqHQfwEACYVCIiL7ANu2JRgMHlkcDAbFtm3Jm6ht2xIOh0Up9U+hUkrC4XCeOO9rAsRiMRkcHCQWi7G6ugqA3+8nEAjQ2tpKIBDI0/wGH44wN3rBejcAAAAASUVORK5CYII="
    },

    // Classical music
    {
        "name": "ArkivMusic",
        "display": 0,
        "VAexclude": 0,
        "tagFilter": "classical",
        "position": 0,
        "queryAlbum": "http://www.arkivmusic.com/classical/Search?cx=011477110254701862377%3Abwrykxfy_di&cof=FORID%3A10&ie=UTF-8&google_search=1&searchingPage=J10W23T21&searching=1&engine=2&role_wanted=-1&q=%ARTIST%+%ALBUM%&sa.x=0&sa.y=0",
        "queryArtist": "http://www.arkivmusic.com/classical/Search?cx=011477110254701862377%3Abwrykxfy_di&cof=FORID%3A10&ie=UTF-8&google_search=1&searchingPage=J10W23T21&searching=1&engine=2&role_wanted=-1&q=%ARTIST%&sa.x=0&sa.y=0",
        "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAXJJREFUOI2Vkz1PwlAUhp9esNCgjDp0gRoSmhg2E8OmifAnmFhY2HQ1MXEy0UkWl07ddGJDE0dWE5ey8LF0N4gprQEcKAbKhcR3POc877kf5yizo2MiKgFloNgPfBMgqyYcoA20gJflYmXJIAPUu75f+55Nd6OuAClFjA4TiUegAQyWDTLAzcfYq8jAqApJzQaugIEIY/UorJl5Yuk9qUFYWwcQQKnr+7VokWFbGLa10SRkSgIoy+7cq1RRdZ1c8xnNzK8ZhExZAEVZB8/p0KtUmQyHGLYlNQGKYvFV20wC1yXXfCJ9fraS7we+KTawa5oMv6RxEQ6JVJqZx7AtVF2nV6kyfH1byWfVhBNnPmEnm2CYP6jndGQ92gJopRQximYM2yJwXTqnZSkcMq3FJN59jL2L6AkC191490JSuwcuF4/YCMfzT57T2QbbzPeB2PW+DvAJvB/EdyajybTww0yVgSlFjMxk8gG4JbJMy/rXOv8CSIaWuqR2UJgAAAAASUVORK5CYII="
    }
];

function createLink(title, url, display, imageSrc) {
    var a = document.createElement('a');
    a.href = url;
    a.title = "Search on " + title;
    a.setAttribute("extLink", true);
    a.target = "_blank";

    // Create and style the img link
    var img = document.createElement('img');
    img.style.border = "none";
    img.style.marginLeft = "3px";
    img.src = imageSrc;

    // Create the text link
    var text = document.createElement('span');
    text.textContent = title;
    text.style.border = "none";
    text.style.marginLeft = "3px";

    if (display === 1) {
        a.appendChild(text);
    } else {
        a.appendChild(img);
    }
    return a;
}

function formatQuery(query, artist, album) {
    var map = {"%ARTIST%": artist, "%ALBUM%": album};
    var str = query.replace(/%\w+%/g, function (match) {
        return map[match] || match;
    });

    return str;
}

// Check the tagFilter setting against the release tags
function tagCheck(uTags) {
    uTags = uTags.trim();

    // Combo tag
    if (uTags.split(" ")[1]) {
        var xTags = uTags.split(" ");
        var xTag = 0;
        for (let i of xTags) {
            if (i.charAt(0) === "!") {
                if (tags.includes(i.substr(1)) === false) { xTag += 1; }
            }
            else {
                if (tags.includes(i)) { xTag += 1; }
            }
        }
        if (xTag === xTags.length) { return true; }
        else { return false; }

    // Simple tag
    } else {
        return tags.includes(uTags);
    }
}

// Filtering and sorting the sites array by user preferences (display and position)
var filteredSites = sites.filter(site => site.display > 0);
var userSites = filteredSites.sort(function(a, b) { return a.position - b.position; });

// Parsing release tags
var tags = [];
var tagsListHTML = document.querySelectorAll("div.box.box_tags li a:not(.brackets)");
for (let i of tagsListHTML) {
    tags.push(i.textContent);
}


// Add link(s) to the end of the linkbox at top of page
var pageheader = document.body.getElementsByClassName('header')[0].getElementsByTagName('h2')[0];
var linkbox = document.getElementsByClassName('linkbox')[0];
if (linkbox && linkbox.tagName == "DIV") {
    if (window.location.href.indexOf("torrents.php?") >= 0) {
        // We are on a torrent (album) page
        // Parsing artists by the artist_list box
        var compilerArtists = [];
        var compilerListHTML = document.querySelectorAll("ul#artist_list li.artists_dj a:not(.brackets)");
        for (let i of compilerListHTML) {
            compilerArtists.push(i.textContent);
        }

        var mainArtists = [];
        var mainListHTML = document.querySelectorAll("ul#artist_list li.artist_main a:not(.brackets)");
        for (let i of mainListHTML) {
            mainArtists.push(i.textContent);
        }

        // Composers are not used for now, but...
        var composerArtists = [];
        var composerListHTML = document.querySelectorAll("ul#artist_list li.artists_composers a:not(.brackets)");
        for (let i of composerListHTML) {
            composerArtists.push(i.textContent);
        }

        // artistName return the first compiler or the first main artist
        if (compilerArtists[0]) {
            var artistName = compilerArtists[0];
        } else {
            var artistName = mainArtists[0];
        }

        var albumName = pageheader.getElementsByTagName('span')[0].textContent.replace(/\b\s\b/g, "+").replace(/^\s+|\s+$/g, "");

        for (let site of userSites) {
            // Check VAexclude
            if (document.title.split(" - ", 1) == "Various Artists" && site.VAexclude === 1) { continue; }

            // Check tagFilter
            var fTags = site.tagFilter.split(",");
            if (fTags[0] && fTags.some(tagCheck) === false) { continue; }

            // Create links
            linkbox.appendChild(createLink(site.name, formatQuery(site.queryAlbum, artistName, albumName), site.display, site.imageData));
        }
    }

    else if (window.location.href.indexOf("artist.php?") >= 0) {
        // We are on an artist page
        var artistName = pageheader.textContent.replace(/\b\s\b/g, "+");

        for (let site of userSites) {
            // Check tagFilter
            var fTags = site.tagFilter.split(",");
            if (fTags[0] && fTags.some(tagCheck) === false) { continue; }

            // Create links
            linkbox.appendChild(createLink(site.name, formatQuery(site.queryArtist, artistName), site.display, site.imageData));
        }
    }
}
