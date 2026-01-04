// ==UserScript==
// @name        Spotimizer
// @namespace   Violentmonkey Scripts
// @description Set of utils right where you're listening.
// @match       https://open.spotify.com/*
// @version     0.0.0
// @author      Team Spotimizer
// @timestamp   2024-12-20T12:10:29.266Z
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521293/Spotimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/521293/Spotimizer.meta.js
// ==/UserScript==

(function (web, solidJs) {
'use strict';

const waitForSpotifyPageElementToExist = (elementTestId, setElement) => {
  // todo: find some better solution than setTimeout...
  // works for now though
  setTimeout(() => {
    checkAndSetElement(elementTestId, setElement);
  }, 100);
};
const checkAndSetElement = (elementTestId, setElement) => {
  const searchedElement = document.querySelector(`[data-testid=${elementTestId}`);
  if (searchedElement) {
    setElement(searchedElement);
  } else {
    waitForSpotifyPageElementToExist(elementTestId, setElement);
  }
};

class EndpointsBase {
    api;
    constructor(api) {
        this.api = api;
    }
    async getRequest(url) {
        return await this.api.makeRequest("GET", url);
    }
    async postRequest(url, body, contentType = undefined) {
        return await this.api.makeRequest("POST", url, body, contentType);
    }
    async putRequest(url, body, contentType = undefined) {
        return await this.api.makeRequest("PUT", url, body, contentType);
    }
    async deleteRequest(url, body) {
        return await this.api.makeRequest("DELETE", url, body);
    }
    paramsFor(args) {
        const params = new URLSearchParams();
        for (let key of Object.getOwnPropertyNames(args)) {
            if (args[key] || (args[key] === 0) || (!args[key] && typeof args[key] === 'boolean')) {
                params.append(key, args[key].toString());
            }
        }
        return [...params].length > 0 ? `?${params.toString()}` : "";
    }
}

class AlbumsEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            const album = await this.getRequest(`albums/${idOrIds}${params}`);
            return album;
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        // TODO: only returns top 20, validate here
        const response = await this.getRequest(`albums${params}`);
        return response.albums;
    }
    tracks(albumId, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`albums/${albumId}/tracks${params}`);
    }
}

class ArtistsEndpoints extends EndpointsBase {
    async get(idOrIds) {
        if (typeof idOrIds === "string") {
            const artist = this.getRequest(`artists/${idOrIds}`);
            return artist;
        }
        const params = this.paramsFor({ ids: idOrIds });
        const response = await this.getRequest(`artists${params}`);
        return response.artists;
    }
    albums(id, includeGroups, market, limit, offset) {
        const params = this.paramsFor({
            include_groups: includeGroups,
            market,
            limit,
            offset,
        });
        return this.getRequest(`artists/${id}/albums${params}`);
    }
    topTracks(id, market) {
        // BUG: market is flagged as optional in the docs, but it's actually required for this endpoint
        // otherwise you get a 400
        const params = this.paramsFor({ market });
        return this.getRequest(`artists/${id}/top-tracks${params}`);
    }
    relatedArtists(id) {
        return this.getRequest(`artists/${id}/related-artists`);
    }
}

class AudiobooksEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`audiobooks/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`audiobooks${params}`);
        return response.audiobooks;
    }
    getAudiobookChapters(id, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`audiobooks/${id}/chapters${params}`);
    }
}

class BrowseEndpoints extends EndpointsBase {
    getCategories(country, locale, limit, offset) {
        const params = this.paramsFor({ country, locale, limit, offset });
        return this.getRequest(`browse/categories${params}`);
    }
    getCategory(categoryId, country, locale) {
        const params = this.paramsFor({ country, locale });
        return this.getRequest(`browse/categories/${categoryId}${params}`);
    }
    getNewReleases(country, limit, offset) {
        const params = this.paramsFor({ country, limit, offset });
        return this.getRequest(`browse/new-releases${params}`);
    }
    getFeaturedPlaylists(country, locale, timestamp, limit, offset) {
        const params = this.paramsFor({ country, locale, timestamp, limit, offset });
        return this.getRequest(`browse/featured-playlists${params}`);
    }
    getPlaylistsForCategory(category_id, country, limit, offset) {
        const params = this.paramsFor({ country, limit, offset });
        return this.getRequest(`browse/categories/${category_id}/playlists${params}`);
    }
}

class ChaptersEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`chapters/${idOrIds}${params}`);
        }
        // TODO: Only returns top 50, validate / pre-check here
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`chapters${params}`);
        return response.chapters;
    }
}

class EpisodesEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`episodes/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`episodes${params}`);
        return response.episodes;
    }
}

class RecommendationsEndpoints extends EndpointsBase {
    get(request) {
        const params = this.paramsFor(request);
        return this.getRequest(`recommendations${params}`);
    }
    genreSeeds() {
        return this.getRequest('recommendations/available-genre-seeds');
    }
}

class MarketsEndpoints extends EndpointsBase {
    getAvailableMarkets() {
        return this.getRequest('markets');
    }
}

class PlayerEndpoints extends EndpointsBase {
    getPlaybackState(market, additional_types) {
        const params = this.paramsFor({ market, additional_types });
        return this.getRequest(`me/player${params}`);
    }
    getAvailableDevices() {
        return this.getRequest('me/player/devices');
    }
    getCurrentlyPlayingTrack(market, additional_types) {
        const params = this.paramsFor({ market, additional_types });
        return this.getRequest(`me/player/currently-playing${params}`);
    }
    getRecentlyPlayedTracks(limit, queryRange) {
        const paramObj = { limit };
        if (queryRange) {
            if (queryRange.type === "before") {
                paramObj.before = queryRange.timestamp;
            }
            else if (queryRange.type === "after") {
                paramObj.after = queryRange.timestamp;
            }
        }
        const params = this.paramsFor(paramObj);
        return this.getRequest(`me/player/recently-played${params}`);
    }
    getUsersQueue() {
        return this.getRequest('me/player/queue');
    }
    async transferPlayback(device_ids, play) {
        if (device_ids.length > 1) {
            throw new Error("Although an array is accepted, only a single device_id is currently supported. Supplying more than one will return 400 Bad Request");
        }
        await this.putRequest('me/player', { device_ids, play });
    }
    async startResumePlayback(device_id, context_uri, uris, offset, positionMs) {
        const params = this.paramsFor({ device_id });
        await this.putRequest(`me/player/play${params}`, { context_uri, uris, offset, positionMs });
    }
    async pausePlayback(device_id) {
        const params = this.paramsFor({ device_id });
        await this.putRequest(`me/player/pause${params}`);
    }
    async skipToNext(device_id) {
        const params = this.paramsFor({ device_id });
        await this.postRequest(`me/player/next${params}`);
    }
    async skipToPrevious(device_id) {
        const params = this.paramsFor({ device_id });
        await this.postRequest(`me/player/previous${params}`);
    }
    async seekToPosition(position_ms, device_id) {
        const params = this.paramsFor({ position_ms, device_id });
        await this.putRequest(`me/player/seek${params}`);
    }
    async setRepeatMode(state, device_id) {
        const params = this.paramsFor({ state, device_id });
        await this.putRequest(`me/player/repeat${params}`);
    }
    async setPlaybackVolume(volume_percent, device_id) {
        const params = this.paramsFor({ volume_percent, device_id });
        await this.putRequest(`me/player/volume${params}`);
    }
    async togglePlaybackShuffle(state, device_id) {
        const params = this.paramsFor({ state, device_id });
        await this.putRequest(`me/player/shuffle${params}`);
    }
    async addItemToPlaybackQueue(uri, device_id) {
        const params = this.paramsFor({ uri, device_id });
        await this.postRequest(`me/player/queue${params}`);
    }
}

