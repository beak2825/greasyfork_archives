// ==UserScript==
// @name         RED Easy Artist Splitting
// @namespace    redartistsplitting
// @version      0.4
// @description  Adds a button to each listed artist that splits combined artists on click. Example: Wrongly named single artist "Calyx & TeeBee" becomes two correctly named artists "Calyx" and "TeeBee". Button only appears next to names that appear splittable.
// @match        https://redacted.ch/torrents.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/419161/RED%20Easy%20Artist%20Splitting.user.js
// @updateURL https://update.greasyfork.org/scripts/419161/RED%20Easy%20Artist%20Splitting.meta.js
// ==/UserScript==

(() => {
  const splitters = [
    ',',
    '&',
    '+',
    ';',
    '//',
    '/',
    ' y ',
    ' Y ',
    ' i ',
    ' I ',
    ' o ',
    ' O ',
    ' e ',
    ' E ',
    ' x ',
    ' X ',
    ' × ',
    ' ft ',
    ' Ft ',
    ' FT ',
    ' ft. ',
    ' Ft. ',
    ' FT. ',
    ' vs ',
    ' Vs ',
    ' VS ',
    ' vs. ',
    ' Vs. ',
    ' VS. ',
    ' and ',
    ' And ',
    ' AND ',
    ' with ',
    ' With ',
    ' feat ',
    ' Feat ',
    ' feat. ',
    ' Feat. ',
    ' featuring ',
    ' Featuring ',
  ]

  const featureSplitters = [
    ' ft ',
    ' Ft ',
    ' FT ',
    ' ft. ',
    ' Ft. ',
    ' FT. ',
    ' feat ',
    ' Feat ',
    ' feat. ',
    ' Feat. ',
    ' featuring ',
    ' Featuring ',
  ]

  const types = [
    'artist_main',
    'artist_guest',
    'artists_remix',
    'artists_composers',
    'artists_conductors',
    'artists_dj',
    'artists_producer',
  ]

  const doc = document
  const addArtistBox = doc.querySelector('.box_addartists')
  const addArtistButton = addArtistBox.querySelector('input[type="submit"]')

  const artists = [...doc.querySelectorAll('#artist_list li')]
    .filter(li => !!li.querySelector('.remove_artist'))
    .map((li) => ({
      node: li,
      name: li.querySelector('a').textContent,
      type: li.className,
      removeButton: li.querySelector('span.remove_artist a'),
      splittable: false,
    }))

  const splitArtist = (artist) => {
    for (let i = 1; i < artist.splitNames.length; i++) window.AddArtistField()

    const artistFields = addArtistBox.querySelectorAll('input[name="aliasname[]"]')
    const artistSelects = addArtistBox.querySelectorAll('select[name="importance[]"]')

    artist.splitNames.forEach((artist, index) => {
      artistFields[index].value = artist.name
      artistSelects[index].value = types.findIndex(type => type === artist.type) + 1
    })

    artist.removeButton.click()
    addArtistButton.click()
  }

  const addButtons = (artists) => {
    artists.forEach((artist) => {
      splitters.forEach((splitter) => {
        if (artist.name.includes(splitter)) {
          let featuredArtists = false

          artist.splitNames = artist.name.split(splitter).map((name, index) => {
            if (featureSplitters.includes(splitter)) featuredArtists = true

            return {
              name: name.trim(),
              type: index > 0
                ? featuredArtists
                  ? 'artist_guest'
                  : artist.type
                : artist.type,
            }
          })

          artist.splittable = true
        }
      })

      if (!artist.splittable) return

      const splitButton = doc.createElement('a')
      splitButton.className = 'split-artist-button'
      splitButton.title = 'Split artists'
      splitButton.style.cursor = 'pointer'
      splitButton.style.marginRight = '0.25em'
      splitButton.innerText = '[S]'
      artist.node.insertBefore(splitButton, artist.removeButton.parentNode)

      const onSplitButtonClick = () => splitArtist(artist)
      splitButton.addEventListener('click', onSplitButtonClick)
    })
  }

  addButtons(artists)
})()