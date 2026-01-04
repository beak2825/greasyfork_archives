// ==UserScript==
// @name         United Trip Summary Renderer
// @namespace    https://github.com/wangdashuai888/United-Trip-Summary
// @version      1.2
// @description  Extracts and displays detailed flight info from /api/myTrips/lookup JSON on united.com after booking lookup completes.
// @author       wangdashuai888
// @include      https://www.united.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532671/United%20Trip%20Summary%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/532671/United%20Trip%20Summary%20Renderer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalXHR = window.XMLHttpRequest;
    class InterceptedXHR extends originalXHR {
        constructor() {
            super();
            let url = '', method = '';
            const origOpen = this.open;
            const origSend = this.send;

            this.open = function (m, u) {
                method = m;
                url = u;
                return origOpen.apply(this, arguments);
            };

            this.send = function (body) {
                this.addEventListener('load', function () {
                    if (url.includes('/api/myTrips/lookup') && method.toUpperCase() === 'POST') {
                        try {
                            const json = JSON.parse(this.responseText);
                            renderFlightSummary(json);
                        } catch (err) {
                            console.error('❌ Failed to parse response JSON:', err);
                        }
                    }
                });
                return origSend.apply(this, arguments);
            };
        }
    }
    window.XMLHttpRequest = InterceptedXHR;

    function renderFlightSummary(data) {
        const detail = data?.Detail;
        if (!detail) return;

        const container = document.createElement('div');
        container.style = 'background: #f0f8ff; border: 2px solid #0071bc; padding: 16px; margin: 20px; font-family: sans-serif; line-height: 1.6; white-space: pre-wrap; max-width: 1000px;';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🔄 Toggle: Show Raw JSON';
        toggleBtn.style = 'margin-bottom: 10px; padding: 10px 16px; font-size: 15px; font-weight: bold; border: 2px solid #005ea2; background-color: #e0f0ff; color: #003b70; border-radius: 6px; cursor: pointer;';
        container.appendChild(toggleBtn);

        const summaryView = document.createElement('div');
        const rawJsonView = document.createElement('pre');
        rawJsonView.style.display = 'none';
        rawJsonView.style.maxHeight = '500px';
        rawJsonView.style.overflow = 'auto';
        rawJsonView.style.background = '#fff';
        rawJsonView.style.border = '1px solid #ccc';
        rawJsonView.style.padding = '10px';
        rawJsonView.textContent = JSON.stringify(data, null, 2);

        const flights = extractFlights(detail);
        const tickets = extractTickets(detail);
        const passengers = extractPassengers(detail);
        const remarks = extractRemarks(detail);
        const ssrs = extractSSRs(detail, data);

        const lines = [];

        lines.push(`\n✈️ Confirmation #: ${detail.ConfirmationID}\n`);
        lines.push(`📅 Booking Date: ${detail.CreateDate}`);

        lines.push(`\n📍 Flights:`);
        for (const f of flights) {
            lines.push(`- ${f.MarketingAirlineCode}${f.FlightNumber} ${f.OriginAirportCode} → ${f.DestinationAirportCode}`);
            lines.push(`  · Status: ${f.Status}, Action: ${f.CurrentActionCode}`);
            lines.push(`  · Departure: ${f.ScheduledDeparture}`);
            lines.push(`  · Arrival:   ${f.ScheduledArrival}`);
            lines.push(`  · Cabin: ${f.ClassOfService} (${f.Cabin}), Operated by ${f.OperatingAirlineCode}`);
        }

        lines.push(`\n🎟 Tickets:`);
        for (const t of tickets) {
            lines.push(`- Ticket #: ${t.DocumentID}`);
            lines.push(`  · Issue: ${t.IssueDate}, Valid Until: ${t.TicketValidityDate}`);
            for (const c of t.Coupons) {
                lines.push(`    • ${c.Status}: ${c.OperatingAirlineCode} ${c.FlightNumber} (${c.DepartureAirport} → ${c.ArrivalAirport})`);
            }
        }

        lines.push(`\n🧍 Passengers:`);
        for (const p of passengers) {
            lines.push(`- ${p.Name} (Status: ${p.Status})`);
        }

        if (ssrs.length) {
            lines.push(`\n📑 SSRs:`);
            for (const s of ssrs) {
                lines.push(`- ${s.Code || s.Key}: ${s.Description || s.Comments || JSON.stringify(s)}`);
            }
        }

        if (remarks.length) {
            lines.push(`\n🗒 Remarks:`);
            for (const r of remarks) {
                lines.push(`- [${r.DisplaySequence}] ${r.Description}`);
            }
        }

        summaryView.textContent = lines.join('\n');
        container.appendChild(summaryView);
        container.appendChild(rawJsonView);
        document.body.prepend(container);

        toggleBtn.addEventListener('click', () => {
            const showingJson = rawJsonView.style.display === 'block';
            rawJsonView.style.display = showingJson ? 'none' : 'block';
            summaryView.style.display = showingJson ? 'block' : 'none';
            toggleBtn.textContent = showingJson ? '🔄 Toggle: Show Raw JSON' : '🔄 Toggle: Show Summary';
        });
    }

    function extractFlights(detail) {
        const segments = detail.FlightSegments || [];
        return segments.map(seg => {
            const f = seg.FlightSegment || {};
            return {
                OriginAirportCode: f.DepartureAirport?.IATACode || 'N/A',
                DestinationAirportCode: f.ArrivalAirport?.IATACode || 'N/A',
                Distance: f.Distance || 'N/A',
                CurrentActionCode: f.FlightSegmentType || '—',
                Status: seg.Characteristic?.find(c => c.Code === 'uflifo-FlightStatus')?.Value || 'N/A',
                MarketingAirlineCode: f.MarketedFlightSegment?.[0]?.MarketingAirlineCode || 'N/A',
                OperatingAirlineCode: f.OperatingAirlineCode || 'N/A',
                ClassOfService: seg.BookingClass?.Cabin?.Name || 'N/A',
                Cabin: seg.BookingClass?.Code || 'N/A',
                UpgradeStatus: f.UpgradeEligibilityStatus || '—',
                ScheduledDeparture: f.DepartureDateTime,
                ScheduledArrival: f.ArrivalDateTime,
                FlightNumber: f.FlightNumber
            };
        });
    }

    function extractTickets(detail) {
        const travelers = detail.Travelers || [];
        const tickets = [];
        for (const traveler of travelers) {
            for (const tkt of (traveler.Tickets || [])) {
                const coupons = (tkt.FlightCoupons || []).map(cpn => ({
                    Status: cpn.Status?.Code || '—',
                    DepartureAirport: cpn.FlightSegment?.DepartureAirport?.IATACode || 'N/A',
                    ArrivalAirport: cpn.FlightSegment?.ArrivalAirport?.IATACode || 'N/A',
                    FlightNumber: cpn.FlightSegment?.FlightNumber || 'N/A',
                    OperatingAirlineCode: cpn.FlightSegment?.OperatingAirlineCode || 'N/A'
                }));
                tickets.push({
                    DocumentID: tkt.DocumentID,
                    IssueDate: tkt.IssueDate,
                    TicketValidityDate: tkt.TicketValidityDate,
                    Coupons: coupons
                });
            }
        }
        return tickets;
    }

    function extractPassengers(detail) {
        return (detail.Travelers || []).map(p => ({
            Name: `${p.Person?.GivenName || ''} ${p.Person?.Surname || ''}`.trim(),
            Status: p.LoyaltyProgramProfile?.LoyaltyProgramMemberTierLevel || 'N/A'
        }));
    }

    function extractRemarks(detail) {
        return (detail.Remarks || []).map(r => ({
            DisplaySequence: r.DisplaySequence,
            Description: r.Description
        }));
    }

    function extractSSRs(detail, fullData) {
        const services = detail.Services || [];
        if (services.length > 0) {
            return services.map(s => ({
                Code: s.Code,
                Description: s.Description,
                Key: s.Key,
                Comments: s.Comments
            }));
        }
        // Fallback: parse SSRs from Traveler.Characteristics
        const ssrs = [];
        for (const t of (detail.Travelers || [])) {
            for (const c of (t.Characteristics || [])) {
                if ((c.Value || '').toUpperCase() === 'SSR') {
                    ssrs.push({
                        Code: c.Code,
                        Description: c.Description,
                        Comments: ''
                    });
                }
            }
        }
        return ssrs;
    }
})();