class PlaylistsEndpoints extends EndpointsBase {
    getPlaylist(playlist_id, market, fields, additional_types) {
        // TODO: better support for fields
        const params = this.paramsFor({ market, fields, additional_types: additional_types?.join(',') });
        return this.getRequest(`playlists/${playlist_id}${params}`);
    }
    getPlaylistItems(playlist_id, market, fields, limit, offset, additional_types) {
        // TODO: better support for fields
        const params = this.paramsFor({ market, fields, limit, offset, additional_types: additional_types?.join(',') });
        return this.getRequest(`playlists/${playlist_id}/tracks${params}`);
    }
    async changePlaylistDetails(playlist_id, request) {
        await this.putRequest(`playlists/${playlist_id}`, request);
    }
    movePlaylistItems(playlist_id, range_start, range_length, moveToPosition) {
        return this.updatePlaylistItems(playlist_id, {
            range_start,
            range_length,
            insert_before: moveToPosition
        });
    }
    updatePlaylistItems(playlist_id, request) {
        return this.putRequest(`playlists/${playlist_id}/tracks`, request);
    }
    async addItemsToPlaylist(playlist_id, uris, position) {
        await this.postRequest(`playlists/${playlist_id}/tracks`, { position, uris: uris });
    }
    async removeItemsFromPlaylist(playlist_id, request) {
        await this.deleteRequest(`playlists/${playlist_id}/tracks`, request);
    }
    getUsersPlaylists(user_id, limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`users/${user_id}/playlists${params}`);
    }
    createPlaylist(user_id, request) {
        return this.postRequest(`users/${user_id}/playlists`, request);
    }
    getPlaylistCoverImage(playlist_id) {
        return this.getRequest(`playlists/${playlist_id}/images`);
    }
    async addCustomPlaylistCoverImage(playlist_id, imageData) {
        let base64EncodedJpeg = "";
        if (imageData instanceof Buffer) {
            base64EncodedJpeg = imageData.toString("base64");
        }
        else if (imageData instanceof HTMLCanvasElement) {
            base64EncodedJpeg = imageData.toDataURL("image/jpeg").split(';base64,')[1];
        }
        else if (imageData instanceof HTMLImageElement) {
            const canvas = document.createElement("canvas");
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("Could not get canvas context");
            }
            ctx.drawImage(imageData, 0, 0);
            base64EncodedJpeg = canvas.toDataURL("image/jpeg").split(';base64,')[1];
        }
        else if (typeof imageData === "string") {
            base64EncodedJpeg = imageData;
        }
        else {
            throw new Error("ImageData must be a Buffer, HTMLImageElement, HTMLCanvasElement, or string containing a base64 encoded jpeg");
        }
        await this.addCustomPlaylistCoverImageFromBase64String(playlist_id, base64EncodedJpeg);
    }
    async addCustomPlaylistCoverImageFromBase64String(playlist_id, base64EncodedJpeg) {
        await this.putRequest(`playlists/${playlist_id}/images`, base64EncodedJpeg, "image/jpeg");
    }
}

class SearchEndpoints extends EndpointsBase {
    async execute(q, type, market, limit, offset, include_external) {
        const params = this.paramsFor({ q, type, market, limit, offset, include_external });
        return await this.getRequest(`search${params}`);
    }
}

class ShowsEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`shows/${idOrIds}${params}`);
        }
        // TODO: only returns 50, validate here
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`shows${params}`);
        return response.shows;
    }
    episodes(id, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`shows/${id}/episodes${params}`);
    }
}

class TracksEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`tracks/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        // TODO: only returns top 20, validate here
        const response = await this.getRequest(`tracks${params}`);
        return response.tracks;
    }
    async audioFeatures(idOrIds) {
        if (typeof idOrIds === 'string') {
            return this.getRequest(`audio-features/${idOrIds}`);
        }
        const params = this.paramsFor({ ids: idOrIds });
        const response = await this.getRequest(`audio-features${params}`);
        return response.audio_features;
    }
    audioAnalysis(id) {
        return this.getRequest(`audio-analysis/${id}`);
    }
}

const emptyAccessToken = { access_token: "emptyAccessToken", token_type: "", expires_in: 0, refresh_token: "", expires: -1 };
function isEmptyAccessToken(value) {
    return value === emptyAccessToken;
}

class UsersEndpoints extends EndpointsBase {
    profile(userId) {
        return this.getRequest(`users/${userId}`);
    }
}

class CurrentUserEndpoints extends EndpointsBase {
    albums;
    audiobooks;
    episodes;
    playlists;
    shows;
    tracks;
    constructor(api) {
        super(api);
        this.albums = new CurrentUserAlbumsEndpoints(api);
        this.audiobooks = new CurrentUserAudiobooksEndpoints(api);
        this.episodes = new CurrentUserEpisodesEndpoints(api);
        this.playlists = new CurrentUserPlaylistsEndpoints(api);
        this.shows = new CurrentUserShowsEndpoints(api);
        this.tracks = new CurrentUserTracksEndpoints(api);
    }
    profile() {
        return this.getRequest('me');
    }
    topItems(type, time_range, limit, offset) {
        const params = this.paramsFor({ time_range, limit, offset });
        return this.getRequest(`me/top/${type}${params}`);
    }
    followedArtists(after, limit) {
        const params = this.paramsFor({ type: "artist", after, limit });
        return this.getRequest(`me/following${params}`);
    }
    async followArtistsOrUsers(ids, type) {
        const params = this.paramsFor({ type });
        await this.putRequest(`me/following${params}`, { ids });
    }
    async unfollowArtistsOrUsers(ids, type) {
        const params = this.paramsFor({ type });
        await this.deleteRequest(`me/following${params}`, { ids });
    }
    followsArtistsOrUsers(ids, type) {
        const params = this.paramsFor({ ids, type });
        return this.getRequest(`me/following/contains${params}`);
    }
}
class CurrentUserAlbumsEndpoints extends EndpointsBase {
    savedAlbums(limit, offset, market) {
        const params = this.paramsFor({ limit, offset, market });
        return this.getRequest(`me/albums${params}`);
    }
    async saveAlbums(ids) {
        await this.putRequest('me/albums', ids);
    }
    async removeSavedAlbums(ids) {
        await this.deleteRequest('me/albums', ids);
    }
    hasSavedAlbums(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/albums/contains${params}`);
    }
}
class CurrentUserAudiobooksEndpoints extends EndpointsBase {
    savedAudiobooks(limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`me/audiobooks${params}`);
    }
    async saveAudiobooks(ids) {
        await this.putRequest('me/audiobooks', ids);
    }
    async removeSavedAudiobooks(ids) {
        await this.deleteRequest('me/audiobooks', ids);
    }
    hasSavedAudiobooks(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/audiobooks/contains${params}`);
    }
}
class CurrentUserEpisodesEndpoints extends EndpointsBase {
    savedEpisodes(market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`me/episodes${params}`);
    }
    async saveEpisodes(ids) {
        await this.putRequest(`me/episodes`, ids);
    }
    async removeSavedEpisodes(ids) {
        await this.deleteRequest(`me/episodes`, ids);
    }
    hasSavedEpisodes(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/episodes/contains${params}`);
    }
}
class CurrentUserPlaylistsEndpoints extends EndpointsBase {
    playlists(limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`me/playlists${params}`);
    }
    async follow(playlist_id) {
        await this.putRequest(`playlists/${playlist_id}/followers`);
    }
    async unfollow(playlist_id) {
        await this.deleteRequest(`playlists/${playlist_id}/followers`);
    }
    isFollowing(playlistId, ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`playlists/${playlistId}/followers/contains${params}`);
    }
}
class CurrentUserShowsEndpoints extends EndpointsBase {
    savedShows(limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`me/shows${params}`);
    }
    saveShows(ids) {
        const params = this.paramsFor({ ids });
        return this.putRequest(`me/shows${params}`);
    }
    removeSavedShows(ids, market) {
        const params = this.paramsFor({ ids, market });
        return this.deleteRequest(`me/shows${params}`);
    }
    hasSavedShow(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/shows/contains${params}`);
    }
}
class CurrentUserTracksEndpoints extends EndpointsBase {
    savedTracks(limit, offset, market) {
        const params = this.paramsFor({ limit, offset, market });
        return this.getRequest(`me/tracks${params}`);
    }
    async saveTracks(ids) {
        await this.putRequest('me/tracks', ids);
    }
    async removeSavedTracks(ids) {
        await this.deleteRequest('me/tracks', ids);
    }
    hasSavedTracks(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/tracks/contains${params}`);
    }
}

