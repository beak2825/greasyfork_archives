// ==UserScript==
// @name         Heatmap
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  Simple script that can generate heatmaps
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant        none
// ==/UserScript==

;(function ($) {
    // The heatmap object
    class Heatmap {
        constructor(config, data) {
            this.maps = {}
            this.config = config
            this.data = {}

            this.config.day_labels ||= ['M', 'T', 'W', 'T', 'F', 'S', 'S']

            // If data is provided, initiate right away
            if (data !== undefined) this.initiate(data)
        }

        // Creates heatmaps for the data
        initiate(data) {
            let dates = this._get_dates(data)
            let parsed_data = this._parse_data(data, dates)
            this.data = parsed_data
            if (this.config.type === 'year') {
                for (let year = dates.first_year; year <= dates.last_year; year++) {
                    this.maps[year] = this._init_year(year, parsed_data, dates)
                }
                this._add_markings(this.config.markings, this.maps)
            }
            if (this.config.type === 'day') {
                this.maps.day = this._init_single_day(parsed_data, dates)
            }
        }

        // Parses data into a date structure
        _parse_data(data, dates) {
            // Prepare vessel
            let parsed_data = {}
            for (let year = dates.first_year; year <= dates.last_year; year++) {
                parsed_data[year] = {}
                for (let month = 1; month <= 12; month++) {
                    parsed_data[year][month] = {}
                    for (let day = 0; day <= 31; day++) {
                        parsed_data[year][month][day] = {
                            counts: {},
                            lists: {},
                            hours: new Array(24).fill().map(() => {
                                return { counts: {}, lists: {} }
                            }),
                        }
                    }
                }
            }
            // Populate vessel
            for (let [date, counts, lists] of data) {
                let [year, month, day, hour] = this._get_ymdh(date - 1000 * 60 * 60 * this.config.day_start)
                if (
                    date - 1000 * 60 * 60 * this.config.day_start < new Date(this.config.first_date).getTime() ||
                    date - 1000 * 60 * 60 * this.config.day_start >
                        new Date(this.config.last_date || date + 1).getTime()
                )
                    continue
                let parsed_day = parsed_data[year][month][day]
                for (let [key, value] of Object.entries(counts)) {
                    if (!parsed_day.counts[key]) parsed_day.counts[key] = value || 0
                    else parsed_day.counts[key] += value || 0
                    if (!parsed_day.hours[hour].counts[key]) parsed_day.hours[hour].counts[key] = value
                    else parsed_day.hours[hour].counts[key] += value
                }
                for (let [key, value] of Object.entries(lists)) {
                    if (!parsed_day.lists[key]) parsed_day.lists[key] = [value]
                    else parsed_day.lists[key].push(value)
                    if (!parsed_day.hours[hour].lists[key]) parsed_day.hours[hour].lists[key] = [value]
                    else parsed_day.hours[hour].lists[key].push(value)
                }
            }
            return parsed_data
        }

        // Create a year element for the heatmap
        _init_year(year, data, dates) {
            let cls =
                'year heatmap ' +
                this.config.id +
                (this.config.segment_years ? ' segment_years' : '') +
                (this.config.zero_gap ? ' zero_gap' : '') +
                (year > new Date().getFullYear() ? ' future' : '') +
                (year == new Date().getFullYear() ? ' current' : '')
            let year_elem = this._create_elem({ type: 'div', class: cls })
            year_elem.setAttribute('data-year', year)
            this._add_transitions(year_elem)
            let labels = this._create_elem({ type: 'div', class: 'year-labels', children: this._get_year_labels(year) })
            let months = this._create_elem({ type: 'div', class: 'months' })
            for (let month = 1; month <= 12; month++) {
                months.append(this._init_month(year, month, data, dates))
            }
            year_elem.append(labels, months)
            return year_elem
        }

        // Create labels for the years
        _get_year_labels(year) {
            let year_label = this._create_elem({
                type: 'div',
                class: 'year-label hover-wrapper-target',
                child: String(year),
            })
            let day_labels = this._create_elem({ type: 'div', class: 'day-labels' })
            for (let day = 0; day < 7; day++) {
                day_labels.append(
                    this._create_elem({
                        type: 'div',
                        class: 'day-label',
                        child: this.config.day_labels[(day + Number(this.config.week_start)) % 7],
                    }),
                )
            }
            return [year_label, day_labels]
        }

        // Create a month element for the year
        _init_month(year, month, data, dates) {
            let offset = (new Date(year, month - 1, 1, 0, 0).getDay() + 6 - this.config.week_start) % 7
            let month_elem = this._create_elem({ type: 'div', class: 'month offset-' + offset })
            if (year === dates.first_year && month < dates.first_month) month_elem.classList.add('no-data')
            let label = this._create_elem({
                type: 'div',
                class: 'month-label',
                child: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1],
            })
            let days = this._create_elem({ type: 'div', class: 'days' })
            let days_in_month = this._get_days_in_month(year, month)
            for (let day = 1; day <= days_in_month; day++) {
                days.append(this._init_day(year, month, day, data, dates))
            }
            month_elem.append(label, days)
            return month_elem
        }

        // Create a day element for the month
        _init_day(year, month, day, data, dates) {
            let day_data = data[year][month][day]
            let day_elem = this._create_elem({
                type: 'div',
                class: 'day hover-wrapper-target',
                info: { counts: day_data.counts, lists: day_data.lists },
                child: this._create_elem({
                    type: 'div',
                    class: 'hover-wrapper',
                    child: this.config.day_hover_callback([year, month, day], day_data),
                }),
            })
            day_elem.setAttribute('data-date', `${year}-${month}-${day}`)
            if (year === dates.first_year && month === dates.first_month && day < dates.first_day)
                day_elem.classList.add('no-data')
            day_elem.style.setProperty('background-color', this.config.color_callback([year, month, day], day_data))
            return day_elem
        }

        // Creates a simple heatmap with 24 squares that represent a single day
        _init_single_day(data, dates) {
            let day = this._create_elem({ type: 'div', class: 'single-day ' + this.config.id })
            this._add_transitions(day)
            let hour_data = data[dates.first_year][dates.first_month][dates.first_day].hours
            let current_hour = new Date().getHours()
            for (let i = 0; i < 24; i++) {
                let j = (i + this.config.day_start) % 24
                let hour = this._create_elem({
                    type: 'div',
                    class:
                        'hour hover-wrapper-target' +
                        (j === current_hour && Date.parse(new Date().toDateString()) == this.config.first_date
                            ? ' today marked'
                            : ''),
                    info: { counts: hour_data[i].counts, lists: hour_data[i].lists },
                })
                let hover = this._create_elem({
                    type: 'div',
                    class: 'hover-wrapper',
                    child: this.config.day_hover_callback(
                        [dates.first_year, dates.first_month, dates.first_day, j],
                        hour_data[i],
                    ),
                })
                hour.append(hover)
                hour.style.setProperty(
                    'background-color',
                    this.config.color_callback([dates.first_year, dates.first_month, dates.first_day, j], hour_data[i]),
                )
                day.append(hour)
            }
            day.instance = this
            return day
        }

        // Marks provided dates with a border
        _add_markings(markings, years) {
            for (let [date, mark] of markings) {
                let [year, month, day] = this._get_ymdh(date)
                if (years[year])
                    years[year]
                        .querySelector(`.day[data-date="${year}-${month}-${day}"]`)
                        .classList.add(...mark.split(' '), 'marked')
            }
        }

        // Number of days in each month
        _get_days_in_month(year, month) {
            return [31, this._is_leap_year(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
        }

        // Checks for leap year
        _is_leap_year(year) {
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
        }

        // Shorthand for creating new elements
        _create_elem(config) {
            let div = document.createElement(config.type)
            for (let [attr, value] of Object.entries(config)) {
                if (attr === 'type') continue
                else if (attr === 'class') div.className = value
                else if (attr === 'child') div.append(value)
                else if (attr === 'children') div.append(...value)
                else div[attr] = value
            }
            return div
        }

        // Get first and last dates that should be visible in the heatmap
        _get_dates() {
            let [first_year, first_month, first_day] = this._get_ymdh(this.config.first_date)
            let [last_year, last_month, last_day] = this._get_ymdh(this.config.last_date || Date.now())
            return { first_year, first_month, first_day, last_year, last_month, last_day }
        }

        // Convert date into year month date and hour
        _get_ymdh(date) {
            let d = new Date(date)
            return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours()]
        }

        // Add hover transition
        _add_transitions(elem) {
            elem.addEventListener('mouseover', (event) => {
                const elem = event.target.closest('.hover-wrapper-target')
                if (!elem) return
                elem.classList.add('heatmap-transition')
                setTimeout((_) => elem.classList.remove('heatmap-transition'), 20)
            })
        }
    }

    // Expose class
    window.Heatmap = Heatmap
})()
