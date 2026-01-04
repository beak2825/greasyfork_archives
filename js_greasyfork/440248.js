// ==UserScript==
// @name Greasy Fork User Statistics+
// @namespace -
// @version 1.5.1
// @description shows user statistics as total installs, total scripts etc.
// @author NotYou
// @match *://greasyfork.org/*/users/*
// @match *://sleazyfork.org/*/users/*
// @license GPL-3.0-or-later
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440248/Greasy%20Fork%20User%20Statistics%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/440248/Greasy%20Fork%20User%20Statistics%2B.meta.js
// ==/UserScript==

(function() {
    class Utils {
        static getCurrentTranslationId() {
            const $languageSelector = document.querySelector('.language-selector-locale')

            return $languageSelector ? $languageSelector.value : 'en'
        }

        static addStyle(css) {
            const selectors = Object.keys(css)
            const style = document.createElement('style')
            let cssFinal = ''

            selectors.forEach(selector => {
                const properties = Object.keys(css[selector])

                cssFinal += selector + '{'

                properties.forEach(property => {
                    cssFinal += property.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`) + ':' + css[selector][property] + ';'
                })

                cssFinal += '}'
            })

            style.textContent = cssFinal
            document.querySelector('head').appendChild(style)
        }

        static capitalize(str) {
            return str[0].toUpperCase() + str.slice(1)
        }
    }

    class Translation {
        static get data() {
            return {
                'ar': {
                    stats: 'إحصائيات المستخدم',
                    works: 'يعمل المستخدم',
                },
                'bg': {
                    stats: 'Потребителска статистика',
                    works: 'Потребителят работи',
                },
                'cs': {
                    stats: 'Statistiky uživatelů',
                    works: 'Uživatel pracuje',
                },
                'da': {
                    stats: 'Brugerstatistik',
                    works: 'Brugeren fungerer',
                },
                'de': {
                    stats: 'Benutzerstatistiken',
                    works: 'Benutzer funktioniert',
                },
                'el': {
                    stats: 'Στατιστικά στοιχεία χρηστών',
                    works: 'Ο χρήστης λειτουργεί',
                },
                'en': {
                    stats: 'User statistics',
                    works: 'User works',
                },
                'eo': {
                    stats: 'Statistiko de uzantoj',
                    works: 'Uzanto funkcias',
                },
                'es': {
                    stats: 'Estadísticas de usuario',
                    works: 'El usuario trabaja',
                },
                'fi': {
                    stats: 'Käyttäjätilastot',
                    works: 'Käyttäjä toimii',
                },
                'fr': {
                    stats: 'Statistiques d\'utilisateurs',
                    works: 'L\'utilisateur travaille',
                },
                'he': {
                    stats: 'סטטיסטיקות משתמשים',
                    works: 'משתמש עובד',
                },
                'hu': {
                    stats: 'Felhasználói statisztikák',
                    works: 'Felhasználó működik',
                },
                'id': {
                    stats: 'Statistik pengguna',
                    works: 'Pengguna bekerja',
                },
                'it': {
                    stats: 'Statistiche utente',
                    works: 'L\'utente lavora',
                },
                'ja': {
                    stats: 'ユーザー統計',
                    works: 'ユーザーは動作します',
                },
                'ko': {
                    stats: '사용자 통계',
                    works: '사용자 작품',
                },
                'ne': {
                    stats: 'Gebruikersstatistieken',
                    works: 'Gebruiker werkt',
                },
                'pl': {
                    stats: 'Statystyki użytkowników',
                    works: 'Użytkownik pracuje',
                },
                'ro': {
                    stats: 'Statistici utilizatori',
                    works: 'Utilizatorul lucrează',
                },
                'ru': {
                    stats: 'Статистика пользователей',
                    works: 'Пользовательские работы',
                },
                'tr': {
                    stats: 'Kullanıcı istatistikleri',
                    works: 'Kullanıcı işleri',
                },
                'uk': {
                    stats: 'Статистика користувачів',
                    works: 'Користувач працює',
                },
                'vi': {
                    stats: 'Thống kê người dùng',
                    works: 'Người dùng hoạt động',
                },
                'zh-CN': {
                    stats: '用户统计',
                    works: '用户作品',
                },
                'zh-TW': {
                    stats: '用戶統計',
                    works: '用戶作品',
                },
            }
        }

        static getById(id) {
            return this.data[id]
        }
    }

    class Data {
        constructor() {
            this.total = 0
            this.daily = 0
            this.scripts = 0
            this.styles = 0
            this.libraries = 0
            this.stats = 0
            this.works = 0
        }

        increaseTotal(value) {
            this.total += value
            this.stats += value
        }

        increaseDaily(value) {
            this.daily += value
            this.stats += value
        }

        increaseScripts() {
            this.scripts++
            this.works++
        }

        increaseStyles() {
            this.styles++
            this.works++
        }

        increaseLibraries() {
            this.libraries++
            this.works++
        }
    }

    class Stats {
        constructor(title, data, maxValue) {
            this.title = Object.assign(document.createElement('h3'), {
                textContent: title
            })
            this.data = data
            this.node = document.createElement('div')
            this.node.appendChild(this.title)

            for (const key in data) {
                const value = data[key]
                const percentage = value / maxValue * 100

                if (percentage > 0) {
                    const $bar = this.bar(percentage, key, value)

                    this.node.appendChild($bar)
                }
            }
        }

        bar(percentage, key, value) {
            const $bar = document.createElement('div')
            const $progress = document.createElement('div')
            const $text = document.createElement('span')
            let bg = '128, 128, 128'

            $bar.className = 'statistics-bar'

            switch (key) {
                case 'total':
                    bg = '255, 28, 28'
                    break
                case 'daily':
                    bg = '255, 58, 58'
                    break
                case 'styles':
                    bg = '50, 149, 208'
                    break
                case 'scripts':
                    bg = '236, 203, 27'
                    break
                case 'libraries':
                    bg = '221, 102, 15'
                    break
            }
            $progress.style.width = percentage + '%'
            $progress.style.backgroundColor = 'rgba(' + bg + ', .7)'

            $text.textContent = Utils.capitalize(key) + ` (${value.toLocaleString()})`

            $bar.appendChild($text)
            $bar.appendChild($progress)

            return $bar
        }
    }

    class Styles {
        static init() {
            Utils.addStyle({
                '#user-statistics': {
                    position: 'relative',
                },

                '.statistics-bar': {
                    width: 'calc(100% - 2.4vw)',
                    margin: '1em',
                    marginBottom: '1.5em',
                },

                '.statistics-bar div': {
                    height: '3px',
                    borderRadius: '20px',
                    padding: '3px',
                    position: 'relative',
                },

                '.statistics-bar div[style*=" 0%"]': {
                    padding: '0',
                },

                '.statistics-bar div[style*=" 0%"] + span': {
                    color: 'unset !important',
                },

                '#user-statistics-pin-btn': {
                    width: '25px',
                    height: '25px',
                    backgroundColor: 'rgb(191, 191, 191)',
                    display: 'block',
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACDElEQVR42mNkoDFgJFejk6igUIWGfKrb4QudNLGgWE3Ou0RNbvPlj1+qgZa0U92C+SaaBe7iQn0g9pVPX3FaQpYFDVqKNmmKUtsYGRl5Qfz/QHDp45cajyMX2yi2AGR4upL0NqCZPEALGGEWvPn2g+HE2/fVaZfutZNtAczlQCYPsjjI8Lffv4PZt7/9QLGEaAvQXQ5yNUg/1PD/yL5BtoQoC4CGWwMN3w5k8oIMgFkANJzx3Y8fDDAxmAUg5q2v38uAlvRgtaBdR9nVSpg/XICVRQLozO9i7Kzu+IIFCbzf++Zj5d1vP+9c//Lt1IVP375gtcBBVEB0vonWXg5mJl1k1yFFKCN6sIAMn/f4tevip6/PERXJMEvYmRh1iHH5vMevgIa/OYcugTcO0HzCgByhSHHxDpfhREVynreHXqEo9/nPDx8wIUcovmAh2gI7ByfJ6vrGfc/v3VYTWTX3H8+nDyzEupygBTDDHz17qnb/0YOLV1cujcpi/7OKjRESJy9+/l4Wef52DKEQYCTG8JXz57vcvXXznSk/t2iLhhww4pl0X/z8tTbi3O0Qki3AZThMHmbJw28/D6ZdvpdLkgWEDEe2xFiAR3PGw5eHSLJg3ZbtG99+/OiDz3BSAdwCY1Mz/oyCorvXblzbtWnlyhxqGI5igZyCAg8w/f17fP/+N2oYjDWIaAFobgEA6ol7KD65m7AAAAAASUVORK5CYII=)',
                    backgroundSize: '80% 80%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '40% 40%',
                    filter: 'grayscale(1)',
                },

                '#user-statistics.stats-pinned': {
                    position: 'fixed',
                    zIndex: '9',
                    right: '10px',
                    top: 'calc(50vh - 175px)',
                    borderRadius: '4px',
                    width: '400px',
                    height: '350px',
                    padding: '4px',
                    border: '1px solid rgb(0, 0 ,0)',
                },

                '#user-statistics.stats-pinned #user-statistics-pin-btn': {
                    /* GPL-3.0 @Saki */
                    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABqUlEQVR42u2USUvDUBSF8zIYEzqXlnbR/gYHdCe4VRyg0ILiwuF3OSxEsYWCInUruFMcfkO7KZ2blrRmIJ4XWsnCgVREhDwINDd957vvnJsQ5pcX8QAegIlEIpymaTP9fv/RWff5fAuiKD43m01jYkA8Hud1XT8MhUJZRVFyELseQddQy7fb7SIge9VqVXcNCAaDPMuyR6lUaofneQLAoNPpZC3LYsLhcCEQCEimaVrlcvmMELLbarUMVwBJkuYSicQdOpUgQCBs9Xo9DT+pPVP2ZixAB7VabRkW3ru2CJ2uRqNR2q1MAWPQ+DlEh7BtC91f/iTkFVxFv98vOgEQ15BBrtFoXE0cMl04wQYAeQpw1pHJEPZkALiZGADhTQDOIS59ZBEyGcCeLK6SawBCXkwmk7c0ZIfgK9VHJu+ngU1qvV5fgmVPrgAQ5tHwSTqd3uY4zh5T2i3dM7JsGmPKVCqVU/xv3/WY0hWLxQTDMI4xTRn4nYOI/aLhfh0NXKBWEAThAGP66dv8bcj0JPhUzKqq+uCsy7I8D/GXbrdrfrX/7z92HuD/A94AoxXXGeB8ZfgAAAAASUVORK5CYII=)',
                },

                '#user-statistics.stats-pinned .statistics-bar': {
                    margin: '.5em',
                },

                '.statistics-bar div::before': {
                    content: '""',
                    position: 'absolute',
                    width: 'calc(100% - 2px)',
                    height: '7px',
                    margin: '-5px -5px',
                    borderRadius: '20px',
                    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.3), 0 0 4px 0 rgba(0, 0, 0, 0.3) inset',
                    border: '1px solid rgb(34, 34, 34)',
                    padding: '2px',
                },

                '#user-statistics-pin-btn:only-child': {
                    display: 'none',
                }
            })
        }
    }

    class Main {
        static init() {
            const translationId = Utils.getCurrentTranslationId()
            const currentTranslation = Translation.getById(translationId)
            const data = new Data()

            const $stats = document.createElement('div')
            $stats.id = 'user-statistics'

            const $pinBtn = document.createElement('div')
            $pinBtn.id = 'user-statistics-pin-btn'
            $pinBtn.addEventListener('click', () => {
                const styles = window.getComputedStyle(document.body)

                if ($stats.classList.contains('stats-pinned')) {
                    $stats.style.cssText = ''
                } else {
                    $stats.style.backgroundColor = styles.backgroundColor
                    $stats.style.color = styles.color
                }

                $stats.classList.toggle('stats-pinned')
            })

            $stats.appendChild($pinBtn)

            const isCitrusGF = Boolean(document.querySelector('#script-table'))

            if (isCitrusGF) {
                document.querySelectorAll('#script-table tbody tr').forEach(script => {
                    data.increaseTotal(Number(script.querySelector(':nth-child(5)').textContent))
                    data.increaseDaily(Number(script.querySelector(':nth-child(4)').textContent))
                    data.increaseScripts()
                })
            } else {
                document.querySelectorAll('.script-list > li').forEach(script => {
                    const { dataset } = script

                    data.increaseTotal(Number(dataset.scriptTotalInstalls))
                    data.increaseDaily(Number(dataset.scriptDailyInstalls))

                    if (dataset.scriptType === 'library') {
                        data.increaseLibraries()
                    } else if (dataset.scriptLanguage === 'js') {
                        data.increaseScripts()
                    } else {
                        data.increaseStyles()
                    }
                })
            }

            const stats = new Stats(currentTranslation.stats, {
                total: data.total,
                daily: data.daily
            }, data.stats)

            const works = new Stats(currentTranslation.works, {
                scripts: data.scripts,
                styles: data.styles,
                libraries: data.libraries
            }, data.works)

            if (data.stats) {
                $stats.appendChild(stats.node)
            }

            if (data.works) {
                $stats.appendChild(works.node)
            }

            Styles.init()

            document.querySelector('#about-user').appendChild($stats)
        }
    }

    Main.init()
})()