class Crypto {
    static get current() {
        return this.hasSubtleCrypto ? window.crypto : this.tryLoadNodeWebCrypto();
    }
    static get hasSubtleCrypto() {
        return typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.subtle !== 'undefined';
    }
    static tryLoadNodeWebCrypto() {
        try {
            // Deliberately avoid bundling for browsers depending
            // on node by doing this require during execution.
            const { webcrypto } = require('crypto');
            return webcrypto;
        }
        catch (e) {
            throw e;
        }
    }
}

class AccessTokenHelpers {
    static async refreshCachedAccessToken(clientId, item) {
        const updated = await AccessTokenHelpers.refreshToken(clientId, item.refresh_token);
        return AccessTokenHelpers.toCachable(updated);
    }
    static toCachable(item) {
        if (item.expires && item.expires === -1) {
            return item;
        }
        return { ...item, expires: this.calculateExpiry(item) };
    }
    static calculateExpiry(item) {
        return Date.now() + (item.expires_in * 1000);
    }
    static async refreshToken(clientId, refreshToken) {
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });
        const text = await result.text();
        if (!result.ok) {
            throw new Error(`Failed to refresh token: ${result.statusText}, ${text}`);
        }
        const json = JSON.parse(text);
        return json;
    }
    static generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    static async generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await Crypto.current.subtle.digest('SHA-256', data);
        const digestBytes = [...new Uint8Array(digest)];
        const hasBuffer = typeof Buffer !== 'undefined';
        const digestAsBase64 = hasBuffer
            ? Buffer.from(digest).toString('base64')
            : btoa(String.fromCharCode.apply(null, digestBytes));
        return digestAsBase64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}

class ClientCredentialsStrategy {
    clientId;
    clientSecret;
    scopes;
    static cacheKey = "spotify-sdk:ClientCredentialsStrategy:token";
    configuration = null;
    get cache() { return this.configuration.cachingStrategy; }
    constructor(clientId, clientSecret, scopes = []) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.scopes = scopes;
    }
    setConfiguration(configuration) {
        this.configuration = configuration;
    }
    async getOrCreateAccessToken() {
        const token = await this.cache.getOrCreate(ClientCredentialsStrategy.cacheKey, async () => {
            const token = await this.getTokenFromApi();
            return AccessTokenHelpers.toCachable(token);
        }, async (_) => {
            const refreshed = await this.getTokenFromApi();
            return AccessTokenHelpers.toCachable(refreshed);
        });
        return token;
    }
    async getAccessToken() {
        const token = await this.cache.get(ClientCredentialsStrategy.cacheKey);
        return token;
    }
    removeAccessToken() {
        this.cache.remove(ClientCredentialsStrategy.cacheKey);
    }
    async getTokenFromApi() {
        const options = {
            grant_type: 'client_credentials',
            scope: this.scopes.join(' ')
        };
        const bodyAsString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
        const hasBuffer = typeof Buffer !== 'undefined';
        const credentials = `${this.clientId}:${this.clientSecret}`;
        const basicAuth = hasBuffer
            ? Buffer.from(credentials).toString('base64')
            : btoa(credentials);
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${basicAuth}`
            },
            body: bodyAsString
        });
        if (result.status !== 200) {
            throw new Error("Failed to get access token.");
        }
        const json = await result.json();
        return json;
    }
}

class ImplicitGrantStrategy {
    clientId;
    redirectUri;
    scopes;
    static cacheKey = "spotify-sdk:ImplicitGrantStrategy:token";
    configuration = null;
    get cache() { return this.configuration.cachingStrategy; }
    constructor(clientId, redirectUri, scopes) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.scopes = scopes;
    }
    setConfiguration(configuration) {
        this.configuration = configuration;
    }
    async getOrCreateAccessToken() {
        const token = await this.cache.getOrCreate(ImplicitGrantStrategy.cacheKey, async () => {
            const token = await this.redirectOrVerifyToken();
            return AccessTokenHelpers.toCachable(token);
        }, async (expiring) => {
            return AccessTokenHelpers.refreshCachedAccessToken(this.clientId, expiring);
        });
        return token;
    }
    async getAccessToken() {
        const token = await this.cache.get(ImplicitGrantStrategy.cacheKey);
        return token;
    }
    removeAccessToken() {
        this.cache.remove(ImplicitGrantStrategy.cacheKey);
    }
    async redirectOrVerifyToken() {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
            return Promise.resolve({
                access_token: accessToken,
                token_type: hashParams.get("token_type") ?? "",
                expires_in: parseInt(hashParams.get("expires_in") ?? "0"),
                refresh_token: hashParams.get("refresh_token") ?? "",
                expires: Number(hashParams.get("expires")) || 0
            });
        }
        const scopes = this.scopes ?? [];
        var scope = scopes.join(' ');
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "token");
        params.append("redirect_uri", this.redirectUri);
        params.append("scope", scope);
        const authUrl = 'https://accounts.spotify.com/authorize?' + params.toString();
        this.configuration.redirectionStrategy.redirect(authUrl);
        return emptyAccessToken;
    }
}

class AuthorizationCodeWithPKCEStrategy {
    clientId;
    redirectUri;
    scopes;
    static cacheKey = "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token";
    configuration = null;
    get cache() { return this.configuration.cachingStrategy; }
    constructor(clientId, redirectUri, scopes) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.scopes = scopes;
    }
    setConfiguration(configuration) {
        this.configuration = configuration;
    }
    async getOrCreateAccessToken() {
        const token = await this.cache.getOrCreate(AuthorizationCodeWithPKCEStrategy.cacheKey, async () => {
            const token = await this.redirectOrVerifyToken();
            return AccessTokenHelpers.toCachable(token);
        }, async (expiring) => {
            return AccessTokenHelpers.refreshCachedAccessToken(this.clientId, expiring);
        });
        return token;
    }
    async getAccessToken() {
        const token = await this.cache.get(AuthorizationCodeWithPKCEStrategy.cacheKey);
        return token;
    }
    removeAccessToken() {
        this.cache.remove(AuthorizationCodeWithPKCEStrategy.cacheKey);
    }
    async redirectOrVerifyToken() {
        const hashParams = new URLSearchParams(window.location.search);
        const code = hashParams.get("code");
        if (code) {
            const token = await this.verifyAndExchangeCode(code);
            this.removeCodeFromUrl();
            return token;
        }
        this.redirectToSpotify();
        return emptyAccessToken; // Redirected away at this point, just make TypeScript happy :)         
    }
    async redirectToSpotify() {
        const verifier = AccessTokenHelpers.generateCodeVerifier(128);
        const challenge = await AccessTokenHelpers.generateCodeChallenge(verifier);
        const singleUseVerifier = { verifier, expiresOnAccess: true };
        this.cache.setCacheItem("spotify-sdk:verifier", singleUseVerifier);
        const redirectTarget = await this.generateRedirectUrlForUser(this.scopes, challenge);
        await this.configuration.redirectionStrategy.redirect(redirectTarget);
    }
    async verifyAndExchangeCode(code) {
        const cachedItem = await this.cache.get("spotify-sdk:verifier");
        const verifier = cachedItem?.verifier;
        if (!verifier) {
            throw new Error("No verifier found in cache - can't validate query string callback parameters.");
        }
        await this.configuration.redirectionStrategy.onReturnFromRedirect();
        return await this.exchangeCodeForToken(code, verifier);
    }
    removeCodeFromUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        const newUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, newUrl);
    }
    async generateRedirectUrlForUser(scopes, challenge) {
        const scope = scopes.join(' ');
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", this.redirectUri);
        params.append("scope", scope);
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }
    async exchangeCodeForToken(code, verifier) {
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", this.redirectUri);
        params.append("code_verifier", verifier);
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });
        const text = await result.text();
        if (!result.ok) {
            throw new Error(`Failed to exchange code for token: ${result.statusText}, ${text}`);
        }
        const json = JSON.parse(text);
        return json;
    }
}

class DefaultResponseDeserializer {
    async deserialize(response) {
        const text = await response.text();
        if (text.length > 0) {
            const json = JSON.parse(text);
            return json;
        }
        return null;
    }
}

class DefaultResponseValidator {
    async validateResponse(response) {
        switch (response.status) {
            case 401:
                throw new Error("Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.");
            case 403:
                const body = await response.text();
                throw new Error(`Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here. Body: ${body}`);
            case 429:
                throw new Error("The app has exceeded its rate limits.");
            default:
                if (!response.status.toString().startsWith('20')) {
                    const body = await response.text();
                    throw new Error(`Unrecognised response code: ${response.status} - ${response.statusText}. Body: ${body}`);
                }
        }
    }
}

class NoOpErrorHandler {
    async handleErrors(_) {
        return false;
    }
}

class DocumentLocationRedirectionStrategy {
    async redirect(targetUrl) {
        document.location = targetUrl.toString();
    }
    async onReturnFromRedirect() {
    }
}

class GenericCache {
    storage;
    updateFunctions;
    autoRenewInterval;
    autoRenewWindow;
    constructor(storage, updateFunctions = new Map(), autoRenewInterval = 0, autoRenewWindow = 2 * 60 * 1000 // Two minutes
    ) {
        this.storage = storage;
        this.updateFunctions = updateFunctions;
        this.autoRenewInterval = autoRenewInterval;
        this.autoRenewWindow = autoRenewWindow;
        if (this.autoRenewInterval > 0) {
            setInterval(() => this.autoRenewRenewableItems(), this.autoRenewInterval);
        }
    }
    async getOrCreate(cacheKey, createFunction, updateFunction) {
        if (updateFunction) {
            this.updateFunctions.set(cacheKey, updateFunction);
        }
        const item = await this.get(cacheKey);
        if (item) {
            return item;
        }
        const newCacheItem = await createFunction();
        if (!newCacheItem) {
            throw new Error("Could not create cache item");
        }
        if (!isEmptyAccessToken(newCacheItem)) {
            this.setCacheItem(cacheKey, newCacheItem);
        }
        return newCacheItem;
    }
    async get(cacheKey) {
        let asString = this.storage.get(cacheKey);
        let cachedItem = asString ? JSON.parse(asString) : null;
        if (this.itemDueToExpire(cachedItem) && this.updateFunctions.has(cacheKey)) {
            const updateFunction = this.updateFunctions.get(cacheKey);
            await this.tryUpdateItem(cacheKey, cachedItem, updateFunction);
            // Ensure updated item is returned
            asString = this.storage.get(cacheKey);
            cachedItem = asString ? JSON.parse(asString) : null;
        }
        if (!cachedItem) {
            return null;
        }
        if (cachedItem.expires && (cachedItem.expires === -1 || cachedItem.expires <= Date.now())) {
            this.remove(cacheKey);
            return null;
        }
        if (cachedItem.expiresOnAccess && cachedItem.expiresOnAccess === true) {
            this.remove(cacheKey);
            return cachedItem;
        }
        return cachedItem;
    }
    set(cacheKey, value, expiresIn) {
        const expires = Date.now() + expiresIn;
        const cacheItem = { ...value, expires };
        this.setCacheItem(cacheKey, cacheItem);
    }
    setCacheItem(cacheKey, cacheItem) {
        const asString = JSON.stringify(cacheItem);
        this.storage.set(cacheKey, asString);
    }
    remove(cacheKey) {
        this.storage.remove(cacheKey);
    }
    itemDueToExpire(item) {
        if (!item) {
            return false;
        }
        if (!item.expires) {
            return false;
        }
        return item.expires - Date.now() < (this.autoRenewWindow);
    }
    async autoRenewRenewableItems() {
        this.updateFunctions.forEach(async (updateFunction, key) => {
            const cachedItem = await this.get(key);
            if (!cachedItem) {
                return;
            }
            if (updateFunction && this.itemDueToExpire(cachedItem)) {
                await this.tryUpdateItem(key, cachedItem, updateFunction);
            }
        });
    }
    async tryUpdateItem(key, cachedItem, updateFunction) {
        try {
            const updated = await updateFunction(cachedItem);
            if (updated) {
                this.setCacheItem(key, updated);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}

class LocalStorageCachingStrategy extends GenericCache {
    constructor() {
        super(new LocalStorageCacheStore());
    }
}
class LocalStorageCacheStore {
    get(key) {
        return localStorage.getItem(key);
    }
    set(key, value) {
        localStorage.setItem(key, value);
    }
    remove(key) {
        localStorage.removeItem(key);
    }
}

class InMemoryCachingStrategy extends GenericCache {
    constructor() {
        super(new DictionaryCacheStore());
    }
}
class DictionaryCacheStore {
    cache = new Map();
    get(key) {
        return this.cache.get(key) ?? null;
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    remove(key) {
        this.cache.delete(key);
    }
}

/**
 * This strategy is used when you already have an access token and want to use it.
 * The authentication strategy will automatically renew the token when it expires.
 * Designed to allow a browser-based-app to post the access token to the server and use it from there.
 * @constructor
 * @param {string} clientId - Spotify application client id.
 * @param {string} accessToken - The access token returned from a client side Authorization Code with PKCE flow.
 */
class ProvidedAccessTokenStrategy {
    clientId;
    accessToken;
    refreshTokenAction;
    constructor(clientId, accessToken, refreshTokenAction) {
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.refreshTokenAction = refreshTokenAction || AccessTokenHelpers.refreshCachedAccessToken;
        // If the raw token from the jwt response is provided here
        // Calculate an absolute `expiry` value.
        // Caveat: If this token isn't fresh, this value will be off.
        // It's the responsibility of the calling code to either set a valid
        // expires property, or ensure expires_in accounts for any lag between
        // issuing and passing here.
        if (!this.accessToken.expires) {
            this.accessToken.expires = AccessTokenHelpers.calculateExpiry(this.accessToken);
        }
    }
    setConfiguration(_) {
    }
    async getOrCreateAccessToken() {
        if (this.accessToken.expires && this.accessToken.expires <= Date.now()) {
            const refreshed = await this.refreshTokenAction(this.clientId, this.accessToken);
            this.accessToken = refreshed;
        }
        return this.accessToken;
    }
    async getAccessToken() {
        return this.accessToken;
    }
    removeAccessToken() {
        this.accessToken = {
            access_token: "",
            token_type: "",
            expires_in: 0,
            refresh_token: "",
            expires: 0
        };
    }
}

class SpotifyApi {
    sdkConfig;
    static rootUrl = "https://api.spotify.com/v1/";
    authenticationStrategy;
    albums;
    artists;
    audiobooks;
    browse;
    chapters;
    episodes;
    recommendations;
    markets;
    player;
    playlists;
    shows;
    tracks;
    users;
    search;
    currentUser;
    constructor(authentication, config) {
        this.sdkConfig = this.initializeSdk(config);
        this.albums = new AlbumsEndpoints(this);
        this.artists = new ArtistsEndpoints(this);
        this.audiobooks = new AudiobooksEndpoints(this);
        this.browse = new BrowseEndpoints(this);
        this.chapters = new ChaptersEndpoints(this);
        this.episodes = new EpisodesEndpoints(this);
        this.recommendations = new RecommendationsEndpoints(this);
        this.markets = new MarketsEndpoints(this);
        this.player = new PlayerEndpoints(this);
        this.playlists = new PlaylistsEndpoints(this);
        this.shows = new ShowsEndpoints(this);
        this.tracks = new TracksEndpoints(this);
        this.users = new UsersEndpoints(this);
        this.currentUser = new CurrentUserEndpoints(this);
        const search = new SearchEndpoints(this);
        this.search = search.execute.bind(search);
        this.authenticationStrategy = authentication;
        this.authenticationStrategy.setConfiguration(this.sdkConfig);
    }
    async makeRequest(method, url, body = undefined, contentType = undefined) {
        try {
            const accessToken = await this.authenticationStrategy.getOrCreateAccessToken();
            if (isEmptyAccessToken(accessToken)) {
                console.warn("No access token found, authenticating now.");
                return null;
            }
            const token = accessToken?.access_token;
            const fullUrl = SpotifyApi.rootUrl + url;
            const opts = {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": contentType ?? "application/json"
                },
                body: body ? typeof body === "string" ? body : JSON.stringify(body) : undefined
            };
            this.sdkConfig.beforeRequest(fullUrl, opts);
            const result = await this.sdkConfig.fetch(fullUrl, opts);
            this.sdkConfig.afterRequest(fullUrl, opts, result);
            if (result.status === 204) {
                return null;
            }
            await this.sdkConfig.responseValidator.validateResponse(result);
            return this.sdkConfig.deserializer.deserialize(result);
        }
        catch (error) {
            const handled = await this.sdkConfig.errorHandler.handleErrors(error);
            if (!handled) {
                throw error;
            }
            return null;
        }
    }
    initializeSdk(config) {
        const isBrowser = typeof window !== 'undefined';
        const defaultConfig = {
            fetch: (req, init) => fetch(req, init),
            beforeRequest: (_, __) => { },
            afterRequest: (_, __, ___) => { },
            deserializer: new DefaultResponseDeserializer(),
            responseValidator: new DefaultResponseValidator(),
            errorHandler: new NoOpErrorHandler(),
            redirectionStrategy: new DocumentLocationRedirectionStrategy(),
            cachingStrategy: isBrowser
                ? new LocalStorageCachingStrategy()
                : new InMemoryCachingStrategy()
        };
        return { ...defaultConfig, ...config };
    }
    switchAuthenticationStrategy(authentication) {
        this.authenticationStrategy = authentication;
        this.authenticationStrategy.setConfiguration(this.sdkConfig);
        this.authenticationStrategy.getOrCreateAccessToken(); // trigger any redirects 
    }
    /**
     * Use this when you're running in a browser and you want to control when first authentication+redirect happens.
    */
    async authenticate() {
        const response = await this.authenticationStrategy.getOrCreateAccessToken(); // trigger any redirects
        return {
            authenticated: response.expires > Date.now() && !isEmptyAccessToken(response),
            accessToken: response
        };
    }
    /**
     * @returns the current access token. null implies the SpotifyApi is not yet authenticated.
     */
    async getAccessToken() {
        return this.authenticationStrategy.getAccessToken();
    }
    /**
     * Removes the access token if it exists.
     */
    logOut() {
        this.authenticationStrategy.removeAccessToken();
    }
    static withUserAuthorization(clientId, redirectUri, scopes = [], config) {
        const strategy = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
        return new SpotifyApi(strategy, config);
    }
    static withClientCredentials(clientId, clientSecret, scopes = [], config) {
        const strategy = new ClientCredentialsStrategy(clientId, clientSecret, scopes);
        return new SpotifyApi(strategy, config);
    }
    static withImplicitGrant(clientId, redirectUri, scopes = [], config) {
        const strategy = new ImplicitGrantStrategy(clientId, redirectUri, scopes);
        return new SpotifyApi(strategy, config);
    }
    /**
     * Use this when you're running in a Node environment, and accepting the access token from a client-side `performUserAuthorization` call.
     * You can also use this method if you already have an access token and don't want to use the built-in authentication strategies.
     */
    static withAccessToken(clientId, token, config) {
        const strategy = new ProvidedAccessTokenStrategy(clientId, token);
        return new SpotifyApi(strategy, config);
    }
    static async performUserAuthorization(clientId, redirectUri, scopes, onAuthorizationOrUrl, config) {
        const strategy = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
        const client = new SpotifyApi(strategy, config);
        const accessToken = await client.authenticationStrategy.getOrCreateAccessToken();
        if (!isEmptyAccessToken(accessToken)) {
            if (typeof onAuthorizationOrUrl === "string") {
                console.log("Posting access token to postback URL.");
                await fetch(onAuthorizationOrUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(accessToken)
                });
            }
            else {
                await onAuthorizationOrUrl(accessToken);
            }
        }
        return {
            authenticated: accessToken.expires > Date.now() && !isEmptyAccessToken(accessToken),
            accessToken
        };
    }
}

function createSpotifyAPI() {
  const [getSdk, setSdk] = solidJs.createSignal(null);
  solidJs.onMount(async () => {
    const sdk = SpotifyApi.withUserAuthorization(
    //'5aef6731e8bb426e9fcf0e19782888aa', // Felix
    '177a99e999504de7ab9cc3594cfe5f76',
    // Lars
    'https://open.spotify.com', [
    //'ugc-image-upload',
    'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-private', 'playlist-modify-public', 'user-follow-modify', 'user-follow-read', 'user-read-playback-position', 'user-top-read', 'user-read-recently-played', 'user-library-modify', 'user-library-read',
    //'user-read-email',
    'user-read-private'
    //'user-soa-link',
    //'user-soa-unlink',
    //'soa-manage-entitlements',
    //'soa-manage-partner',
    //'soa-create-partner'
    ]);
    setSdk(sdk);
  });
  return {
    getSpotifyApi: getSdk
  };
}

function playlistURIToID(uri) {
  return uri.replace('spotify:playlist:', '');
}

var _tmpl$2$1 = /*#__PURE__*/web.template(`<div class="">`);
function CustomBar(props) {
  const [getCurrentlyPlayingWidget, setCurrentlyPlayingWidget] = solidJs.createSignal(null);
  const [getPlayPauseButton, setPlayPauseButton] = solidJs.createSignal(null);
  const [getCurrentlyPlayingItemTitle, setCurrentlyPlayingItemTitle] = solidJs.createSignal(null);
  const [getCurrentlyPlayingItem, setCurrentlyPlayingItem] = solidJs.createSignal(null);
  const [getAlternativeItem, setAlternativeItem] = solidJs.createSignal(null);
  const [getCurrentPlaylistId, setCurrentPlaylistId] = solidJs.createSignal(null);
  const {
    getSpotifyApi
  } = createSpotifyAPI();

  // function to pull playlist and store it in local storage
  const cachePlaylist = async playlistId => {
    const api = getSpotifyApi();
    const items = [];
    let total = -1;
    let offset = 0;
    const itemsPerPage = 50;
    while (total === -1 || total > offset) {
      try {
        //console.log('fetching playlist items', playlistId, offset);
        const data = await (api == null ? void 0 : api.playlists.getPlaylistItems(playlistId, undefined, undefined, itemsPerPage, offset));
        items.push(...data.items);
        total = data.total;
        offset += itemsPerPage;
        await new Promise(res => setTimeout(res, 1000));
      } catch (error) {
        if (error.status === 429) {
          const retryAfter = error.headers['retry-after'];
          console.warn(`Rate limited. Retrying after ${retryAfter} seconds.`);
          await new Promise(res => setTimeout(res, retryAfter * 1000));
        } else {
          // TODO: move somewhere else :) doesn't belong to caching function
          setCurrentPlaylistId(null);
          setAlternativeItem(null);
          console.error('Error fetching playlist items:', error);
          break;
        }
      }
    }
    localStorage.setItem(`playlist_${playlistId}_items`, JSON.stringify(items));
    localStorage.setItem(`playlist_${playlistId}_cached_at`, new Date().toISOString());
    //console.log(`Cached playlist ${playlistId} to local storage with ${items.length} items`);
  };
  const loadPlaylist = async playlistId => {
    const cachedAt = localStorage.getItem(`playlist_${playlistId}_cached_at`);

    //console.log({ cachedAt });
    const minutes = 15;
    if (!cachedAt || new Date(cachedAt) > new Date(new Date().getTime() - minutes * 60)) {
      await cachePlaylist(playlistId);
    }
    return JSON.parse(localStorage.getItem(`playlist_${playlistId}_items`));
  };
  const setAlternativeSongFromPlaylist = async (playlistId, ignoreItems) => {
    // console.log("set alternative song from playlist", playlistId);
    const items = await loadPlaylist(playlistId);
    const filteredItems = items.filter(item => {
      var _item$track;
      return !ignoreItems.includes((_item$track = item.track) == null ? void 0 : _item$track.id);
    });
    // console.log({ items, filteredItems, playlistId, ignoreItems });
    if (filteredItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      const randomSong = items[randomIndex];
      // console.log("set alternative item", randomSong.track)
      setAlternativeItem(randomSong.track);
    } else {
      setAlternativeItem(null);
    }
  };
  const updateCurrentPlaylistId = async () => {
    var _currentlyPlaying$con;
    const api = getSpotifyApi();
    let currentlyPlaying;
    try {
      currentlyPlaying = await (api == null ? void 0 : api.player.getCurrentlyPlayingTrack());
    } catch (error) {
      console.error(`Something broke updateCurrentPlaylistId`, error);
    }
    if (!currentlyPlaying) {
      return;
    }
    setCurrentlyPlayingItem(currentlyPlaying.item);

    //console.log(currentlyPlaying, 'currentlyPlaying');
    //console.log(currentlyPlaying?.context?.type, 'currentlyPlaying?.context?.type');

    if (((_currentlyPlaying$con = currentlyPlaying.context) == null ? void 0 : _currentlyPlaying$con.type) === 'playlist') {
      const playlistUri = currentlyPlaying.context.uri;
      const playlistId = playlistURIToID(playlistUri);
      setCurrentPlaylistId(playlistId);
      setCurrentlyPlayingItem(currentlyPlaying.item);
      setAlternativeSongFromPlaylist(playlistId, [getCurrentlyPlayingItem().id]);
    } else if (currentlyPlaying.is_playing) {
      // Track playing, from collection or not playlist
      setCurrentPlaylistId(null);
      setAlternativeItem(null);
    } else ;
    //console.log('updating current playing', getCurrentlyPlayingItem()?.name);
    //console.log('updating current playlist', getCurrentPlaylistId());
  };
  solidJs.createEffect(() => {
    waitForSpotifyPageElementToExist('now-playing-widget', setCurrentlyPlayingWidget);
    waitForSpotifyPageElementToExist('control-button-playpause', setPlayPauseButton);
  });
  solidJs.createEffect(() => {
    const nowPlayingWidget = getCurrentlyPlayingWidget();
    const playPauseButton = getPlayPauseButton();
    if (nowPlayingWidget && playPauseButton) {
      const checkAndUpdateCurrentSong = () => {
        const itemTitleElement = nowPlayingWidget.querySelector('[data-testid=context-item-link]');
        const lastItemTitle = getCurrentlyPlayingItemTitle();
        if (itemTitleElement && lastItemTitle !== itemTitleElement.textContent) {
          updateCurrentPlaylistId();
          setCurrentlyPlayingItemTitle(itemTitleElement.textContent);
        }
      };
      const observer = new MutationObserver(() => {
        checkAndUpdateCurrentSong();
      });
      observer.observe(nowPlayingWidget, {
        childList: true,
        subtree: true
      });
      observer.observe(playPauseButton, {
        childList: true,
        subtree: true
      });
    }
  });
  solidJs.onMount(async () => {
    var _item$context;
    const api = getSpotifyApi();
    const data = await api.player.getRecentlyPlayedTracks(1);
    const item = data.items[0];
    if (((_item$context = item.context) == null ? void 0 : _item$context.type) === 'playlist') {
      //console.log('load from history');
      const playlistId = playlistURIToID(item.context.uri);
      setCurrentPlaylistId(playlistId);
      setCurrentlyPlayingItem(item.track);
      setAlternativeSongFromPlaylist(playlistId, [getCurrentlyPlayingItem().id]);
    }
  });
  solidJs.createEffect(() => {
    const alternativeItem = getAlternativeItem();
    if (alternativeItem) {
      props.onBarActivated();
    } else {
      props.onBarDeactivated();
    }
  });
  return [web.memo(() => web.memo(() => !!props.isVisible)() && alternativeWidgetContainer()), web.memo(() => false)];
  function alternativeWidgetContainer() {
    return _tmpl$2$1();
  }
}
web.delegateEvents(["click"]);

var _tmpl$$1 = /*#__PURE__*/web.template(`<div><svg width=16px height=16px viewBox="0 0 24 24"role=img xmlns=http://www.w3.org/2000/svg><title>Spotimizer</title><path d="M9.317 9.451c.045.073.123.12.212.12.06 0 .116-.021.158-.057l.015-.012c.39-.325.741-.66 1.071-1.017 3.209-3.483 1.335-7.759 1.32-7.799-.09-.21-.03-.459.15-.594.195-.135.435-.12.615.033 10.875 10.114 7.995 17.818 7.785 18.337-.87 3.141-4.335 5.414-8.444 5.53-.138.008-.242.008-.363.008-4.852 0-8.977-2.989-8.977-6.807v-.06c0-5.297 4.795-10.522 5.009-10.744.136-.149.345-.195.525-.105.18.076.297.255.291.451-.043 1.036.167 1.935.631 2.7v.015l.002.001z">`),
  _tmpl$2 = /*#__PURE__*/web.template(`<style jsx dynamic>\n          .spotimizer-open-icon-opened::after \{\n            background-color: #1db954;\n            border-radius: 50%;\n            bottom: 0;\n            content: '';\n            display: block;\n            height: 4px;\n            left: 50%;\n            position: relative;\n            -webkit-transform: translateX(-50%);\n            transform: translateX(-50%);\n            width: 4px;\n            inline-size: 4px !important;\n          }\n\n          .spotimizer-open-icon-opened > svg \{\n            fill: #1db954;\n            margin-bottom: -1px;\n          }\n\n          .spotimizer-open-icon-opened > svg:hover \{\n            fill: #1ed760;\n          }\n\n          .spotimizer-open-icon-closed > svg \{\n            fill: hsla(0, 0%, 100%, 0.7);\n            margin-bottom: 1px;\n          }\n\n          .spotimizer-open-icon-closed > svg:hover \{\n            fill: #fff;\n          }\n        `);
function ExpandCollapseButton(props) {
  const [getIsExpanded, setIsExpanded] = solidJs.createSignal(true); // TODO: Set back to false for demo

  solidJs.createEffect(() => {
    if (props.isDeactivated) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  });
  return [(() => {
    var _el$ = _tmpl$$1();
    _el$.$$click = () => {
      if (!props.isDeactivated) {
        const currentState = getIsExpanded();
        if (currentState) {
          setIsExpanded(false);
          props.onCollapse();
        } else {
          setIsExpanded(true);
          props.onExpand();
        }
      }
    };
    web.effect(() => web.className(_el$, getIsExpanded() ? 'spotimizer-open-icon-opened' : 'spotimizer-open-icon-closed'));
    return _el$;
  })(), _tmpl$2()];
}
web.delegateEvents(["click"]);

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var stylesheetRegistry = {};

function hash(str) {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

var stringHash = hash;

var stylesheet = {};

(function (exports) {

	exports.__esModule = true;
	exports["default"] = void 0;

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); return Constructor; }

	/*
	Based on Glamor's sheet
	https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
	*/
	var isProd = typeof process !== 'undefined' && process.env && undefined === 'production';

	var isString = function isString(o) {
	  return Object.prototype.toString.call(o) === '[object String]';
	};

	var StyleSheet = /*#__PURE__*/function () {
	  function StyleSheet(_temp) {
	    var _ref = _temp === void 0 ? {} : _temp,
	        _ref$name = _ref.name,
	        name = _ref$name === void 0 ? 'stylesheet' : _ref$name,
	        _ref$optimizeForSpeed = _ref.optimizeForSpeed,
	        optimizeForSpeed = _ref$optimizeForSpeed === void 0 ? isProd : _ref$optimizeForSpeed,
	        _ref$isBrowser = _ref.isBrowser,
	        isBrowser = _ref$isBrowser === void 0 ? typeof window !== 'undefined' : _ref$isBrowser;

	    invariant(isString(name), '`name` must be a string');
	    this._name = name;
	    this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
	    invariant(typeof optimizeForSpeed === 'boolean', '`optimizeForSpeed` must be a boolean');
	    this._optimizeForSpeed = optimizeForSpeed;
	    this._isBrowser = isBrowser;
	    this._serverSheet = undefined;
	    this._tags = [];
	    this._injected = false;
	    this._rulesCount = 0;
	    var node = this._isBrowser && document.querySelector('meta[property="csp-nonce"]');
	    this._nonce = node ? node.getAttribute('content') : null;
	  }

	  var _proto = StyleSheet.prototype;

	  _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
	    invariant(typeof bool === 'boolean', '`setOptimizeForSpeed` accepts a boolean');
	    invariant(this._rulesCount === 0, 'optimizeForSpeed cannot be when rules have already been inserted');
	    this.flush();
	    this._optimizeForSpeed = bool;
	    this.inject();
	  };

	  _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
	    return this._optimizeForSpeed;
	  };

	  _proto.inject = function inject() {
	    var _this = this;

	    invariant(!this._injected, 'sheet already injected');
	    this._injected = true;

	    if (this._isBrowser && this._optimizeForSpeed) {
	      this._tags[0] = this.makeStyleTag(this._name);
	      this._optimizeForSpeed = 'insertRule' in this.getSheet();

	      if (!this._optimizeForSpeed) {
	        if (!isProd) {
	          console.warn('StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.');
	        }

	        this.flush();
	        this._injected = true;
	      }

	      return;
	    }

	    this._serverSheet = {
	      cssRules: [],
	      insertRule: function insertRule(rule, index) {
	        if (typeof index === 'number') {
	          _this._serverSheet.cssRules[index] = {
	            cssText: rule
	          };
	        } else {
	          _this._serverSheet.cssRules.push({
	            cssText: rule
	          });
	        }

	        return index;
	      },
	      deleteRule: function deleteRule(index) {
	        _this._serverSheet.cssRules[index] = null;
	      }
	    };
	  };

	  _proto.getSheetForTag = function getSheetForTag(tag) {
	    if (tag.sheet) {
	      return tag.sheet;
	    } // this weirdness brought to you by firefox


	    for (var i = 0; i < document.styleSheets.length; i++) {
	      if (document.styleSheets[i].ownerNode === tag) {
	        return document.styleSheets[i];
	      }
	    }
	  };

	  _proto.getSheet = function getSheet() {
	    return this.getSheetForTag(this._tags[this._tags.length - 1]);
	  };

	  _proto.insertRule = function insertRule(rule, index) {
	    invariant(isString(rule), '`insertRule` accepts only strings');

	    if (!this._isBrowser) {
	      if (typeof index !== 'number') {
	        index = this._serverSheet.cssRules.length;
	      }

	      this._serverSheet.insertRule(rule, index);

	      return this._rulesCount++;
	    }

	    if (this._optimizeForSpeed) {
	      var sheet = this.getSheet();

	      if (typeof index !== 'number') {
	        index = sheet.cssRules.length;
	      } // this weirdness for perf, and chrome's weird bug
	      // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule


	      try {
	        sheet.insertRule(rule, index);
	      } catch (error) {
	        if (!isProd) {
	          console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
	        }

	        return -1;
	      }
	    } else {
	      var insertionPoint = this._tags[index];

	      this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
	    }

	    return this._rulesCount++;
	  };

	  _proto.replaceRule = function replaceRule(index, rule) {
	    if (this._optimizeForSpeed || !this._isBrowser) {
	      var sheet = this._isBrowser ? this.getSheet() : this._serverSheet;

	      if (!rule.trim()) {
	        rule = this._deletedRulePlaceholder;
	      }

	      if (!sheet.cssRules[index]) {
	        // @TBD Should we throw an error?
	        return index;
	      }

	      sheet.deleteRule(index);

	      try {
	        sheet.insertRule(rule, index);
	      } catch (error) {
	        if (!isProd) {
	          console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
	        } // In order to preserve the indices we insert a deleteRulePlaceholder


	        sheet.insertRule(this._deletedRulePlaceholder, index);
	      }
	    } else {
	      var tag = this._tags[index];
	      invariant(tag, "old rule at index `" + index + "` not found");
	      tag.textContent = rule;
	    }

	    return index;
	  };

	  _proto.deleteRule = function deleteRule(index) {
	    if (!this._isBrowser) {
	      this._serverSheet.deleteRule(index);

	      return;
	    }

	    if (this._optimizeForSpeed) {
	      this.replaceRule(index, '');
	    } else {
	      var tag = this._tags[index];
	      invariant(tag, "rule at index `" + index + "` not found");
	      tag.parentNode.removeChild(tag);
	      this._tags[index] = null;
	    }
	  };

	  _proto.flush = function flush() {
	    this._injected = false;
	    this._rulesCount = 0;

	    if (this._isBrowser) {
	      this._tags.forEach(function (tag) {
	        return tag && tag.parentNode.removeChild(tag);
	      });

	      this._tags = [];
	    } else {
	      // simpler on server
	      this._serverSheet.cssRules = [];
	    }
	  };

	  _proto.cssRules = function cssRules() {
	    var _this2 = this;

	    if (!this._isBrowser) {
	      return this._serverSheet.cssRules;
	    }

	    return this._tags.reduce(function (rules, tag) {
	      if (tag) {
	        rules = rules.concat(Array.prototype.map.call(_this2.getSheetForTag(tag).cssRules, function (rule) {
	          return rule.cssText === _this2._deletedRulePlaceholder ? null : rule;
	        }));
	      } else {
	        rules.push(null);
	      }

	      return rules;
	    }, []);
	  };

	  _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
	    if (cssString) {
	      invariant(isString(cssString), 'makeStyleTag acceps only strings as second parameter');
	    }

	    var tag = document.createElement('style');
	    if (this._nonce) tag.setAttribute('nonce', this._nonce);
	    tag.type = 'text/css';
	    tag.setAttribute("data-" + name, '');

	    if (cssString) {
	      tag.appendChild(document.createTextNode(cssString));
	    }

	    var head = document.head || document.getElementsByTagName('head')[0];

	    if (relativeToTag) {
	      head.insertBefore(tag, relativeToTag);
	    } else {
	      head.appendChild(tag);
	    }

	    return tag;
	  };

	  _createClass(StyleSheet, [{
	    key: "length",
	    get: function get() {
	      return this._rulesCount;
	    }
	  }]);

	  return StyleSheet;
	}();

	exports["default"] = StyleSheet;

	function invariant(condition, message) {
	  if (!condition) {
	    throw new Error("StyleSheet: " + message + ".");
	  }
	} 
} (stylesheet));

(function (exports) {

	exports.__esModule = true;
	exports["default"] = void 0;

	var _stringHash = _interopRequireDefault(stringHash);

	var _stylesheet = _interopRequireDefault(stylesheet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var sanitize = function sanitize(rule) {
	  return rule.replace(/\/style/gi, '\\/style');
	};

	var StyleSheetRegistry = /*#__PURE__*/function () {
	  function StyleSheetRegistry(_temp) {
	    var _ref = _temp === void 0 ? {} : _temp,
	        _ref$styleSheet = _ref.styleSheet,
	        styleSheet = _ref$styleSheet === void 0 ? null : _ref$styleSheet,
	        _ref$optimizeForSpeed = _ref.optimizeForSpeed,
	        optimizeForSpeed = _ref$optimizeForSpeed === void 0 ? false : _ref$optimizeForSpeed,
	        _ref$isBrowser = _ref.isBrowser,
	        isBrowser = _ref$isBrowser === void 0 ? typeof window !== 'undefined' : _ref$isBrowser;

	    this._sheet = styleSheet || new _stylesheet["default"]({
	      name: 'styled-jsx',
	      optimizeForSpeed: optimizeForSpeed
	    });

	    this._sheet.inject();

	    if (styleSheet && typeof optimizeForSpeed === 'boolean') {
	      this._sheet.setOptimizeForSpeed(optimizeForSpeed);

	      this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
	    }

	    this._isBrowser = isBrowser;
	    this._fromServer = undefined;
	    this._indices = {};
	    this._instancesCounts = {};
	    this.computeId = this.createComputeId();
	    this.computeSelector = this.createComputeSelector();
	  }

	  var _proto = StyleSheetRegistry.prototype;

	  _proto.add = function add(props) {
	    var _this = this;

	    if (undefined === this._optimizeForSpeed) {
	      this._optimizeForSpeed = Array.isArray(props.children);

	      this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);

	      this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
	    }

	    if (this._isBrowser && !this._fromServer) {
	      this._fromServer = this.selectFromServer();
	      this._instancesCounts = Object.keys(this._fromServer).reduce(function (acc, tagName) {
	        acc[tagName] = 0;
	        return acc;
	      }, {});
	    }

	    var _this$getIdAndRules = this.getIdAndRules(props),
	        styleId = _this$getIdAndRules.styleId,
	        rules = _this$getIdAndRules.rules; // Deduping: just increase the instances count.


	    if (styleId in this._instancesCounts) {
	      this._instancesCounts[styleId] += 1;
	      return;
	    }

	    var indices = rules.map(function (rule) {
	      return _this._sheet.insertRule(rule);
	    }) // Filter out invalid rules
	    .filter(function (index) {
	      return index !== -1;
	    });
	    this._indices[styleId] = indices;
	    this._instancesCounts[styleId] = 1;
	  };

	  _proto.remove = function remove(props) {
	    var _this2 = this;

	    var _this$getIdAndRules2 = this.getIdAndRules(props),
	        styleId = _this$getIdAndRules2.styleId;

	    invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
	    this._instancesCounts[styleId] -= 1;

	    if (this._instancesCounts[styleId] < 1) {
	      var tagFromServer = this._fromServer && this._fromServer[styleId];

	      if (tagFromServer) {
	        tagFromServer.parentNode.removeChild(tagFromServer);
	        delete this._fromServer[styleId];
	      } else {
	        this._indices[styleId].forEach(function (index) {
	          return _this2._sheet.deleteRule(index);
	        });

	        delete this._indices[styleId];
	      }

	      delete this._instancesCounts[styleId];
	    }
	  };

	  _proto.update = function update(props, nextProps) {
	    this.add(nextProps);
	    this.remove(props);
	  };

	  _proto.flush = function flush() {
	    this._sheet.flush();

	    this._sheet.inject();

	    this._fromServer = undefined;
	    this._indices = {};
	    this._instancesCounts = {};
	    this.computeId = this.createComputeId();
	    this.computeSelector = this.createComputeSelector();
	  };

	  _proto.cssRules = function cssRules() {
	    var _this3 = this;

	    var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function (styleId) {
	      return [styleId, _this3._fromServer[styleId]];
	    }) : [];

	    var cssRules = this._sheet.cssRules();

	    return fromServer.concat(Object.keys(this._indices).map(function (styleId) {
	      return [styleId, _this3._indices[styleId].map(function (index) {
	        return cssRules[index].cssText;
	      }).join(_this3._optimizeForSpeed ? '' : '\n')];
	    }) // filter out empty rules
	    .filter(function (rule) {
	      return Boolean(rule[1]);
	    }));
	  }
	  /**
	   * createComputeId
	   *
	   * Creates a function to compute and memoize a jsx id from a basedId and optionally props.
	   */
	  ;

	  _proto.createComputeId = function createComputeId() {
	    var cache = {};
	    return function (baseId, props) {
	      if (!props) {
	        return "jsx-" + baseId;
	      }

	      var propsToString = String(props);
	      var key = baseId + propsToString; // return `jsx-${hashString(`${baseId}-${propsToString}`)}`

	      if (!cache[key]) {
	        cache[key] = "jsx-" + (0, _stringHash["default"])(baseId + "-" + propsToString);
	      }

	      return cache[key];
	    };
	  }
	  /**
	   * createComputeSelector
	   *
	   * Creates a function to compute and memoize dynamic selectors.
	   */
	  ;

	  _proto.createComputeSelector = function createComputeSelector(selectoPlaceholderRegexp) {
	    if (selectoPlaceholderRegexp === void 0) {
	      selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
	    }

	    var cache = {};
	    return function (id, css) {
	      // Sanitize SSR-ed CSS.
	      // Client side code doesn't need to be sanitized since we use
	      // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
	      if (!this._isBrowser) {
	        css = sanitize(css);
	      }

	      var idcss = id + css;

	      if (!cache[idcss]) {
	        cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
	      }

	      return cache[idcss];
	    };
	  };

	  _proto.getIdAndRules = function getIdAndRules(props) {
	    var _this4 = this;

	    var css = props.children,
	        dynamic = props.dynamic,
	        id = props.id;

	    if (dynamic) {
	      var styleId = this.computeId(id, dynamic);
	      return {
	        styleId: styleId,
	        rules: Array.isArray(css) ? css.map(function (rule) {
	          return _this4.computeSelector(styleId, rule);
	        }) : [this.computeSelector(styleId, css)]
	      };
	    }

	    return {
	      styleId: this.computeId(id),
	      rules: Array.isArray(css) ? css : [css]
	    };
	  }
	  /**
	   * selectFromServer
	   *
	   * Collects style tags from the document with id __jsx-XXX
	   */
	  ;

	  _proto.selectFromServer = function selectFromServer() {
	    var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
	    return elements.reduce(function (acc, element) {
	      var id = element.id.slice(2);
	      acc[id] = element;
	      return acc;
	    }, {});
	  };

	  return StyleSheetRegistry;
	}();

	exports["default"] = StyleSheetRegistry;

	function invariant(condition, message) {
	  if (!condition) {
	    throw new Error("StyleSheetRegistry: " + message + ".");
	  }
	} 
} (stylesheetRegistry));

var StyleSheetRegistry = /*@__PURE__*/getDefaultExportFromCjs(stylesheetRegistry);

new StyleSheetRegistry();

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.relative{position:relative}.left-0{left:0}.top-0{top:0}.block{display:block}.flex{display:flex}.flex-row-reverse{flex-direction:row-reverse}.transform{transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.gap-2{gap:.5rem}.rounded-lg{border-radius:.5rem}.bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.bg-red-600{--un-bg-opacity:1;background-color:rgb(220 38 38/var(--un-bg-opacity))}.p-4{padding:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.py-1{padding-bottom:.25rem;padding-top:.25rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}";
styleInject(css_248z);

var _tmpl$ = /*#__PURE__*/web.template(`<style jsx dynamic>\n          .spotimizer-open-icon-wrapper \{\n            margin-top: 5px;\n            margin-right: 8px;\n            cursor: pointer;\n          }\n\n          .spotimizer-open-icon-wrapper.bar-active \{\n            cursor: pointer;\n          }\n\n          .spotimizer-open-icon-wrapper.bar-inactive \{\n            cursor: not-allowed;\n          }\n        `);
function SpotifyPageInjector() {
  const [getNowPlayingBar, setNowPlayingBar] = solidJs.createSignal(null);
  const [getControlButtonNpv, setControlButtonNpv] = solidJs.createSignal(null);
  const [getIsCustomBarOpened, setIsCustomBarOpened] = solidJs.createSignal(true); // TODO: Set back to false for demo
  const [getIsCustomBarDeactivated, setIsCustomBarDeactivated] = solidJs.createSignal(false);
  solidJs.createEffect(() => {
    console.log('[spotimizer] Initializing app');
    waitForSpotifyPageElementToExist('now-playing-bar', setNowPlayingBar);
    waitForSpotifyPageElementToExist('control-button-npv', setControlButtonNpv);
  });
  solidJs.createEffect(() => {
    const bar = getNowPlayingBar();
    try {
      const row = bar.children[0];
      //const mediaInfo = row.children[0];
      //const mediaControls = row.children?.[1];
      //const playerSettings = row.children?.[2];
      web.render(() => web.createComponent(CustomBar, {
        get isVisible() {
          return getIsCustomBarOpened();
        },
        onBarActivated: () => {
          setIsCustomBarDeactivated(false);
        },
        onBarDeactivated: () => {
          setIsCustomBarDeactivated(true);
        }
      }), row);
    } catch (_unused) {
      console.warn('[spotimizer] Could not find now playing bar');
    }
  });
  solidJs.createEffect(() => {
    const controlButtonNpv = getControlButtonNpv();
    if (controlButtonNpv) {
      var _controlButtonNpv$par;
      // if we get in here again because the deactivation status has changed, we need to make sure to remove the old element
      // before injecting a new one
      const existingExpandCollapseButton = controlButtonNpv == null || (_controlButtonNpv$par = controlButtonNpv.parentElement) == null ? void 0 : _controlButtonNpv$par.querySelector('.spotimizer-open-icon-wrapper');
      //console.log({ existingExpandCollapseButton });
      if (existingExpandCollapseButton) {
        controlButtonNpv == null || controlButtonNpv.parentElement.removeChild(existingExpandCollapseButton);
      }
      const openIcon = document.createElement('div');
      openIcon.className = `spotimizer-open-icon-wrapper ${getIsCustomBarDeactivated() ? 'bar-inactive' : 'bar-active'}`;
      web.render(() => web.createComponent(ExpandCollapseButton, {
        onCollapse: () => setIsCustomBarOpened(false),
        onExpand: () => setIsCustomBarOpened(true),
        get isDeactivated() {
          return getIsCustomBarDeactivated();
        }
      }), openIcon);
      controlButtonNpv == null || controlButtonNpv.parentElement.insertBefore(openIcon, controlButtonNpv);
    }
  });
  return _tmpl$();
}
web.render(SpotifyPageInjector, document.body);

})(VM.solid.web, VM.solid);
